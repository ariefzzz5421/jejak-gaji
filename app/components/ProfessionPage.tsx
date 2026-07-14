import Link from "next/link";
import { methodologySources, referenceData, type Profession } from "../data";
import { LifetimeCalculator } from "./LifetimeCalculator";
import { ProfessionMark } from "./ProfessionMark";
import { SiteHeader } from "./SiteHeader";

export function ProfessionPage({ profession }: { profession: Profession }) {
  return (
    <main style={{ "--accent": profession.accent, "--accent-soft": profession.softAccent } as React.CSSProperties}>
      <div className="page-wrap">
        <SiteHeader />

        <section className="profession-hero">
          <div className="profession-hero-copy">
            <Link href="/#profesi" className="back-to-jobs">← Ganti pekerjaan</Link>
            <p className="eyebrow"><span />{profession.eyebrow} · data {referenceData.asOf}</p>
            <h1>{profession.tagline}</h1>
            <p>{profession.description}</p>
            <div className="hero-facts">
              <span><b>{profession.startAge}</b> usia mulai</span>
              <span><b>{profession.retirementAge}</b> estimasi pensiun</span>
              <span><b>{profession.annualPayments}×</b> gaji / tahun</span>
            </div>
          </div>
          <ProfessionMark profession={profession} large />
        </section>

        <div className="calculation-divider">
          <div>
            <span>Langkah 2 dari 2</span>
            <strong>Jejak Gaji {profession.name}</strong>
          </div>
          <p>Atur angka di bawah sesuai keadaanmu. Pilihan pekerjaan tidak dicampur dengan hasil perhitungan.</p>
        </div>

        <LifetimeCalculator profession={profession} />

        <section className="page-sources">
          <div>
            <p className="section-kicker">Transparansi data</p>
            <h2>Sumber yang dipakai</h2>
          </div>
          <div className="source-links">
            <a href={profession.salarySource} target="_blank" rel="noreferrer">Dasar gaji {profession.navName} ↗</a>
            {methodologySources.slice(0, 4).map((source) => (
              <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label} ↗</a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
