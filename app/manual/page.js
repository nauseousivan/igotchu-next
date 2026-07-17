import Link from "next/link";
import { Icon } from "@/components/icons";

export const metadata = { title: "Help — iGotchu" };

export default function ManualPage() {
  return (
    <section className="max-w-2xl mx-auto pt-12">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Help</h1>
      <p className="text-[#6B6455] text-sm mt-1.5 mb-7">Everything you need to know. It&apos;s short, promise.</p>

      <div className="card p-6 sm:p-7 mb-4">
        <h2 className="flex items-center gap-2 font-semibold mb-4">
          <Icon name="hash" size={16} className="text-[#9B927E]" />
          Getting a file with a code
        </h2>
        <ol className="list-decimal list-inside space-y-1.5 text-sm text-[#6B6455]">
          <li>
            Ask your senior for their 6-character code (like <span className="font-semibold text-[#1A1A1A]">A9K2XQ</span>)
          </li>
          <li>
            Go to{" "}
            <Link href="/receive" className="font-medium text-[#1A1A1A] underline underline-offset-2">
              Enter code
            </Link>
            , type it, hit Unlock
          </li>
          <li>Hit Download — or Open GDrive/Link if it&apos;s a link share — no account needed</li>
        </ol>
        <p className="text-sm text-[#6B6455] mt-3">
          No code? The{" "}
          <Link href="/" className="font-medium text-[#1A1A1A] underline underline-offset-2">
            Hub
          </Link>{" "}
          lists every public upload — filter by school or course, search by subject, and check what&apos;s trending.
        </p>
      </div>

      <div className="card p-6 sm:p-7 mb-4">
        <h2 className="flex items-center gap-2 font-semibold mb-4">
          <Icon name="upload" size={16} className="text-[#9B927E]" />
          Sharing your reviewer
        </h2>
        <ol className="list-decimal list-inside space-y-1.5 text-sm text-[#6B6455]">
          <li>
            Go to{" "}
            <Link href="/upload" className="font-medium text-[#1A1A1A] underline underline-offset-2">
              Upload
            </Link>
          </li>
          <li>
            <span className="font-medium text-[#1A1A1A]">File</span> — drop PDF, DOCX, PPTX, JPG, PNG, or ZIP, up to
            50MB. Or switch to <span className="font-medium text-[#1A1A1A]">Link</span> and paste a GDrive/Docs/any
            URL instead — no file needed
          </li>
          <li>Add a clear title, pick your course, type the subject</li>
          <li>Optional: tags, your name — or tick &quot;Upload anonymously&quot;</li>
          <li>
            Choose <span className="font-medium text-[#1A1A1A]">Public</span> (shows on the Hub for everyone) or{" "}
            <span className="font-medium text-[#1A1A1A]">Private</span> (unlisted — only people you give the code or
            link to can open it)
          </li>
          <li>Set expiration: 1 day, 7 days, or never</li>
          <li>You get a code + link — paste either one in your GC</li>
        </ol>
        <p className="text-sm text-[#6B6455] mt-3">
          Expired files delete themselves and their codes stop working. Pick &quot;Never&quot; for evergreen
          reviewers, &quot;1 day&quot; for quick one-time shares. Private uploads never show up in search or the Hub
          grid — but the code always works.
        </p>
      </div>

      <div className="card p-6 sm:p-7">
        <h2 className="flex items-center gap-2 font-semibold mb-4">
          <Icon name="help" size={16} className="text-[#9B927E]" />
          FAQ
        </h2>
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium">Do I need an account?</p>
            <p className="text-[#6B6455] mt-0.5">No. No sign-ups, no emails. Codes are the whole system.</p>
          </div>
          <div>
            <p className="font-medium">Can I delete my own upload?</p>
            <p className="text-[#6B6455] mt-0.5">
              Not yet — send a message through Feedback (in the dock below) to have it taken down, or upload with an
              expiry so it removes itself.
            </p>
          </div>
          <div>
            <p className="font-medium">Why won&apos;t my file upload?</p>
            <p className="text-[#6B6455] mt-0.5">
              Check: under 50MB? Allowed file type? Title and course filled in? The message at the bottom of the
              screen tells you what went wrong.
            </p>
          </div>
          <div>
            <p className="font-medium">Is my name shown?</p>
            <p className="text-[#6B6455] mt-0.5">
              Only if you type it. Leave it blank or tick &quot;Upload anonymously&quot; and you&apos;ll show as
              Anonymous.
            </p>
          </div>
          <div>
            <p className="font-medium">What&apos;s the difference between Public and Private?</p>
            <p className="text-[#6B6455] mt-0.5">
              Public shows up on public Dashboard, in search, and in Trending. Private is unlisted — it never appears
              anywhere, but the code and share link still open it for anyone you send them to.
            </p>
          </div>
          <div>
            <p className="font-medium">Can I share a Google Drive link instead of a file?</p>
            <p className="text-[#6B6455] mt-0.5">
              Yes — pick the Link tab on Upload and paste the URL. The share page shows an &quot;Open GDrive&quot;/
              &quot;Open Link&quot; button instead of Download.
            </p>
          </div>
          <div>
            <p className="font-medium">Someone&apos;s sharing something they shouldn&apos;t…</p>
            <p className="text-[#6B6455] mt-0.5">Report it through Feedback and it&apos;ll be removed.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
