import { cleanupExpired, findUploadByCode } from "@/lib/db";
import { isExpired } from "@/lib/format";
import { getOrigin } from "@/lib/url";
import CodeInput from "@/components/CodeInput";
import FileCard from "@/components/FileCard";
import { Icon } from "@/components/icons";

export const dynamic = "force-dynamic";
export const metadata = { title: "Enter code — iGotchu" };

export default async function ReceivePage({ searchParams }) {
  await cleanupExpired();

  const sp = await searchParams;
  const code = (sp.code || "").toUpperCase().trim();

  let upload = null;
  let error = null;

  if (code !== "") {
    upload = await findUploadByCode(code);
    if (!upload) {
      error = `No file found for code "${code}". Double-check it with your senior.`;
    } else if (isExpired(upload)) {
      error = "This link has expired and the file is no longer available.";
      upload = null;
    }
  }

  const origin = await getOrigin();

  return (
    <>
      <section className="max-w-md mx-auto pt-14">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center">Got a code?</h1>
        <p className="text-center text-[#6B6455] text-sm mt-1.5 mb-7">
          Type the 6-character code your senior gave you.
        </p>

        <form method="get" className="card p-5 flex flex-col sm:flex-row gap-2.5">
          <CodeInput
            name="code"
            defaultValue={code}
            className="input code-input flex-1 text-center !text-xl font-bold tracking-[0.35em] uppercase"
          />
          <button type="submit" className="btn-primary">
            Unlock
          </button>
        </form>

        {error && (
          <div className="card p-6 mt-5 text-center pop-in">
            <div className="w-10 h-10 rounded-full bg-[#FF9ECE] border-2 border-[#1A1A1A] text-[#1A1A1A] flex items-center justify-center mx-auto mb-3">
              <Icon name="alert" size={18} />
            </div>
            <p className="text-sm font-medium text-[#4A4433]">{error}</p>
          </div>
        )}
      </section>

      {upload && (
        <section className="max-w-2xl mx-auto mt-8">
          <FileCard upload={upload} shareLink={`${origin}/share/${upload.share_code}`} />
        </section>
      )}
    </>
  );
}
