import { NextResponse } from "next/server";
import { readPublishedChronicle } from "@/src/lib/storage";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const chronicle = await readPublishedChronicle();

  if (chronicle.group.id !== id && chronicle.group.slug !== id) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  return NextResponse.json({
    generatedAt: chronicle.generatedAt,
    group: chronicle.group,
    corePeople: chronicle.corePeople,
    insights: chronicle.insights
  });
}