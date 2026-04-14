import { NextResponse } from "next/server";
import { listDraftPackages, readDraftPackage } from "@/src/lib/storage";

export async function POST() {
  const drafts = await listDraftPackages();
  const latest = drafts.at(-1);

  if (!latest) {
    return NextResponse.json({ error: "No draft package found" }, { status: 404 });
  }

  const draft = await readDraftPackage(latest);
  return NextResponse.json({
    ok: true,
    latestDraft: latest,
    draftSummary: draft.draftSummary,
    messages: draft.messages.length,
    candidateEvents: draft.candidateEvents
  });
}