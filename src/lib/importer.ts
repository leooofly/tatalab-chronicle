import crypto from "node:crypto";
import path from "node:path";
import type { DraftPackage, NormalizedMessage, RawImportBatch, TimelineEvent } from "@/src/lib/types";
import { buildBatchId, createReviewSummary, dedupeMessages } from "@/src/lib/storage";

const linePattern = /^(?<date>\d{4}-\d{2}-\d{2})\s+(?<time>\d{2}:\d{2})(?::\d{2})?\s+-\s+(?<sender>[^:]{1,40}):\s*(?<content>.+)$/;
const systemPattern = /^(?<date>\d{4}-\d{2}-\d{2})\s+(?<time>\d{2}:\d{2})(?::\d{2})?\s+-\s*(?<content>.+)$/;

const milestoneRules = [
  { match: /(建群|开群|拉群)/, title: "群的起点被记录下来", tag: "建群" },
  { match: /(改名|群名|一起早睡)/, title: "群名与身份感逐渐成形", tag: "群名" },
  { match: /(早睡|作息|打卡)/, title: "共同作息目标开始稳定出现", tag: "作息" },
  { match: /(欢迎|新朋友|加入)/, title: "新的成员带来阶段变化", tag: "成员变化" },
  { match: /(规则|约定|提醒)/, title: "群内默契逐渐变成规则", tag: "群规" }
];

const sensitiveRules = [
  { key: "phone", match: /1\d{10}/ },
  { key: "wechat", match: /(vx|微信|wechat)[:：]?[a-zA-Z0-9_-]{5,}/i },
  { key: "money", match: /(收款码|转账|银行卡|支付宝|¥|￥)/ },
  { key: "address", match: /(地址|小区|门牌|单元|室)/ },
  { key: "medical", match: /(病历|诊断|医院|药方)/ },
  { key: "child", match: /(宝宝|孩子|小孩|儿子|女儿)/ }
];

function normalizeContent(content: string) {
  return content.replace(/\s+/g, " ").trim();
}

function detectContentType(content: string): NormalizedMessage["contentType"] {
  if (/\[(图片|语音|视频|文件)\]/.test(content)) {
    return "media-placeholder";
  }
  if (/撤回|加入了群聊|拍了拍/.test(content)) {
    return "system";
  }
  return "text";
}

function detectRedactions(content: string) {
  return sensitiveRules.filter((rule) => rule.match.test(content)).map((rule) => rule.key);
}

function hashKey(input: string) {
  return crypto.createHash("sha1").update(input).digest("hex");
}

function stageForDate(date: string) {
  const year = Number.parseInt(date.slice(0, 4), 10);
  if (year <= 2023) return "origin";
  if (year === 2024) return "ritual";
  if (year === 2025) return "expansion";
  return "renewal";
}

function toIsoFromMillis(value: number) {
  return new Date(value).toISOString();
}

function decodePkgInfo(pkgInfoRaw: string) {
  const roomMatch = pkgInfoRaw.match(/(\d+@chatroom)/);
  const prefixMatch = pkgInfoRaw.match(/WXGBACKUPPACKAGEPREFIX_([^\"]+)/);
  return {
    roomId: roomMatch?.[1],
    label: prefixMatch?.[1] ?? "微信备份聊天"
  };
}

export function parseImportedText(groupId: string, sourceLabel: string, text: string, fileName = "manual.txt"): DraftPackage {
  const batchId = buildBatchId();
  const batch: RawImportBatch = {
    id: batchId,
    groupId,
    sourceLabel,
    sourceType: "wechat-text",
    importedAt: new Date().toISOString(),
    fileNames: [fileName]
  };

  const messages: NormalizedMessage[] = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const chat = line.match(linePattern);
      const system = line.match(systemPattern);
      const date = chat?.groups?.date ?? system?.groups?.date;
      const time = chat?.groups?.time ?? system?.groups?.time;
      const sender = chat?.groups?.sender ?? "系统";
      const content = normalizeContent(chat?.groups?.content ?? system?.groups?.content ?? line);
      const timestamp = date && time ? `${date}T${time}:00+08:00` : new Date().toISOString();
      return {
        id: `${batchId}-msg-${index + 1}`,
        batchId,
        groupId,
        timestamp,
        sender,
        content,
        contentType: detectContentType(content),
        duplicateKey: hashKey(`${date}|${time}|${sender}|${content}`),
        redactionFlags: detectRedactions(content)
      } satisfies NormalizedMessage;
    });

  const deduped = dedupeMessages(messages);
  const candidateEvents = deduped
    .flatMap((message) => milestoneRules
      .filter((rule) => rule.match.test(message.content))
      .map((rule, idx) => ({
        id: `${message.id}-event-${idx + 1}`,
        date: message.timestamp.slice(0, 10),
        title: rule.title,
        summary: `${message.sender} 提到了“${rule.tag}”相关内容，适合作为阶段演变的公开线索。`,
        stageId: stageForDate(message.timestamp.slice(0, 10)),
        tags: [rule.tag],
        quote: message.redactionFlags.length > 0 ? undefined : message.content.slice(0, 120),
        quoteVisibility: message.redactionFlags.length > 0 ? "redacted" : "internal",
        sourceIds: [message.id]
      } satisfies TimelineEvent)))
    .slice(0, 24);

  return {
    batch,
    messages: deduped,
    candidateEvents,
    draftSummary: createReviewSummary(batch, deduped, candidateEvents),
    requiresReview: true
  };
}

export function parseBackupFolder(groupId: string, folderPath: string, pkgInfoRaw: string, packageFiles: string[]): DraftPackage {
  const batchId = buildBatchId();
  const ranges = packageFiles
    .map((filePath) => path.basename(filePath))
    .map((name) => {
      const match = name.match(/^(\d{13})-(\d{13})$/);
      if (!match) {
        return null;
      }
      return {
        start: Number.parseInt(match[1], 10),
        end: Number.parseInt(match[2], 10),
        name
      };
    })
    .filter((item): item is { start: number; end: number; name: string } => Boolean(item))
    .sort((a, b) => a.start - b.start);

  const meta = decodePkgInfo(pkgInfoRaw);
  const first = ranges[0];
  const last = ranges.at(-1);
  const batch: RawImportBatch = {
    id: batchId,
    groupId,
    sourceLabel: meta.label,
    sourceType: "wechat-backup-package",
    importedAt: new Date().toISOString(),
    coverageStart: first ? toIsoFromMillis(first.start) : undefined,
    coverageEnd: last ? toIsoFromMillis(last.end) : undefined,
    fileNames: packageFiles.map((filePath) => path.relative(folderPath, filePath)),
    notes: meta.roomId ? `chatroom=${meta.roomId}` : undefined
  };

  const candidateEvents: TimelineEvent[] = [];
  if (first) {
    candidateEvents.push({
      id: `${batchId}-backup-first`,
      date: toIsoFromMillis(first.start).slice(0, 10),
      title: "已发现最早一段可整理的群备份记录",
      summary: `当前离线备份至少覆盖到 ${toIsoFromMillis(first.start).slice(0, 10)}，可以据此回溯群的早期阶段。`,
      stageId: stageForDate(toIsoFromMillis(first.start).slice(0, 10)),
      tags: ["备份", "起点"],
      quoteVisibility: "internal",
      sourceIds: [first.name]
    });
  }
  if (last) {
    candidateEvents.push({
      id: `${batchId}-backup-last`,
      date: toIsoFromMillis(last.end).slice(0, 10),
      title: "备份记录延续到最近阶段",
      summary: `这批备份持续覆盖到 ${toIsoFromMillis(last.end).slice(0, 10)}，说明编年史可以横跨多个阶段而不是只呈现短期切片。`,
      stageId: stageForDate(toIsoFromMillis(last.end).slice(0, 10)),
      tags: ["备份", "延续"],
      quoteVisibility: "internal",
      sourceIds: [last.name]
    });
  }
  if (ranges.length > 12) {
    candidateEvents.push({
      id: `${batchId}-backup-density`,
      date: last ? toIsoFromMillis(last.end).slice(0, 10) : new Date().toISOString().slice(0, 10),
      title: "聊天备份跨越多个时间切片",
      summary: `目录内发现 ${ranges.length} 个时间切片，适合先按阶段整理，再逐步补充里程碑与人物线索。`,
      stageId: last ? stageForDate(toIsoFromMillis(last.end).slice(0, 10)) : "renewal",
      tags: ["备份", "时间跨度"],
      quoteVisibility: "internal",
      sourceIds: ranges.slice(0, 5).map((item) => item.name)
    });
  }

  return {
    batch,
    messages: [],
    candidateEvents,
    draftSummary: [
      `导入批次 ${batch.id}`,
      `来源: ${batch.sourceLabel}`,
      meta.roomId ? `聊天标识: ${meta.roomId}` : undefined,
      first ? `覆盖开始: ${toIsoFromMillis(first.start).slice(0, 10)}` : undefined,
      last ? `覆盖结束: ${toIsoFromMillis(last.end).slice(0, 10)}` : undefined,
      `时间切片数: ${ranges.length}`,
      "这是备份包级别的预览摘要；若要抽取具体聊天内容，还需要后续补上解包/解密适配器。"
    ].filter(Boolean).join("\n"),
    requiresReview: true
  };
}