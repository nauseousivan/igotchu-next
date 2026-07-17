import { randomInt } from "crypto";
import { supabaseAdmin, UPLOADS_BUCKET } from "./supabase";

/** Unique 6-char share code (skips lookalike chars 0/O, 1/I/L). */
export async function generateShareCode() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const db = supabaseAdmin();
  let code;
  for (;;) {
    code = Array.from({ length: 6 }, () => chars[randomInt(chars.length)]).join("");
    const { data } = await db.from("uploads").select("id").eq("share_code", code).maybeSingle();
    if (!data) break;
  }
  return code;
}

export async function findUploadByCode(code) {
  const db = supabaseAdmin();
  const { data } = await db
    .from("uploads")
    .select("*")
    .eq("share_code", code.toUpperCase().trim())
    .maybeSingle();
  return data || null;
}

export async function insertUpload(row) {
  const db = supabaseAdmin();
  const { data, error } = await db.from("uploads").insert(row).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function recordDownload(uploadId) {
  const db = supabaseAdmin();
  await db.rpc("increment_downloads", { upload_id: uploadId });
  await db.from("download_log").insert({ upload_id: uploadId });
}

/** List public uploads for the hub, with optional search/filter/sort. */
export async function listHubUploads({ search = "", college = "", course = "", sort = "newest" }) {
  const db = supabaseAdmin();
  let q = db.from("uploads").select("*").eq("visibility", "public");

  if (search) {
    q = q.or(
      `title.ilike.%${search}%,description.ilike.%${search}%,uploader.ilike.%${search}%,subject.ilike.%${search}%`
    );
  }
  if (college) q = q.eq("college", college);
  if (course) q = q.eq("course", course);

  q = sort === "popular"
    ? q.order("downloads", { ascending: false }).order("created_at", { ascending: false })
    : q.order("created_at", { ascending: false });

  const { data } = await q.limit(60);
  return data || [];
}

/** Top 5 most-downloaded public uploads in the last 7 days. */
export async function listTrending() {
  const db = supabaseAdmin();
  const since = new Date(Date.now() - 7 * 86400 * 1000).toISOString();

  const { data: logs } = await db
    .from("download_log")
    .select("upload_id")
    .gte("downloaded_at", since);
  if (!logs || !logs.length) return [];

  const counts = new Map();
  for (const { upload_id } of logs) counts.set(upload_id, (counts.get(upload_id) || 0) + 1);

  const ids = [...counts.keys()];
  const { data: uploads } = await db
    .from("uploads")
    .select("*")
    .eq("visibility", "public")
    .in("id", ids);
  if (!uploads) return [];

  return uploads
    .map((u) => ({ ...u, week_downloads: counts.get(u.id) || 0 }))
    .sort((a, b) => b.week_downloads - a.week_downloads)
    .slice(0, 5);
}

/** Delete expired uploads (storage objects + rows). Safe to call often. */
export async function cleanupExpired() {
  const db = supabaseAdmin();
  const { data: rows } = await db
    .from("uploads")
    .select("id, file_path")
    .not("expires_at", "is", null)
    .lt("expires_at", new Date().toISOString());
  if (!rows || !rows.length) return;

  const paths = rows.filter((r) => r.file_path).map((r) => r.file_path);
  if (paths.length) await db.storage.from(UPLOADS_BUCKET).remove(paths);

  await db.from("uploads").delete().in("id", rows.map((r) => r.id));
}

export async function deleteUpload(id) {
  const db = supabaseAdmin();
  const { data: row } = await db.from("uploads").select("file_path").eq("id", id).single();
  if (row?.file_path) await db.storage.from(UPLOADS_BUCKET).remove([row.file_path]);
  await db.from("uploads").delete().eq("id", id);
}

export async function getAdminStats() {
  const db = supabaseAdmin();
  const { data: uploads } = await db.from("uploads").select("downloads, file_size, expires_at");
  const total_files = uploads?.length || 0;
  const total_downloads = (uploads || []).reduce((s, u) => s + (u.downloads || 0), 0);
  const total_size = (uploads || []).reduce((s, u) => s + (u.file_size || 0), 0);
  const expired_count = (uploads || []).filter(
    (u) => u.expires_at && new Date(u.expires_at).getTime() < Date.now()
  ).length;

  const since = new Date(Date.now() - 7 * 86400 * 1000).toISOString();
  const { count: week_downloads } = await db
    .from("download_log")
    .select("id", { count: "exact", head: true })
    .gte("downloaded_at", since);

  return { total_files, total_downloads, total_size, expired_count, week_downloads: week_downloads || 0 };
}

export async function listAllUploads() {
  const db = supabaseAdmin();
  const { data } = await db.from("uploads").select("*").order("created_at", { ascending: false });
  return data || [];
}

export async function listFeedback(limit = 50) {
  const db = supabaseAdmin();
  const { data } = await db
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data || [];
}

export async function insertFeedback(name, message) {
  const db = supabaseAdmin();
  const { error } = await db.from("feedback").insert({ name: name || null, message });
  if (error) throw new Error(error.message);
}

export async function deleteFeedback(id) {
  const db = supabaseAdmin();
  await db.from("feedback").delete().eq("id", id);
}
