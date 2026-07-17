import { NextResponse } from "next/server";
import { findUploadByCode, recordDownload, cleanupExpired } from "@/lib/db";
import { isExpired } from "@/lib/format";
import { supabaseAdmin, UPLOADS_BUCKET } from "@/lib/supabase";

export async function GET(request) {
  await cleanupExpired();

  const { searchParams, origin } = new URL(request.url);
  const code = (searchParams.get("code") || "").toUpperCase().trim();
  const upload = code ? await findUploadByCode(code) : null;

  if (!upload || isExpired(upload)) {
    return NextResponse.redirect(`${origin}/share/${encodeURIComponent(code)}`);
  }

  await recordDownload(upload.id);

  if (upload.link_url) {
    return NextResponse.redirect(upload.link_url);
  }

  const db = supabaseAdmin();
  const { data } = db.storage.from(UPLOADS_BUCKET).getPublicUrl(upload.file_path, {
    download: upload.file_name,
  });

  return NextResponse.redirect(data.publicUrl);
}
