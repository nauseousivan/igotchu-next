import Link from "next/link";
import { cleanupExpired, listHubUploads, listTrending } from "@/lib/db";
import { collegeForCourse } from "@/lib/constants";
import { Icon, UploadIcon } from "@/components/icons";
import { uploadExtLabel, timeAgo } from "@/lib/format";
import HubSearch from "@/components/HubSearch";
import SplashScreen from "@/components/SplashScreen";

export const dynamic = "force-dynamic";

export default async function HubPage({ searchParams }) {
  await cleanupExpired();

  const sp = await searchParams;
  const search = (sp.q || "").trim();
  const college = (sp.college || "").trim();
  const course = (sp.course || "").trim();
  const sort = sp.sort || "newest";

  const validCollege = ["MCNP", "ISAP"].includes(college) ? college : "";
  const validCourse = course !== "" && collegeForCourse(course) !== null ? course : "";

  const files = await listHubUploads({ search, college: validCollege, course: validCourse, sort });
  const isFiltering = search !== "" || validCollege !== "" || validCourse !== "";
  const trending = isFiltering ? [] : await listTrending();

  return (
    <>
      <SplashScreen />

      <section className="pt-6 pb-6 sm:text-center sm:pt-20 sm:pb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight uppercase leading-[1.05]">
          Share reviewers
          <br />
          in <span className="hero-mark">seconds.</span>
        </h1>
        <p className="mt-3 sm:mt-5 text-[#6B6455] font-medium max-w-md sm:mx-auto text-[15px]">
          From your seniors, for you. No account needed.
        </p>
      </section>

      <HubSearch initial={{ search, college: validCollege, course: validCourse, sort }} />

      {trending.length > 0 && (
        <section className="mb-10">
          <h2 className="section-head mb-3">
            <Icon name="trending" size={16} />
            Trending this week
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {trending.map((t, i) => (
              <Link
                key={t.id}
                href={`/share/${t.share_code}`}
                className="card card-hover p-4 min-w-[220px] flex-shrink-0 block"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <UploadIcon upload={t} size={20} />
                  <span className="text-[11px] font-semibold text-[#9B927E]">#{i + 1}</span>
                </div>
                <p className="font-semibold text-sm truncate">{t.title}</p>
                <p className="text-xs text-[#6B6455] mt-1">
                  {t.subject} · {t.week_downloads} this week
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {files.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-[#F5EEDB] text-[#9B927E] flex items-center justify-center mx-auto mb-4">
            <Icon name="search" size={22} />
          </div>
          <p className="font-semibold text-[#1A1A1A]">No reviewers found</p>
          <p className="text-sm text-[#6B6455] mt-1">
            Try a different search — or be the hero who uploads the first one.
          </p>
        </div>
      ) : (
        <>
          <h2 className="section-head mb-3">
            <Icon name="zap" size={16} />
            Fresh drops
          </h2>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((f) => (
              <Link
                key={f.id}
                href={`/share/${f.share_code}`}
                className="card card-hover p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <UploadIcon upload={f} size={22} />
                  <div className="flex items-center gap-1.5">
                    {f.college && <span className={`badge-${f.college.toLowerCase()}`}>{f.college}</span>}
                    <span className="ext-chip">{uploadExtLabel(f)}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] leading-snug line-clamp-2">{f.title}</h3>
                  <p className="text-xs text-[#6B6455] mt-1">
                    {f.subject}
                    {f.course ? ` · ${f.course}` : ""}
                  </p>
                </div>
                {f.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {f.tags.split(",").map((tag) => (
                      <span key={tag} className="tag-chip">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-auto pt-3 flex items-center justify-between text-xs text-[#9B927E] border-t border-[#EFE8D4]">
                  <span className="flex items-center gap-1">
                    <Icon name="user" size={12} />
                    {f.uploader || "Anonymous"}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Icon name="download" size={12} />
                      {f.downloads}
                    </span>
                    {timeAgo(f.created_at)}
                  </span>
                </div>
              </Link>
            ))}
          </section>
        </>
      )}
    </>
  );
}
