"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signAdminSession, ADMIN_COOKIE } from "@/lib/auth";
import { deleteUpload, deleteFeedback, cleanupExpired } from "@/lib/db";

export async function adminLogin(prevState, formData) {
  const username = (formData.get("username") || "").toString().trim();
  const password = (formData.get("password") || "").toString();

  const validUser = username === process.env.ADMIN_USER;
  const validPass = validUser && (await bcrypt.compare(password, process.env.ADMIN_PASS_HASH));
  if (!validUser || !validPass) {
    return { error: "Wrong username or password." };
  }

  const token = await signAdminSession();
  const store = await cookies();
  store.set(ADMIN_COOKIE.name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE.maxAge,
  });
  redirect("/admin/dashboard");
}

export async function adminLogout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE.name);
  redirect("/admin/login");
}

export async function deleteUploadAction(formData) {
  const id = Number(formData.get("id"));
  if (id) await deleteUpload(id);
  redirect("/admin/dashboard");
}

export async function deleteFeedbackAction(formData) {
  const id = Number(formData.get("id"));
  if (id) await deleteFeedback(id);
  redirect("/admin/dashboard");
}

export async function purgeExpiredAction() {
  await cleanupExpired();
  redirect("/admin/dashboard");
}
