import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { supabaseAdmin, UPLOADS_BUCKET } from "@/lib/supabase";
import { insertUpload, generateShareCode, cleanupExpired } from "@/lib/db";
import { collegeForCourse, TAGS, ALLOWED_EXTENSIONS, MAX_FILE_SIZE } from "@/lib/constants";

export async function POST(request) {
  await cleanupExpired();

  try {
    const formData = await request.formData();

    const linkUrl = (formData.get("link_url") || "").toString().trim();
    const isLink = linkUrl !== "";
    let file = null;

    if (isLink) {
      if (linkUrl.length > 500) {
        throw new Error("Link is too long (max 500 characters).");
      }
      if (!/^https?:\/\//i.test(linkUrl) || !URL.canParse(linkUrl)) {
        throw new Error("That link doesn't look valid — it must start with http:// or https://.");
      }
    } else {
      file = formData.get("file");
      if (!file || typeof file === "string" || file.size === 0) {
        throw new Error("Drop a file or paste a link first.");
      }
      if (file.size > MAX_FILE_SIZE) {
        throw new Error("File exceeds the 50MB limit.");
      }
      const ext = (file.name.split(".").pop() || "").toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        throw new Error("File type not allowed. Use PDF, DOCX, PPTX, JPG, PNG, or ZIP.");
      }
    }

    const visibility = (formData.get("visibility") || "public").toString() === "private" ? "private" : "public";

    const title = (formData.get("title") || "").toString().trim();
    if (title === "") throw new Error("Title is required.");

    const course = (formData.get("course") || "").toString().trim();
    const college = collegeForCourse(course);
    if (college === null) throw new Error("Pick your course / program.");

    let subject = (formData.get("subject") || "").toString().trim();
    if (subject === "") subject = "General";
    subject = subject.slice(0, 100);

    const description = (formData.get("description") || "").toString().trim();
    const anonymous = formData.get("anonymous") ? true : false;
    const uploader = anonymous ? "" : (formData.get("uploader") || "").toString().trim();

    const requestedTags = (formData.get("tags") || "")
      .toString()
      .split(",")
      .map((t) => t.trim())
      .filter((t) => TAGS.includes(t));
    let customTag = (formData.get("custom_tag") || "").toString().trim();
    if (customTag !== "") {
      customTag = customTag.replace(/,/g, " ").slice(0, 30);
      requestedTags.push(customTag);
    }

    const expiration = (formData.get("expiration") || "never").toString();
    const expiresAt =
      expiration === "1day"
        ? new Date(Date.now() + 86400 * 1000).toISOString()
        : expiration === "7days"
        ? new Date(Date.now() + 7 * 86400 * 1000).toISOString()
        : null;

    let fileName = null;
    let filePath = null;
    let fileSize = null;

    if (!isLink) {
      const ext = (file.name.split(".").pop() || "").toLowerCase();
      const storedName = randomBytes(16).toString("hex") + "." + ext;
      const buffer = Buffer.from(await file.arrayBuffer());

      const db = supabaseAdmin();
      const { error: uploadError } = await db.storage
        .from(UPLOADS_BUCKET)
        .upload(storedName, buffer, { contentType: file.type || "application/octet-stream" });
      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw new Error("Could not save the file on the server.");
      }

      fileName = file.name;
      filePath = storedName;
      fileSize = file.size;
    }

    const code = await generateShareCode();
    await insertUpload({
      share_code: code,
      title,
      subject,
      college,
      course,
      visibility,
      description,
      uploader,
      tags: requestedTags.length ? requestedTags.join(",") : null,
      file_name: fileName,
      file_path: filePath,
      link_url: isLink ? linkUrl : null,
      file_size: fileSize,
      expires_at: expiresAt,
    });

    const origin = new URL(request.url).origin;
    const link = `${origin}/share/${code}`;

    return NextResponse.json({ success: true, code, link });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
