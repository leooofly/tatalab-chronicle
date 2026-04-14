import { sampleChronicle } from "@/src/lib/sample-data";
import { writePublishedChronicle } from "@/src/lib/storage";

async function main() {
  await writePublishedChronicle({ ...sampleChronicle, generatedAt: new Date().toISOString() });
  console.log("Rebuilt published chronicle from local seed data.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});