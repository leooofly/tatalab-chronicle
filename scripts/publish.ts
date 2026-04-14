import { readPublishedChronicle, writePublishedChronicle } from "@/src/lib/storage";

async function main() {
  const chronicle = await readPublishedChronicle();
  const nextVersion = { ...chronicle, generatedAt: new Date().toISOString() };
  await writePublishedChronicle(nextVersion);
  console.log(`Published at ${nextVersion.generatedAt}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});