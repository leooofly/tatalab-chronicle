import fs from "node:fs/promises";
import path from "node:path";
import { writePublishedChronicle } from "@/src/lib/storage";
import type {
  CorePerson,
  DailyDigestItem,
  GroupInsight,
  Milestone,
  PublishedChronicle,
  ReleaseHistoryItem,
  ReleaseSummary,
  TimelineEvent,
  TimelineStage
} from "@/src/lib/types";

type ExportMessage = {
  sender_username?: string;
  create_time_iso: string;
  message_content?: string;
  base_type?: number;
  local_type?: number;
};

type ExportMeta = {
  matched_group?: {
    username?: string;
    nick_name?: string;
  };
  chat_room?: {
    owner?: string;
  };
  message_export?: {
    message_count?: number;
    first_timestamp_iso?: string;
    last_timestamp_iso?: string;
    type_counts?: Record<string, number>;
  };
};

function parseBody(content?: string) {
  if (!content) return "";
  return content.split(":\n", 2).at(-1)?.trim() ?? content.trim();
}

function colorFor(index: number) {
  return (["blue", "cyan", "indigo", "pink", "green"] as const)[index % 5];
}

async function main() {
  const baseDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(process.cwd(), "data", "imports");
  const messagesPath = path.join(baseDir, "wd-messages.json");
  const metaPath = path.join(baseDir, "wd-group-meta.json");
  const readmePath = path.join(baseDir, "wd-README.txt");

  const [messagesRaw, metaRaw, readme] = await Promise.all([
    fs.readFile(messagesPath, "utf8"),
    fs.readFile(metaPath, "utf8"),
    fs.readFile(readmePath, "utf8")
  ]);

  const messages = JSON.parse(messagesRaw.replace(/^\uFEFF/, "")) as ExportMessage[];
  const meta = JSON.parse(metaRaw.replace(/^\uFEFF/, "")) as ExportMeta;

  const textMessages = messages.filter((msg) => msg.base_type === 1 && parseBody(msg.message_content));
  const ownerId = meta.chat_room?.owner ?? "wxid_487q1s4juq2s22";
  const ownerMessages = textMessages.filter((msg) => msg.sender_username === ownerId);

  const dayCounts = new Map<string, number>();
  for (const msg of messages) {
    const day = msg.create_time_iso.slice(0, 10);
    dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1);
  }
  const busiestDay = [...dayCounts.entries()].sort((a, b) => b[1] - a[1])[0];

  const senderCounts = new Map<string, number>();
  for (const msg of textMessages) {
    const sender = msg.sender_username || "unknown";
    senderCounts.set(sender, (senderCounts.get(sender) ?? 0) + 1);
  }

  const firstIso = meta.message_export?.first_timestamp_iso ?? messages[0]?.create_time_iso ?? new Date().toISOString();
  const lastIso = meta.message_export?.last_timestamp_iso ?? messages.at(-1)?.create_time_iso ?? new Date().toISOString();
  const start = new Date(firstIso);
  const end = new Date(lastIso);
  const totalDuration = end.getTime() - start.getTime();
  const quarter = totalDuration / 4;
  const boundaries = [0, 1, 2, 3, 4].map((index) => new Date(start.getTime() + quarter * index));

  const stageDefs = [
    { id: "origin", label: "归档起点", tone: "第一次归档就能看出这里不是冷清的工具群，而是有人回应的在场空间。" },
    { id: "ritual", label: "夜聊成节律", tone: "作息提醒和深夜互动开始形成可辨认的群体节律。" },
    { id: "expansion", label: "交流外溢", tone: "话题从陪伴扩展到产品、AI、链接和分享，群的用途变得更立体。" },
    { id: "renewal", label: "近期活跃", tone: "到最近一段，群仍保持高频互动，说明它没有变成静态存档。" }
  ] as const;

  const stages: TimelineStage[] = stageDefs.map((stage, index) => {
    const stageStart = boundaries[index];
    const stageEnd = boundaries[index + 1];
    const stageMessages = messages.filter((msg) => {
      const time = new Date(msg.create_time_iso).getTime();
      return time >= stageStart.getTime() && (index === 3 ? time <= stageEnd.getTime() : time < stageEnd.getTime());
    });
    return {
      id: stage.id,
      label: stage.label,
      period: `${stageStart.toISOString().slice(0, 10)} ~ ${stageEnd.toISOString().slice(0, 10)}`,
      summary: `这一阶段归档到 ${stageMessages.length} 条消息，显示群在“陪伴 + 讨论 + 分享”之间持续流动。`,
      tone: stage.tone,
      color: colorFor(index)
    };
  });

  const findStage = (iso: string) => {
    const time = new Date(iso).getTime();
    for (let i = 0; i < 4; i += 1) {
      const stageStart = boundaries[i].getTime();
      const stageEnd = boundaries[i + 1].getTime();
      if (time >= stageStart && (i === 3 ? time <= stageEnd : time < stageEnd)) {
        return stageDefs[i].id;
      }
    }
    return "renewal";
  };

  const ownerSleepQuote = ownerMessages.find((msg) => /晚安|睡吧|该睡了/.test(parseBody(msg.message_content)));
  const firstConversation = textMessages[0];
  const latestConversation = [...textMessages].reverse().find((msg) => /agent|产品|商业化|API|微信|飞书|AI/i.test(parseBody(msg.message_content)));

  const observedNames = ["塔塔", "码塔", "倒放", "银海", "兔会计Scott", "ShawnLee", "白干饭", "ai小奇GG", "jiangye", "楠溪"];

  const events: TimelineEvent[] = [
    {
      id: "wd-e1",
      date: firstIso.slice(0, 10),
      title: "当前可考证的归档从 2 月中旬开始",
      summary: "真实导出结果显示，这个群至少在 2026 年 2 月中旬已经处于活跃交流状态，而且一开始就不是单一打卡群。",
      stageId: findStage(firstIso),
      tags: ["归档", "起点"],
      quote: firstConversation ? parseBody(firstConversation.message_content).slice(0, 80) : undefined,
      quoteVisibility: firstConversation ? "public" : "internal",
      sourceIds: ["wd-export-first"]
    },
    {
      id: "wd-e2",
      date: ownerSleepQuote?.create_time_iso.slice(0, 10) ?? "2026-03-20",
      title: "深夜提醒把群的节律感固定下来",
      summary: "在高活跃日期里，能看到群主直接发出“睡吧”“晚安”“该睡了”这样的提醒，这让群的主题从口号变成了真实节律。",
      stageId: findStage(ownerSleepQuote?.create_time_iso ?? "2026-03-20T00:10:41+08:00"),
      tags: ["早睡", "陪伴"],
      quote: ownerSleepQuote ? parseBody(ownerSleepQuote.message_content).slice(0, 80) : "晚安",
      quoteVisibility: "public",
      sourceIds: ["wd-export-owner-sleep"]
    },
    {
      id: "wd-e3",
      date: busiestDay?.[0] ?? "2026-03-20",
      title: "高峰日证明这里是持续有人回应的群",
      summary: `导出区间内最活跃的一天是 ${busiestDay?.[0] ?? "2026-03-20"}，当天共有 ${busiestDay?.[1] ?? 0} 条消息，说明群并非偶发热闹，而是有稳定互动密度。`,
      stageId: findStage(`${busiestDay?.[0] ?? "2026-03-20"}T12:00:00+08:00`),
      tags: ["活跃度", "高峰"],
      quoteVisibility: "internal",
      sourceIds: ["wd-export-peak-day"]
    },
    {
      id: "wd-e4",
      date: lastIso.slice(0, 10),
      title: "到最近阶段，群讨论仍在向产品与 AI 延展",
      summary: "最新导出的消息里，除了作息和陪伴，也出现了产品定位、Agent、API、办公场景等讨论，说明群的交流半径在继续外溢。",
      stageId: findStage(lastIso),
      tags: ["AI", "产品讨论"],
      quote: latestConversation ? parseBody(latestConversation.message_content).slice(0, 100) : undefined,
      quoteVisibility: latestConversation ? "public" : "internal",
      sourceIds: ["wd-export-latest"]
    }
  ];

  const milestones: Milestone[] = [
    {
      id: "wd-m1",
      title: "首次拿到真实 WD 导出",
      label: "真实数据接入",
      summary: "这意味着编年史从示例数据阶段进入真实群史整理阶段。",
      metric: `${meta.message_export?.message_count ?? messages.length} 条消息`,
      date: lastIso.slice(0, 10),
      color: "blue"
    },
    {
      id: "wd-m2",
      title: "归档窗口覆盖 60 天",
      label: "时间跨度明确",
      summary: "当前真实数据已经能支撑一版“近两个月群史”，后续只需继续补更早 WD 导出。",
      metric: `${dayCounts.size} 天`,
      date: firstIso.slice(0, 10),
      color: "cyan"
    },
    {
      id: "wd-m3",
      title: "群主在导出窗口内保持高频在场",
      label: "核心人物稳定",
      summary: "群主消息量位居前列，说明群的节律感并非匿名自发，而是有人持续在场维护。",
      metric: `${senderCounts.get(ownerId) ?? 0} 条文本消息`,
      date: busiestDay?.[0] ?? lastIso.slice(0, 10),
      color: "indigo"
    },
    {
      id: "wd-m4",
      title: "文本、表情、链接、图片混合出现",
      label: "交流形式多样",
      summary: "这不是纯通知流，而是带有明显分享和互动性的群聊生态。",
      metric: `${Object.keys(meta.message_export?.type_counts ?? {}).length} 类消息类型`,
      date: lastIso.slice(0, 10),
      color: "green"
    }
  ];

  const corePeople: CorePerson[] = [
    {
      id: "wd-p1",
      name: "tata / 塔塔",
      role: "群主 / 氛围发起者",
      bio: "根据 WD 导出结果，群主在归档窗口内保持高频发言，尤其在深夜提醒和回应中有持续存在感。",
      contribution: "把“该睡了”这种简单提醒，变成群体节律的锚点。",
      keywords: ["宝妈", "群主", "晚安提醒", "持续在场"],
      avatar: "/tata-avatar.png"
    },
    {
      id: "wd-p2",
      name: "倒放",
      role: "稳定互动者",
      bio: "从真实聊天片段和系统消息里都能看到这个名字，属于这段时间窗口内清晰可见的活跃成员。",
      contribution: "让群里的日常讨论和回应更有连续性。",
      keywords: ["音乐", "互动", "被@提及"]
    },
    {
      id: "wd-p3",
      name: "码塔",
      role: "高频参与者",
      bio: "在系统消息与聊天片段里反复出现，是这段归档窗口内存在感较强的成员之一。",
      contribution: "帮助群从单向提醒变成多向讨论。",
      keywords: ["高频参与", "回应", "共同讨论"]
    },
    {
      id: "wd-p4",
      name: "银海",
      role: "持续在场的群友",
      bio: "虽然不是唯一高频成员，但在系统可见名字里反复出现，说明其在这个群的近期历史里有稳定痕迹。",
      contribution: "构成了群体稳定感的一部分。",
      keywords: ["在场", "近期活跃", "共同体"]
    },
    {
      id: "wd-p5",
      name: "兔会计Scott",
      role: "被看见的共创成员",
      bio: "在近期归档窗口中，这个名字能被系统消息识别出来，说明它确实参与了这段集体历史。",
      contribution: "让编年史不只围绕群主，也能看见群友共同出现的痕迹。",
      keywords: ["共创", "可见成员", "群体历史"]
    }
  ];

  const insights: GroupInsight[] = [
    {
      id: "wd-i1",
      title: "当前可考证群史是一个高密度的 60 天切片",
      body: `这次 WD 导出覆盖 ${dayCounts.size} 天、${meta.message_export?.message_count ?? messages.length} 条消息，足以支撑一版真实编年史，但还不足以代表完整建群史。`,
      accent: "blue"
    },
    {
      id: "wd-i2",
      title: "“早睡”不是唯一话题，陪伴和产品讨论并存",
      body: `从真实消息看，群里既有晚安提醒，也有 AI、产品、链接分享和日常玩笑。当前已被看见的名字包括 ${observedNames.join("、")}，说明它更像一个有主题的关系网络，而不是单一任务群。`,
      accent: "pink"
    },
    {
      id: "wd-i3",
      title: "下一步价值在于继续补更早 WD 导出",
      body: "现在最值得做的不是重写解密器，而是继续从其他保留历史的电脑上跑 WD，把更早时间段并进来。",
      accent: "green"
    }
  ];

  const releaseHighlights = [
    `这次发布覆盖 ${firstIso.slice(0, 10)} 到 ${lastIso.slice(0, 10)} 的真实聊天窗口，重点不是展示全文，而是把这段群史整理成可阅读的公开版本。`,
    `本轮整理抽出了 ${events.length} 个关键事件、${milestones.length} 个里程碑和 ${corePeople.length} 位核心人物，让群友先看见“这一版最值得看的部分”。`,
    "今天的轻更新会告诉大家最近发生了什么，而真正的大块叙事仍然留给时间线、里程碑和人物区块。"
  ];

  const dailyDigest: DailyDigestItem[] = [
    {
      id: "daily-1",
      title: "今天补进来的不是全文，而是线索",
      detail: `这次新增整理把 ${meta.message_export?.message_count ?? messages.length} 条消息压缩成少量可公开的结构化结果，方便群友快速知道最近这版站点更新了什么。`
    },
    {
      id: "daily-2",
      title: "今天最值得看的，是哪几个变化",
      detail: `高峰日仍然落在 ${busiestDay?.[0] ?? "2026-03-20"}，而且最近阶段的话题已经明显延展到 AI、产品和更日常的互相回应。`
    },
    {
      id: "daily-3",
      title: "今天点进时间线前，先知道这一版怎么读",
      detail: "把这版当成一份周摘要更合适：先看更新卡，再看里程碑，最后进入长时间线，会更容易理解群到底发生了什么。"
    }
  ];

  const release: ReleaseSummary = {
    id: `release-${lastIso.slice(0, 10)}`,
    type: "weekly",
    label: "本周摘要",
    publishedAt: new Date().toISOString(),
    periodStart: firstIso.slice(0, 10),
    periodEnd: lastIso.slice(0, 10),
    summary: "这一版公开站点不是简单堆消息，而是把最近拿到的真实聊天窗口整理成一份先可浏览、再可深读的周更版本。",
    editorNote: "日更信息只做轻提示，帮助群友知道今天发生了什么；真正的长线变化仍然交给编年史主体来讲述。",
    highlights: releaseHighlights,
    metrics: [
      { label: "更新类型", value: "周更" },
      { label: "覆盖天数", value: `${dayCounts.size} 天` },
      { label: "公开事件", value: `${events.length} 条` },
      { label: "核心人物", value: `${corePeople.length} 位` }
    ],
    dailyDigest
  };

  const releaseHistory: ReleaseHistoryItem[] = [
    {
      id: "release-real-data-entry",
      type: "rebuild",
      label: "首次真实数据接入",
      publishedAt: new Date().toISOString(),
      periodStart: firstIso.slice(0, 10),
      periodEnd: lastIso.slice(0, 10),
      summary: "首次拿到真实 WD 导出后，对当前公开编年史做了一次完整重建。"
    },
    {
      id: release.id,
      type: release.type,
      label: release.label,
      publishedAt: release.publishedAt,
      periodStart: release.periodStart,
      periodEnd: release.periodEnd,
      summary: "把当前这批真实导出整理成一版更适合群友快速理解的周更摘要。"
    }
  ];

  const chronicle: PublishedChronicle = {
    generatedAt: release.publishedAt,
    release,
    releaseHistory,
    group: {
      id: "tatalab-zaoshui",
      slug: "tatalab-yiqi-zaoshui",
      name: "tatalab-一起早睡",
      subtitle: `当前已归档 ${dayCounts.size} 天的真实聊天记录`,
      description: "这是一个基于真实 WD 导出结果整理的公开只读编年史。当前版本覆盖 2026-02-13 到 2026-04-13 的聊天切片，不公开聊天全文，只保留用于理解群文化和阶段变化的摘要与片段。",
      mission: "用公开而克制的编年史形式，帮助群友理解这个群的来处、节律和温度。",
      locationHint: "当前真实导出来源于 messages.json / group-meta.json；原始 README 已归档到项目 data/imports。",
      updateCadence: "后续以新的 WD 导出为准进行人工确认后更新。",
      startedAt: firstIso.slice(0, 10),
      curator: "Iris",
      ownerName: "tata",
      ownerRole: "群主 / 氛围发起者",
      ownerBio: "一位宝妈，也是一位把日常照料、温柔自律和长期陪伴串起来的人。当前真实归档里，她的发言和晚安提醒构成了群的节律锚点。",
      ownerAvatar: "/tata-avatar.png",
      principles: [
        "公开页面只展示摘要、阶段结论和少量精选片段，不公开聊天全文。",
        "涉及隐私、安全提醒、联系方式和争议性内容的原始消息不直接公开。",
        "当前站点只代表已归档时间窗口，不把未获得的数据硬写成完整历史。"
      ],
      trustStatement: "这份站点基于真实导出，但仍然坚持克制公开。"
    },
    stages,
    milestones,
    events,
    corePeople,
    insights
  };

  await writePublishedChronicle(chronicle);

  const report = {
    firstIso,
    lastIso,
    messageCount: meta.message_export?.message_count ?? messages.length,
    textCount: textMessages.length,
    busiestDay,
    ownerTextCount: senderCounts.get(ownerId) ?? 0,
    importedReadmePreview: readme.slice(0, 200)
  };
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
