"use client";

import { useState } from "react";
import { Icon } from "./icons";
import { COLLEGES } from "@/lib/constants";

export default function HubSearch({ initial }) {
  const [search, setSearch] = useState(initial.search);
  const [college, setCollege] = useState(initial.college);
  const [course, setCourse] = useState(initial.course);
  const [sort, setSort] = useState(initial.sort);
  const [panelOpen, setPanelOpen] = useState(false);

  const hasFilter = college !== "" || course !== "";

  return (
    <form method="get" className="relative mb-10">
      <div className="search-bar">
        <span className="search-bar-icon">
          <Icon name="search" size={18} />
        </span>
        <input
          type="text"
          name="q"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subject, title, uploader…"
          className="search-bar-input"
        />
        <button
          type="button"
          onClick={() => setPanelOpen((v) => !v)}
          className="search-bar-filter"
          title="Filter"
        >
          <Icon name="filter" size={15} />
          {hasFilter && <span className="filter-dot" />}
        </button>
      </div>

      <input type="hidden" name="college" value={college} />
      <input type="hidden" name="course" value={course} />
      <input type="hidden" name="sort" value={sort} />

      {panelOpen && (
        <div className="filter-panel card" onClick={(e) => e.stopPropagation()}>
          <p className="label">School</p>
          <div className="flex gap-2">
            <button
              type="button"
              className={`tag-pill ${college === "" ? "selected" : ""}`}
              onClick={() => {
                setCollege("");
                setCourse("");
              }}
            >
              All
            </button>
            {Object.keys(COLLEGES).map((col) => (
              <button
                key={col}
                type="button"
                className={`tag-pill ${college === col ? "selected" : ""}`}
                onClick={() => {
                  setCollege(col);
                  setCourse("");
                }}
              >
                {col}
              </button>
            ))}
          </div>

          {college !== "" && (
            <>
              <p className="label mt-4">Course</p>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {COLLEGES[college].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`tag-pill text-[11px] ${course === c ? "selected" : ""}`}
                    onClick={() => setCourse(course === c ? "" : c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </>
          )}

          <p className="label mt-4">Sort</p>
          <div className="flex gap-2">
            <button
              type="button"
              className={`tag-pill ${sort !== "popular" ? "selected" : ""}`}
              onClick={() => setSort("newest")}
            >
              Newest
            </button>
            <button
              type="button"
              className={`tag-pill ${sort === "popular" ? "selected" : ""}`}
              onClick={() => setSort("popular")}
            >
              Most downloaded
            </button>
          </div>

          <button type="submit" className="btn-primary w-full mt-5">
            Apply
          </button>
        </div>
      )}
    </form>
  );
}
