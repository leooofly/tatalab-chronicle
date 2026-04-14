import { NextResponse } from "next/server";
import { readPublishedChronicle, writePublishedChronicle } from "@/src/lib/storage";

export async function POST() {
  const chronicle = await readPublishedChronicle();
  const nextVersion = {
    ...chronicle,
    generatedAt: new Date().toISOString()
  };
  await writePublishedChronicle(nextVersion);

  return NextResponse.json({ ok: true, generatedAt: nextVersion.generatedAt });
}