import { NextResponse } from "next/server";
import { listDraftPackages, readDraftPackage } from "@/src/lib/storage";
import { verifyAdminToken } from "@/src/lib/auth";

export async function POST(request: Request) {
  // 验证管理员身份，未通过则直接返回错误
  const authError = verifyAdminToken(request);
  if (authError) return authError;

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