import { NextResponse } from "next/server";
import { aiLogs } from "@/lib/aiLogs";

export async function GET() {
  return NextResponse.json(aiLogs.slice(0, 10)); // últimos 10 logs
}