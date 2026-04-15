import { NextResponse } from "next/server";
import { parseImportedText } from "@/src/lib/importer";
import { saveDraftPackage } from "@/src/lib/storage";
import { verifyAdminToken } from "@/src/lib/auth";

export async function POST(request: Request) {
  // 验证管理员身份，未通过则直接返回错误
  const authError = verifyAdminToken(request);
  if (authError) return authError;

  const body = (await request.json()) as { groupId?: string; sourceLabel?: string; text?: string; fileName?: string };

  if (!body.groupId || !body.sourceLabel || !body.text) {
    return NextResponse.json({ error: "groupId, sourceLabel, text are required" }, { status: 400 });
  }

  const draft = parseImportedText(body.groupId, body.sourceLabel, body.text, body.fileName ?? "manual.txt");
  const savedPath = await saveDraftPackage(draft.batch.id, draft);

  return NextResponse.json({
    ok: true,
    batchId: draft.batch.id,
    savedPath,
    messages: draft.messages.length,
    candidateEvents: draft.candidateEvents.length,
    requiresReview: draft.requiresReview,
    draftSummary: draft.draftSummary
  });
}