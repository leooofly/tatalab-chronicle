import fs from "node:fs/promises";
import path from "node:path";
import { parseBackupFolder } from "@/src/lib/importer";
import { saveDraftPackage } from "@/src/lib/storage";

async function main() {
  const folderPath = process.argv[2] ? path.resolve(process.argv[2]) : path.join(process.cwd(), "data", "imports", "2", "2");
  const pkgInfoPath = path.join(folderPath, "pkg_info.dat");
  const pkgInfoRaw = await fs.readFile(pkgInfoPath, "utf8");
  const entries = await fs.readdir(folderPath, { recursive: true, withFileTypes: true });
  const packageFiles = entries
    .filter((entry) => entry.isFile() && /^\d{13}-\d{13}$/.test(entry.name))
    .map((entry) => path.join(entry.parentPath, entry.name));

  const draft = parseBackupFolder("tatalab-zaoshui", folderPath, pkgInfoRaw, packageFiles);
  const savedPath = await saveDraftPackage(draft.batch.id, draft);

  console.log(JSON.stringify({
    batchId: draft.batch.id,
    sourceLabel: draft.batch.sourceLabel,
    coverageStart: draft.batch.coverageStart,
    coverageEnd: draft.batch.coverageEnd,
    packageSlices: packageFiles.length,
    savedPath
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});