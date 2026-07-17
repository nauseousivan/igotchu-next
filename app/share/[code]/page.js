import Link from "next/link";
import { cleanupExpired, findUploadByCode } from "@/lib/db";
import { isExpired } from "@/lib/format";
import { getOrigin } from "@/lib/url";
import FileCard from "@/components/FileCard";
import { Icon } from "@/components/icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { code } = await params;
  const upload = await findUploadByCode(code.toUpperCase());
  return { title: upload ? `${upload.title} — iGotchu` : "File not found — iGotchu" };
}

export default async function SharePage({ params }) {
  await cleanupExpired();

  const { code } = await params;
  let upload = await findUploadByCode(code.toUpperCase());
  const expired = upload && isExpired(upload);
  if (expired) upload = null;

  const origin = await getOrigin();

  return (
    <section className="max-w-2xl mx-auto pt-14">
      {upload ? (
        <FileCard upload={upload} shareLink={`${origin}/share/${upload.share_code}`} />
      ) : (
        <div className="card p-12 text-center pop-in">
          <div className="w-12 h-12 rounded-full bg-[#F5EEDB] text-[#9B927E] flex items-center justify-center mx-auto mb-4">
            <Icon name={expired ? "timer" : "search"} size={22} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">{expired ? "Link expired" : "File not found"}</h1>
          <p className="text-[#6B6455] text-sm mt-1.5">
            {expired
              ? "This file has expired and was removed. Ask the uploader to share it again."
              : "That share code doesn't exist, or the file was deleted."}
          </p>
          <div className="flex justify-center gap-2.5 mt-6">
            <Link href="/" className="btn-outline">
              Back to hub
            </Link>
            <Link href="/receive" className="btn-primary">
              Try a code
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
