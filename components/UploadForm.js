"use client";

import { useRef, useState } from "react";
import { Icon } from "./icons";
import { toast } from "@/lib/toast";
import { COLLEGES, SUBJECT_SUGGESTIONS, TAGS, ALLOWED_EXTENSIONS, MAX_FILE_SIZE } from "@/lib/constants";
import CopyButton from "./CopyButton";

function humanSize(b) {
  if (b >= 1048576) return (b / 1048576).toFixed(1) + " MB";
  if (b >= 1024) return (b / 1024).toFixed(1) + " KB";
  return b + " B";
}

export default function UploadForm() {
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  const [mode, setMode] = useState("file");
  const [file, setFile] = useState(null);
  const [dragover, setDragover] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [anonymous, setAnonymous] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [otherTagOn, setOtherTagOn] = useState(false);
  const [customTag, setCustomTag] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { code, link }

  const pickFile = (f) => {
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      toast("File type not allowed — PDF, DOCX, PPTX, JPG, PNG, ZIP only");
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      toast("File is over the 50MB limit");
      return;
    }
    setFile(f);
  };

  const toggleTag = (tag) => {
    setSelectedTags((cur) => (cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    if (mode === "file" && !file) return toast("Pick a file first");
    if (mode === "link" && !linkUrl.trim()) return toast("Paste your link first");
    if (!form.title.value.trim()) return toast("Give it a title");

    setSubmitting(true);
    try {
      const fd = new FormData(form);
      if (mode === "file") {
        fd.delete("link_url");
        fd.set("file", file);
      } else {
        fd.delete("file");
      }
      fd.set("visibility", visibility);
      if (anonymous) fd.set("anonymous", "1");
      fd.set("tags", selectedTags.join(","));
      fd.set("custom_tag", otherTagOn ? customTag : "");

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Upload failed");

      setResult({ code: data.code, link: data.link });
      form.reset();
      setFile(null);
      setLinkUrl("");
      setSelectedTags([]);
      setOtherTagOn(false);
      setCustomTag("");
      setVisibility("public");
      setAnonymous(false);
    } catch (err) {
      toast(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="max-w-xl mx-auto pt-12">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Upload a reviewer</h1>
        <p className="text-[#6B6455] text-sm mt-1.5 mb-7">Drop a file, get a code, share it with the freshies.</p>

        <form ref={formRef} onSubmit={handleSubmit} className="card p-6 sm:p-7 flex flex-col gap-5">
          <div className="flex gap-2">
            <button
              type="button"
              className={`tag-pill ${mode === "file" ? "selected" : ""}`}
              onClick={() => setMode("file")}
            >
              <Icon name="file-text" size={13} />
              &nbsp;File
            </button>
            <button
              type="button"
              className={`tag-pill ${mode === "link" ? "selected" : ""}`}
              onClick={() => setMode("link")}
            >
              <Icon name="link" size={13} />
              &nbsp;Link
            </button>
          </div>

          {mode === "file" && (
            <div>
              <div
                className={`dropzone p-9 text-center ${dragover ? "dragover" : ""}`}
                onClick={() => fileInputRef.current.click()}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragover(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragover(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragover(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragover(false);
                  if (e.dataTransfer.files.length) pickFile(e.dataTransfer.files[0]);
                }}
              >
                <div className="w-10 h-10 rounded-full bg-white border border-[#E5DCC3] text-[#6B6455] flex items-center justify-center mx-auto mb-3">
                  <Icon name="upload" size={18} />
                </div>
                <p className="font-medium text-sm">Drag &amp; drop, or click to browse</p>
                <p className="text-xs text-[#9B927E] mt-1">PDF, DOCX, PPTX, JPG, PNG, ZIP — up to 50MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.pptx,.jpg,.jpeg,.png,.zip"
                  onChange={(e) => pickFile(e.target.files[0])}
                />
              </div>
              {file && (
                <div className="card px-4 py-3 flex items-center justify-between text-sm mt-3">
                  <span className="font-medium truncate">{file.name}</span>
                  <span className="text-[#9B927E] shrink-0 ml-3">{humanSize(file.size)}</span>
                </div>
              )}
            </div>
          )}

          {mode === "link" && (
            <div>
              <label className="label">Link</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                maxLength={500}
                placeholder="e.g. https://drive.google.com/..."
                className="input"
              />
              <p className="text-xs text-[#9B927E] mt-1.5">Paste your GDrive / Docs / any link — no file needed.</p>
            </div>
          )}
          <input type="hidden" name="link_url" value={mode === "link" ? linkUrl : ""} readOnly />

          <div>
            <label className="label">Title</label>
            <input
              type="text"
              name="title"
              maxLength={255}
              placeholder="e.g. Pharma Midterms Super Reviewer"
              className="input"
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Course / program</label>
              <select name="course" className="input" required defaultValue="">
                <option value="" disabled>
                  Select…
                </option>
                {Object.entries(COLLEGES).map(([college, courses]) => (
                  <optgroup key={college} label={college}>
                    {courses.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="label">
                Subject <span className="text-[#9B927E] font-normal">— optional</span>
              </label>
              <input
                type="text"
                name="subject"
                list="subject-list"
                maxLength={100}
                placeholder="e.g. Pharmacology"
                className="input"
              />
              <datalist id="subject-list">
                {SUBJECT_SUGGESTIONS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Expiration</label>
              <select name="expiration" className="input" defaultValue="never">
                <option value="never">Never expires</option>
                <option value="7days">7 days</option>
                <option value="1day">1 day</option>
              </select>
            </div>
            <div>
              <label className="label">
                Your name <span className="text-[#9B927E] font-normal">— optional</span>
              </label>
              <input
                type="text"
                name="uploader"
                disabled={anonymous}
                maxLength={100}
                placeholder="e.g. Ate Kim, BSN-4"
                className={`input ${anonymous ? "opacity-40" : ""}`}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-[#6B6455] cursor-pointer select-none -mt-1">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="w-4 h-4 accent-[#1A1A1A]"
            />
            Upload anonymously
          </label>

          <div>
            <label className="label">Visibility</label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`tag-pill ${visibility === "public" ? "selected" : ""}`}
                onClick={() => setVisibility("public")}
              >
                Public — shows on the hub
              </button>
              <button
                type="button"
                className={`tag-pill ${visibility === "private" ? "selected" : ""}`}
                onClick={() => setVisibility("private")}
              >
                Private — code only
              </button>
            </div>
          </div>

          <div>
            <label className="label">
              Description <span className="text-[#9B927E] font-normal">— optional</span>
            </label>
            <textarea
              name="description"
              rows={3}
              maxLength={1000}
              placeholder="What's inside? Which topics?"
              className="input resize-none"
            />
          </div>

          <div>
            <label className="label">Tags</label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((t) => (
                <span
                  key={t}
                  className={`tag-pill ${selectedTags.includes(t) ? "selected" : ""}`}
                  onClick={() => toggleTag(t)}
                >
                  {t}
                </span>
              ))}
              <span
                className={`tag-pill ${otherTagOn ? "selected" : ""}`}
                onClick={() => setOtherTagOn((v) => !v)}
              >
                Other
              </span>
            </div>
            {otherTagOn && (
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                maxLength={30}
                placeholder="Type your own tag…"
                className="input mt-2.5"
                autoFocus
              />
            )}
          </div>

          <button type="submit" disabled={submitting} className="btn-primary !py-3">
            {submitting ? "Uploading…" : "Upload & get code"}
          </button>
        </form>
      </section>

      {result && (
        <div className="modal-backdrop" onClick={() => setResult(null)}>
          <div className="card p-8 max-w-sm w-full text-center pop-in" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-[#B9F73E] border-2 border-[#1A1A1A] text-[#1A1A1A] flex items-center justify-center mx-auto mb-4">
              <Icon name="check" size={22} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Uploaded</h2>
            <p className="text-[#6B6455] text-sm mt-1 mb-4">Share this code with your classmates:</p>
            <p className="code-display">{result.code}</p>
            <p className="text-xs text-[#9B927E] mt-3 break-all">{result.link}</p>
            <div className="flex justify-center gap-2.5 mt-6">
              <CopyButton text={result.code} message="Code copied" className="btn-primary text-xs" icon="copy" iconSize={14}>
                Copy code
              </CopyButton>
              <CopyButton text={result.link} message="Link copied" className="btn-outline text-xs" icon="link" iconSize={14}>
                Copy link
              </CopyButton>
            </div>
            <div className="flex justify-center gap-4 mt-5 text-sm">
              <a href={result.link} className="font-medium text-[#1A1A1A] hover:underline">
                View page
              </a>
              <button type="button" onClick={() => setResult(null)} className="text-[#9B927E] hover:text-[#1A1A1A]">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
