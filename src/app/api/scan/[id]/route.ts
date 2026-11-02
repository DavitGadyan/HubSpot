import { NextResponse } from "next/server";
import { advanceScan } from "@/lib/audit/service";

export const maxDuration = 60;

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const progress = await advanceScan(id);
  return NextResponse.json(progress);
}
