export function humanFileSize(bytes) {
  if (bytes >= 1073741824) return `${Math.round((bytes / 1073741824) * 10) / 10} GB`;
  if (bytes >= 1048576) return `${Math.round((bytes / 1048576) * 10) / 10} MB`;
  if (bytes >= 1024) return `${Math.round((bytes / 1024) * 10) / 10} KB`;
  return `${bytes} B`;
}

export function fileExtension(name) {
  return (name.split(".").pop() || "").toLowerCase();
}

export function isLinkUpload(upload) {
  return !!upload.link_url;
}

/** Short label for the ext chip — GDrive / Link for link shares, file extension otherwise. */
export function uploadExtLabel(upload) {
  if (isLinkUpload(upload)) {
    return upload.link_url.toLowerCase().includes("drive.google") ? "GDrive" : "Link";
  }
  return fileExtension(upload.file_name || "").toUpperCase();
}

export function timeAgo(datetime) {
  const diff = (Date.now() - new Date(datetime).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(datetime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function isExpired(upload) {
  return upload.expires_at !== null && new Date(upload.expires_at).getTime() < Date.now();
}
