import Link from "next/link";
import { methodologySources, referenceData, type Profession } from "../data";
import { LifetimeCalculator } from "./LifetimeCalculator";
import { ProfessionMark } from "./ProfessionMark";
import { SiteHeader } from "./SiteHeader";

export function ProfessionPage({ profession }: { profession: Profession }) {
  const startAges = profession.salaryOptions?.map((item) => item.startAge ?? profession.startAge) ?? [profession.startAge];
  const retirementAges = profession.salaryOptions?.map((item) => item.retirementAge ?? profession.retirementAge) ?? [profession.retirementAge];
  const startAgeLabel = Math.min(...startAges) === Math.max(...startAges)
    ? `${startAges[0]}`
    : `${Math.min(...startAges)}–${Math.max(...startAges)}`;
  const retirementAgeLabel = Math.min(...retirementAges) === Math.max(...retirementAges)
    ? `${retirementAges[0]}`
    : `${Math.min(...retirementAges)}–${Math.max(...retirementAges)}`;

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
              <span><b>{startAgeLabel}</b> usia mulai</span>
              <span><b>{retirementAgeLabel}</b> {profession.retirementIsTarget ? "target pensiun" : "usia pensiun"}</span>
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
          <p>Benchmark profesi terisi otomatis. Kamu hanya mengatur asumsi pertumbuhan gaji dan porsi tabungan; pekerja UMK/UMP cukup memilih daerah.</p>
        </div>

        <LifetimeCalculator profession={profession} />

        <section className="page-sources">
          <div>
            <p className="section-kicker">Transparansi data</p>
            <h2>Referensi yang dipakai</h2>
          </div>
          <div className="source-links">
            <div><span>Dasar gaji {profession.navName}</span><b>referensi resmi</b></div>
            {methodologySources.slice(0, 4).map((source) => (
              <div key={source.url}><span>{source.label}</span><b>data terkurasi</b></div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
