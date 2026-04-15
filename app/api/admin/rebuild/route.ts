import { NextResponse } from "next/server";
import { readPublishedChronicle, writePublishedChronicle } from "@/src/lib/storage";
import { verifyAdminToken } from "@/src/lib/auth";

export async function POST(request: Request) {
  // 验证管理员身份，未通过则直接返回错误
  const authError = verifyAdminToken(request);
  if (authError) return authError;

  const chronicle = await readPublishedChronicle();
  const nextVersion = {
    ...chronicle,
    generatedAt: new Date().toISOString()
  };
  await writePublishedChronicle(nextVersion);

  return NextResponse.json({ ok: true, generatedAt: nextVersion.generatedAt });
}