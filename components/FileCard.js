import { Icon, UploadIcon } from "./icons";
import { humanFileSize, isLinkUpload, uploadExtLabel, timeAgo } from "@/lib/format";
import CopyButton from "./CopyButton";

export default function FileCard({ upload, shareLink }) {
  const isLink = isLinkUpload(upload);
  const openLabel = isLink
    ? upload.link_url.toLowerCase().includes("drive.google")
      ? "Open GDrive"
      : "Open Link"
    : "Download";

  return (
    <div className="card p-6 sm:p-8 pop-in">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#FFF8E7] border-2 border-[#1A1A1A] flex items-center justify-center shrink-0">
          <UploadIcon upload={upload} size={24} />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug break-words">{upload.title}</h1>
          <p className="text-sm text-[#6B6455] mt-1.5 flex items-center flex-wrap gap-2">
            {upload.college && (
              <span className={`badge-${upload.college.toLowerCase()}`}>{upload.college}</span>
            )}
            <span className="ext-chip">{uploadExtLabel(upload)}</span>
            {(upload.visibility ?? "public") === "private" && (
              <span className="tag-chip">
                <Icon name="lock-small" size={11} />
                &nbsp;Private
              </span>
            )}
            {upload.subject}
            {upload.course && <span className="text-[#9B927E]">· {upload.course}</span>}
          </p>
          {upload.tags && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {upload.tags.split(",").map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {upload.description && (
        <p className="text-[#6B6455] text-sm mt-5 whitespace-pre-line">{upload.description}</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6">
        <div className="rounded-lg bg-[#FFF8E7] border border-[#EFE8D4] p-3 text-center">
          <p className="text-[11px] text-[#9B927E] font-medium">Uploader</p>
          <p className="font-medium text-sm truncate mt-0.5">{upload.uploader || "Anonymous"}</p>
        </div>
        <div className="rounded-lg bg-[#FFF8E7] border border-[#EFE8D4] p-3 text-center">
          <p className="text-[11px] text-[#9B927E] font-medium">Size</p>
          <p className="font-medium text-sm mt-0.5">{isLink ? "—" : humanFileSize(upload.file_size || 0)}</p>
        </div>
        <div className="rounded-lg bg-[#FFF8E7] border border-[#EFE8D4] p-3 text-center">
          <p className="text-[11px] text-[#9B927E] font-medium">{isLink ? "Opens" : "Downloads"}</p>
          <p className="font-medium text-sm mt-0.5">{upload.downloads}</p>
        </div>
        <div className="rounded-lg bg-[#FFF8E7] border border-[#EFE8D4] p-3 text-center">
          <p className="text-[11px] text-[#9B927E] font-medium">Uploaded</p>
          <p className="font-medium text-sm mt-0.5">{timeAgo(upload.created_at)}</p>
        </div>
      </div>

      {upload.expires_at && (
        <p className="flex items-center justify-center gap-1.5 text-xs text-amber-600 mt-4">
          <Icon name="timer" size={13} />
          Expires{" "}
          {new Date(upload.expires_at).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      )}

      {(upload.visibility ?? "public") === "private" && (
        <p className="text-center text-xs text-[#9B927E] mt-4">
          Unlisted — only people with the code or link can see this.
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-2.5 mt-7">
        <a
          href={`/api/download?code=${encodeURIComponent(upload.share_code)}`}
          className="btn-primary"
          {...(isLink ? { target: "_blank", rel: "noopener" } : {})}
        >
          <Icon name={isLink ? "external" : "download"} size={16} />
          {openLabel}
        </a>
        <CopyButton text={upload.share_code} message="Code copied" icon="copy" iconSize={15}>
          {upload.share_code}
        </CopyButton>
        <CopyButton text={shareLink} message="Link copied" icon="link" iconSize={15}>
          Copy link
        </CopyButton>
      </div>
    </div>
  );
}
