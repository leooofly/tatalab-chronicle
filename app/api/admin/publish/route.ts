import { NextResponse } from "next/server";
import { readPublishedChronicle } from "@/src/lib/storage";

export async function POST() {
  const chronicle = await readPublishedChronicle();

  return NextResponse.json({
    ok: true,
    publishedAt: chronicle.generatedAt,
    stageCount: chronicle.stages.length,
    eventCount: chronicle.events.length,
    milestoneCount: chronicle.milestones.length,
    note: "MVP uses JSON-backed publication. Replace with DB-backed version on the cloud server later."
  });
}