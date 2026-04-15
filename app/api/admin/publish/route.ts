import { NextResponse } from "next/server";
import { readPublishedChronicle } from "@/src/lib/storage";
import { verifyAdminToken } from "@/src/lib/auth";

export async function POST(request: Request) {
  // 验证管理员身份，未通过则直接返回错误
  const authError = verifyAdminToken(request);
  if (authError) return authError;

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