"use client";

import Link from "next/link";
import { useState } from "react";
import { professionList, type ProfessionSlug } from "../data";
import { ProfessionMark } from "./ProfessionMark";

export function JobSelector() {
  const [selected, setSelected] = useState<ProfessionSlug | null>(null);
  const profession = selected ? professionList.find((item) => item.slug === selected) : null;

  return (
    <div className="job-selector">
      <div className="profession-grid" aria-label="Pilihan pekerjaan">
        {professionList.map((item, index) => (
          <button
            type="button"
            key={item.slug}
            className={`profession-card${selected === item.slug ? " selected" : ""}`}
            style={{ "--card-accent": item.accent, "--card-soft": item.softAccent } as React.CSSProperties}
            onClick={() => setSelected(item.slug)}
            aria-pressed={selected === item.slug}
          >
            <div className="card-index">{String(index + 1).padStart(2, "0")}</div>
            <ProfessionMark profession={item} />
            <div>
              <p>{item.eyebrow}</p>
              <h3>{item.name}</h3>
              <span>{item.salaryBasis}</span>
            </div>
            <div className="card-footer">
              <span>Pensiun {item.retirementAge} tahun</span>
              <b>{selected === item.slug ? "✓" : "+"}</b>
            </div>
          </button>
        ))}
      </div>

      <div className={`job-selection-footer${profession ? " ready" : ""}`} aria-live="polite">
        <div>
          <span>Langkah 1 dari 2</span>
          <strong>{profession ? `${profession.name} dipilih` : "Pilih satu pekerjaan untuk melanjutkan"}</strong>
        </div>
        {profession ? (
          <Link href={`/profesi/${profession.slug}`} className="primary-button">
            Lanjut ke Jejak Gaji <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <span className="selection-hint">Hitungan baru dibuka setelah pekerjaan dipilih.</span>
        )}
      </div>
    </div>
  );
}
