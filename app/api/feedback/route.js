import { NextResponse } from "next/server";
import { insertFeedback } from "@/lib/db";

const COOLDOWN_SECONDS = 30;
const COOKIE_NAME = "ig_last_feedback";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const message = (formData.get("message") || "").toString().trim();
    const name = (formData.get("name") || "").toString().trim().slice(0, 100);

    if (message.length < 3) throw new Error("Say a little more than that.");
    if (message.length > 1000) throw new Error("Keep it under 1000 characters.");

    const lastAt = request.cookies.get(COOKIE_NAME)?.value;
    if (lastAt && Date.now() - Number(lastAt) < COOLDOWN_SECONDS * 1000) {
      throw new Error("Chill — wait a bit before sending another one.");
    }

    await insertFeedback(name || null, message);

    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE_NAME, String(Date.now()), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: COOLDOWN_SECONDS,
    });
    return res;
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
