import { listDraftPackages, readDraftPackage } from "@/src/lib/storage";

async function main() {
  const drafts = await listDraftPackages();
  const latest = drafts.at(-1);
  if (!latest) {
    throw new Error("No draft package found. Run npm run import:batch first.");
  }

  const draft = await readDraftPackage(latest);
  console.log(draft.draftSummary);
  console.log("\n候选事件:");
  for (const event of draft.candidateEvents) {
    console.log(`- ${event.date} ${event.title}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});