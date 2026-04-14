import { readPublishedChronicle } from "@/src/lib/storage";

async function main() {
  const chronicle = await readPublishedChronicle();
  if (!chronicle.group?.id) throw new Error("Missing group.id");
  if (chronicle.events.length === 0) throw new Error("No events available");
  if (chronicle.stages.length === 0) throw new Error("No stages available");
  console.log(JSON.stringify({
    group: chronicle.group.name,
    stages: chronicle.stages.length,
    events: chronicle.events.length,
    milestones: chronicle.milestones.length,
    generatedAt: chronicle.generatedAt
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});