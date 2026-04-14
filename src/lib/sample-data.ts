import type { PublishedChronicle } from "@/src/lib/types";

export const sampleChronicle: PublishedChronicle = {
  generatedAt: "2026-04-13T12:00:00+08:00",
  release: {
    id: "release-2026-week-15",
    type: "weekly",
    label: "本周摘要",
    publishedAt: "2026-04-13T12:00:00+08:00",
    periodStart: "2026-04-07",
    periodEnd: "2026-04-13",
    summary: "这周不是单纯多了几条消息，而是群里更明显地把陪伴、节律和共创讨论串到了一起。",
    editorNote: "这是一版周更摘要，适合先看更新线索，再进入长时间线。",
    highlights: [
      "本周最重要的变化，是讨论从作息提醒更自然地延伸到彼此的生活状态。",
      "群主与高频群友的在场感更清晰，公开叙事不再只有一个中心人物。",
      "这一版更像一次正式周报，而不是简单补录。"
    ],
    metrics: [
      { label: "更新类型", value: "周更" },
      { label: "覆盖范围", value: "7 天" },
      { label: "新增线索", value: "3 条重点" }
    ],
    dailyDigest: [
      {
        id: "sample-d1",
        title: "今天的群更像在互相接住",
        detail: "今天最明显的不是热闹，而是大家会顺手回应彼此的疲惫、拖延和情绪。"
      },
      {
        id: "sample-d2",
        title: "作息之外也在聊生活",
        detail: "讨论没有停在“早点睡”，而是自然延伸到工作、家庭和最近怎么把日子过稳。"
      },
      {
        id: "sample-d3",
        title: "适合先看本周摘要再回到时间线",
        detail: "如果第一次进入这个站，先看这一版的更新说明，会比直接跳进长时间线更容易理解。"
      }
    ]
  },
  releaseHistory: [
    {
      id: "release-2026-week-15",
      type: "weekly",
      label: "本周摘要",
      publishedAt: "2026-04-13T12:00:00+08:00",
      periodStart: "2026-04-07",
      periodEnd: "2026-04-13",
      summary: "把最近一周的节律、关系感和重点变化整理成一版对外可读的周更。"
    },
    {
      id: "release-2026-month-03",
      type: "monthly",
      label: "三月归档",
      publishedAt: "2026-04-01T10:00:00+08:00",
      periodStart: "2026-03-01",
      periodEnd: "2026-03-31",
      summary: "以月度归档方式整理群在三月的高峰、人物和阶段变化。"
    }
  ],
  group: {
    id: "tatalab-zaoshui",
    slug: "tatalab-yiqi-zaoshui",
    name: "tatalab-一起早睡",
    subtitle: "从 2021 年开始被保存下来的陪伴与早睡群体记忆。",
    description: "这是一个围绕早睡、日常陪伴与温柔自律展开的群体编年史。当前站点基于群友提供的离线微信备份整理而来，不展示完整聊天全文，而是通过阶段、里程碑和精选片段，记录群如何从日常提醒长成有默契的共同体。",
    mission: "用公开而克制的编年史形式，帮助群友理解这个群的来处、文化和温度。",
    locationHint: "聊天记录来自群友提供的离线微信备份目录 data/imports/2。",
    updateCadence: "每周整理一次，补历史时可手工全量重建。",
    startedAt: "2021-06-05",
    curator: "Iris",
    ownerName: "tata",
    ownerRole: "群主 / 氛围发起者",
    ownerBio: "一位宝妈，也是一位把日常照料、温柔自律和长期陪伴串起来的人。她把早睡这件小事，慢慢做成了可以被看见的群文化。当前头像已替换为你提供的卡通形象。",
    ownerAvatar: "/tata-avatar.png",
    principles: [
      "公开信息只展示摘要与精选片段，不公开聊天全文。",
      "任何会伤害现实关系的敏感细节，都默认不进入公开站。",
      "编年史强调理解群的变化，而不是评价个体。"
    ],
    trustStatement: "这不是八卦档案，而是一份经过节制处理的群体记忆。"
  },
  stages: [
    {
      id: "origin",
      label: "起意",
      period: "2023 秋",
      summary: "最早的记录显示，这个群从互相提醒作息开始，气氛松弛，但已经出现了持续陪伴的苗头。",
      tone: "像一个刚点亮的小夜灯，先让人愿意留下来。",
      color: "blue"
    },
    {
      id: "ritual",
      label: "成习惯",
      period: "2024 春夏",
      summary: "早睡、打卡、互相提醒逐渐有了稳定节律，群里开始出现共同语言和默认默契。",
      tone: "从偶尔相遇，变成每天都有人等你一下。",
      color: "cyan"
    },
    {
      id: "expansion",
      label: "成文化",
      period: "2025",
      summary: "讨论内容开始扩展到情绪、家庭、成长和彼此支持，群不再只是一条作息提醒链。",
      tone: "节律之外，人和人之间的信任开始发芽。",
      color: "indigo"
    },
    {
      id: "renewal",
      label: "继续生长",
      period: "2026 至今",
      summary: "新成员和旧成员一起把这个群重新理解为一个缓慢但可靠的同行空间。",
      tone: "不是热闹，而是有人在。",
      color: "pink"
    }
  ],
  milestones: [
    {
      id: "m1",
      title: "早睡被命名成共同目标",
      label: "群目标成形",
      summary: "早睡从单个提醒动作，变成群体默认的共同主题。",
      metric: "目标被持续提及",
      date: "2023-10-10",
      color: "blue"
    },
    {
      id: "m2",
      title: "提醒开始带有陪伴感",
      label: "氛围稳定",
      summary: "群友不再只发一句“早点睡”，而是会接住彼此的疲惫和迟到。",
      metric: "互动更连续",
      date: "2024-05-15",
      color: "cyan"
    },
    {
      id: "m3",
      title: "群主气质被看见",
      label: "角色清晰",
      summary: "tata 的温柔坚持逐渐成为群的情绪锚点。",
      metric: "核心人物稳定出现",
      date: "2025-01-05",
      color: "indigo"
    },
    {
      id: "m4",
      title: "编年史开始整理群的历史",
      label: "群记忆被保存",
      summary: "离线导入聊天记录后，群的变化第一次被系统性地记录下来。",
      metric: "周更编年史",
      date: "2026-04-13",
      color: "green"
    }
  ],
  events: [
    {
      id: "e1",
      date: "2023-09-08",
      title: "最初的作息提醒出现",
      summary: "早期记录里能看到零散但明确的作息提醒，这说明群一开始就带着轻微的互相照看。",
      stageId: "origin",
      tags: ["早睡", "起点"],
      quote: "今天早点睡，明天一起精神一点。",
      quoteVisibility: "public",
      sourceIds: ["seed-1"]
    },
    {
      id: "e2",
      date: "2024-03-18",
      title: "提醒从任务感变成陪伴感",
      summary: "记录里开始出现更柔和的催睡方式，群的语气明显有了共同风格。",
      stageId: "ritual",
      tags: ["陪伴", "语气"],
      quote: "晚一点也没关系，但记得照顾好自己。",
      quoteVisibility: "public",
      sourceIds: ["seed-2"]
    },
    {
      id: "e3",
      date: "2025-02-11",
      title: "群聊主题开始扩展",
      summary: "大家会从作息聊到家庭、工作和情绪，这标志着群的信任感在增强。",
      stageId: "expansion",
      tags: ["扩展", "信任"],
      quote: "原来早睡不是目标本身，是让彼此过得稳一点。",
      quoteVisibility: "public",
      sourceIds: ["seed-3"]
    },
    {
      id: "e4",
      date: "2026-04-13",
      title: "群编年史开始运行",
      summary: "群历史从碎片聊天记录，第一次被整理成对外友好的长期叙事。",
      stageId: "renewal",
      tags: ["编年史", "整理"],
      quoteVisibility: "internal",
      sourceIds: ["seed-4"]
    }
  ],
  corePeople: [
    {
      id: "p1",
      name: "tata",
      role: "群主 / 氛围发起者",
      bio: "一位宝妈，用温柔、稳定和持续出现，给群建立了可以依赖的情绪底色。",
      contribution: "把“早点睡”从一句提醒做成了一种互相接住的方式。",
      keywords: ["宝妈", "稳定", "照料", "发起者"]
    },
    {
      id: "p2",
      name: "群里夜归的人",
      role: "真实生活的反馈者",
      bio: "总有人晚睡、掉队、忙乱，他们让群没有变成整齐划一的表演。",
      contribution: "让提醒拥有现实感，让陪伴不是口号。",
      keywords: ["真实", "疲惫", "被接住"]
    },
    {
      id: "p3",
      name: "安静但常在的人",
      role: "群体温度的维持者",
      bio: "他们不一定说很多，但会在关键时候回应，形成稳定的在场感。",
      contribution: "把群从热闹变成可靠。",
      keywords: ["回应", "默契", "稳定"]
    }
  ],
  insights: [
    {
      id: "i1",
      title: "这个群最重要的，不是效率，而是可依赖性",
      body: "记录里反复出现的不是高强度打卡，而是有人愿意提醒、有人会回应、有人知道你为什么今天又晚了。",
      accent: "blue"
    },
    {
      id: "i2",
      title: "tata 的角色像一个情绪锚点",
      body: "她不是把所有人都管理起来，而是通过持续出现，让群友觉得这里不会突然消失。",
      accent: "pink"
    },
    {
      id: "i3",
      title: "公开编年史是为了增进理解，不是为了暴露私密",
      body: "因此网站只展示经过脱敏和筛选后的内容，把群的文化留下来，把个人隐私留在群里。",
      accent: "green"
    }
  ]
};
