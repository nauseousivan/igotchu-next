import { NextResponse } from "next/server";
import { verifyAdminSession, ADMIN_COOKIE } from "@/lib/auth";

export async function proxy(request) {
  const token = request.cookies.get(ADMIN_COOKIE.name)?.value;
  const valid = await verifyAdminSession(token);
  if (!valid) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard"],
};
