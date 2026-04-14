import fs from "node:fs/promises";
import path from "node:path";
import { parseImportedText } from "@/src/lib/importer";
import { listImportFiles, readImportFile, saveDraftPackage } from "@/src/lib/storage";

async function main() {
  const files = await listImportFiles();
  if (files.length === 0) {
    throw new Error("No files found in data/imports");
  }

  const filePath = process.argv[2] ? path.resolve(process.argv[2]) : files[0];
  const text = await readImportFile(filePath);
  const draft = parseImportedText("tatalab-zaoshui", path.basename(filePath), text, path.basename(filePath));
  const savedPath = await saveDraftPackage(draft.batch.id, draft);

  await fs.writeFile(path.join(process.cwd(), "data", "drafts", "latest-summary.txt"), draft.draftSummary, "utf8");
  console.log(JSON.stringify({ batchId: draft.batch.id, savedPath, messages: draft.messages.length, candidateEvents: draft.candidateEvents.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});