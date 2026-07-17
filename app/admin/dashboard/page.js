import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/auth";
import { getAdminStats, listAllUploads, listFeedback } from "@/lib/db";
import { humanFileSize, timeAgo, isExpired, uploadExtLabel } from "@/lib/format";
import { UploadIcon, Icon } from "@/components/icons";
import { adminLogout, deleteUploadAction, deleteFeedbackAction, purgeExpiredAction } from "../actions";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard — iGotchu" };

export default async function AdminDashboardPage() {
  if (!(await isAdminRequest())) redirect("/admin/login");

  const stats = await getAdminStats();
  const files = await listAllUploads();
  const feedbackRows = await listFeedback();

  return (
    <section className="pt-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-sm text-[#6B6455] mt-0.5">Keep it clean, keep it kind.</p>
        </div>
        <div className="flex gap-2">
          <form action={purgeExpiredAction}>
            <button type="submit" className="btn-outline !py-2 text-xs">
              <Icon name="timer" size={14} />
              Purge expired ({stats.expired_count})
            </button>
          </form>
          <form action={adminLogout}>
            <button type="submit" className="btn-outline !py-2 text-xs">
              <Icon name="logout" size={14} />
              Logout
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
        <div className="card p-4">
          <p className="text-xs text-[#9B927E] font-medium">Total files</p>
          <p className="text-2xl font-bold mt-1">{stats.total_files}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-[#9B927E] font-medium">Total downloads</p>
          <p className="text-2xl font-bold mt-1">{stats.total_downloads}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-[#9B927E] font-medium">Downloads, last 7 days</p>
          <p className="text-2xl font-bold mt-1">{stats.week_downloads}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-[#9B927E] font-medium">Storage used</p>
          <p className="text-2xl font-bold mt-1">{humanFileSize(stats.total_size)}</p>
        </div>
      </div>

      <div className="card p-5 sm:p-6 mb-7">
        <h2 className="flex items-center gap-2 font-semibold mb-1">
          <Icon name="message" size={16} className="text-[#9B927E]" />
          Feedback inbox
        </h2>
        <p className="text-xs text-[#9B927E] mb-4">What the students are saying. Latest first.</p>
        {feedbackRows.length === 0 ? (
          <p className="text-sm text-[#9B927E] py-4 text-center">Nothing yet. Peace and quiet.</p>
        ) : (
          <div className="space-y-2.5">
            {feedbackRows.map((fb) => (
              <div
                key={fb.id}
                className="flex items-start justify-between gap-3 rounded-lg bg-[#FFF8E7] border border-[#EFE8D4] p-3.5"
              >
                <div className="min-w-0">
                  <p className="text-sm text-[#4A4433] whitespace-pre-line break-words">{fb.message}</p>
                  <p className="text-[11px] text-[#9B927E] mt-1.5">
                    {fb.name || "Anonymous"} · {timeAgo(fb.created_at)}
                  </p>
                </div>
                <form action={deleteFeedbackAction} className="shrink-0">
                  <input type="hidden" name="id" value={fb.id} />
                  <button type="submit" className="icon-btn" title="Dismiss">
                    <Icon name="x" size={14} />
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-4 sm:p-6 overflow-x-auto">
        <h2 className="flex items-center gap-2 font-semibold mb-4">
          <Icon name="file-text" size={16} className="text-[#9B927E]" />
          All uploads
        </h2>
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="text-left text-[11px] text-[#9B927E] uppercase tracking-wider border-b border-[#E5DCC3]">
              <th className="py-2.5 pr-4 font-medium">Code</th>
              <th className="py-2.5 pr-4 font-medium">Title</th>
              <th className="py-2.5 pr-4 font-medium">Course</th>
              <th className="py-2.5 pr-4 font-medium">Uploader</th>
              <th className="py-2.5 pr-4 font-medium">Size</th>
              <th className="py-2.5 pr-4 font-medium">DLs</th>
              <th className="py-2.5 pr-4 font-medium">Expires</th>
              <th className="py-2.5 pr-4 font-medium">Uploaded</th>
              <th className="py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 && (
              <tr>
                <td colSpan={9} className="py-8 text-center text-[#9B927E]">
                  No uploads yet.
                </td>
              </tr>
            )}
            {files.map((f) => {
              const expired = isExpired(f);
              return (
                <tr
                  key={f.id}
                  className={`border-b border-[#EFE8D4] hover:bg-[#FFF3D6] transition-colors ${expired ? "opacity-50" : ""}`}
                >
                  <td className="py-2.5 pr-4 font-semibold">
                    <Link href={`/share/${f.share_code}`} className="hover:underline">
                      {f.share_code}
                    </Link>
                  </td>
                  <td className="py-2.5 pr-4 max-w-[220px]" title={f.title}>
                    <span className="flex items-center gap-1.5">
                      <UploadIcon upload={f} size={15} />
                      <span className="truncate">{f.title}</span>
                      {(f.visibility ?? "public") === "private" && (
                        <Icon name="lock-small" size={12} className="text-[#9B927E]" />
                      )}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4">
                    {f.college && <span className={`badge-${f.college.toLowerCase()}`}>{f.college}</span>}{" "}
                    <span className="text-xs text-[#6B6455]">{f.course || f.subject}</span>
                  </td>
                  <td className="py-2.5 pr-4 text-[#6B6455]">{f.uploader || "Anonymous"}</td>
                  <td className="py-2.5 pr-4 text-[#6B6455]">
                    {f.link_url ? "link" : humanFileSize(f.file_size || 0)}
                  </td>
                  <td className="py-2.5 pr-4 font-medium">{f.downloads}</td>
                  <td className="py-2.5 pr-4 text-[#9B927E] text-xs">
                    {f.expires_at
                      ? expired
                        ? "expired"
                        : new Date(f.expires_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      : "never"}
                  </td>
                  <td className="py-2.5 pr-4 text-[#9B927E] text-xs">{timeAgo(f.created_at)}</td>
                  <td className="py-2.5">
                    <ConfirmDeleteForm action={deleteUploadAction}>
                      <input type="hidden" name="id" value={f.id} />
                      <button type="submit" className="icon-btn !text-red-500 hover:!bg-red-50" title="Delete">
                        <Icon name="trash" size={15} />
                      </button>
                    </ConfirmDeleteForm>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
