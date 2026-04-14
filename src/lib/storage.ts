import fs from "node:fs/promises";
import path from "node:path";
import type { DraftPackage, NormalizedMessage, PublishedChronicle, RawImportBatch, TimelineEvent } from "@/src/lib/types";

const root = process.cwd();
const dataDir = path.join(root, "data");
const publishedFile = path.join(dataDir, "published", "current.json");
const importsDir = path.join(dataDir, "imports");
const draftsDir = path.join(dataDir, "drafts");
const remotePublishedUrl = process.env.CHRONICLE_DATA_URL?.trim();

export async function ensureDataDirs() {
  await Promise.all([
    fs.mkdir(path.join(dataDir, "published"), { recursive: true }),
    fs.mkdir(importsDir, { recursive: true }),
    fs.mkdir(draftsDir, { recursive: true })
  ]);
}

export async function readPublishedChronicle(): Promise<PublishedChronicle> {
  if (remotePublishedUrl) {
    try {
      const response = await fetch(remotePublishedUrl, {
        headers: { accept: "application/json" },
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`Remote chronicle fetch failed with ${response.status}`);
      }

      return (await response.json()) as PublishedChronicle;
    } catch (error) {
      console.warn(`[chronicle] Failed to read remote data from ${remotePublishedUrl}, falling back to local file.`, error);
    }
  }

  const raw = await fs.readFile(publishedFile, "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, "")) as PublishedChronicle;
}

export async function writePublishedChronicle(payload: PublishedChronicle) {
  await ensureDataDirs();
  await fs.writeFile(publishedFile, JSON.stringify(payload, null, 2), "utf8");
}

export async function listImportFiles() {
  await ensureDataDirs();
  const entries = await fs.readdir(importsDir, { withFileTypes: true });
  return entries.filter((entry) => entry.isFile()).map((entry) => path.join(importsDir, entry.name));
}

export async function readImportFile(filePath: string) {
  return fs.readFile(filePath, "utf8");
}

export async function saveDraftPackage(name: string, payload: DraftPackage) {
  await ensureDataDirs();
  const target = path.join(draftsDir, `${name}.json`);
  await fs.writeFile(target, JSON.stringify(payload, null, 2), "utf8");
  return target;
}

export async function readDraftPackage(name: string): Promise<DraftPackage> {
  const raw = await fs.readFile(path.join(draftsDir, `${name}.json`), "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, "")) as DraftPackage;
}

export async function listDraftPackages() {
  await ensureDataDirs();
  const entries = await fs.readdir(draftsDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name.replace(/\.json$/, ""));
}

export function dedupeMessages(messages: NormalizedMessage[]) {
  const seen = new Set<string>();
  return messages.filter((message) => {
    if (seen.has(message.duplicateKey)) {
      return false;
    }
    seen.add(message.duplicateKey);
    return true;
  });
}

export function sortEvents(events: TimelineEvent[]) {
  return [...events].sort((a, b) => a.date.localeCompare(b.date));
}

export function buildBatchId() {
  return `batch-${new Date().toISOString().replace(/[.:]/g, "-")}`;
}

export function createReviewSummary(batch: RawImportBatch, messages: NormalizedMessage[], events: TimelineEvent[]) {
  return [
    `导入批次 ${batch.id}`,
    `来源: ${batch.sourceLabel}`,
    `覆盖消息数: ${messages.length}`,
    `候选事件数: ${events.length}`,
    "请重点检查脱敏命中、事件标题是否准确、是否存在断章取义。"
  ].join("\n");
}
