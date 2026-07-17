import { NextResponse } from "next/server";
import { cleanupExpired } from "@/lib/db";

export async function GET(request) {
  // Vercel Cron sends this header; reject anything else to stop randos from
  // hitting the endpoint (it's cheap either way, but no reason to allow it).
  const auth = request.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await cleanupExpired();
  return NextResponse.json({ success: true });
}
