import Link from "next/link";
import { methodologySources, professionList, referenceData, type Profession } from "../data";
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

        <div className="profession-switcher" aria-label="Ganti profesi">
          <span>Bandingkan profesi:</span>
          {professionList.map((item) => (
            <Link key={item.slug} className={item.slug === profession.slug ? "active" : ""} href={`/profesi/${item.slug}`}>
              {item.navName}
            </Link>
          ))}
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
