import Link from "next/link";
import { AgeJourney } from "./components/AgeJourney";
import { JobSelector } from "./components/JobSelector";
import { SiteHeader } from "./components/SiteHeader";
import { methodologySources, referenceData } from "./data";

export default function Home() {
  return (
    <main>
      <div className="page-wrap home-page">
        <SiteHeader />

        <section className="home-hero">
          <div className="home-hero-copy">
            <p className="eyebrow"><span />Kalkulator karier Indonesia · 2026</p>
            <h1>Seumur hidup bekerja, <em>terkumpul berapa?</em></h1>
            <p className="home-lead">
              Pilih pekerjaanmu lebih dulu. Setelah itu, Jejak Gaji menghitung estimasi penghasilan sampai pensiun, potensi investasi, dan daya beli aset.
            </p>
            <div className="home-actions">
              <Link href="#profesi" className="primary-button">Pilih pekerjaan <span>↓</span></Link>
              <a href="#cara-kerja" className="text-button">Lihat cara kerja <span>↓</span></a>
            </div>
          </div>

          <AgeJourney />
        </section>

        <section className="profession-section" id="profesi">
          <div className="section-intro">
            <div>
              <p className="section-kicker">Mulai dari pekerjaan</p>
              <h2>Apa pekerjaanmu saat ini?</h2>
            </div>
            <p>
              Pilih satu jalur terlebih dahulu. Halaman hitungan dipisahkan supaya kamu fokus pada asumsi yang sesuai dengan pekerjaanmu.
            </p>
          </div>
          <JobSelector />
        </section>

        <section className="how-section" id="cara-kerja">
          <div className="how-heading">
            <p className="section-kicker">Yang akan kamu lihat</p>
            <h2>Bukan hanya total gaji.</h2>
          </div>
          <div className="how-grid">
            <article><span>01</span><h3>Garis waktu hidup</h3><p>Mulai bekerja, masa produktif, pensiun, dan estimasi tahun hidup setelah pensiun.</p></article>
            <article><span>02</span><h3>Efek compounding</h3><p>Bandingkan uang yang hanya disimpan dengan SBN Ritel atau RDPU konservatif.</p></article>
            <article><span>03</span><h3>Daya beli nyata</h3><p>Lihat berapa kali gaji dibutuhkan untuk 10g emas, satu Avanza, dan rumah Rp600 juta.</p></article>
          </div>
        </section>

        <section className="methodology" id="metodologi">
          <div className="method-copy">
            <p className="section-kicker">Cara kami menghitung</p>
            <h2>Masuk akal, transparan, dan bisa kamu koreksi.</h2>
            <p>
              Estimasi memakai gaji saat ini, kenaikan gaji tahunan yang bisa diubah, THR atau gaji ke-13 sesuai jalur, serta setoran investasi bulanan. Hasilnya nominal dan belum dikurangi biaya hidup.
            </p>
            <p className="risk-callout">⚠️ Risk: investasi tetap punya risiko. Yield dapat berubah, inflasi menggerus daya beli, dan karier nyata tidak selalu berjalan lurus.</p>
          </div>
          <div className="method-sources">
            <p>Sumber utama</p>
            {methodologySources.map((source, index) => (
              <div key={source.url}>
                <span>{String(index + 1).padStart(2, "0")}</span>{source.label}<b>terverifikasi</b>
              </div>
            ))}
          </div>
        </section>

        <footer className="site-footer">
          <div><span className="brand-mark">JG</span><strong>Jejak Gaji</strong></div>
          <p>Alat edukasi finansial untuk melihat panjangnya perjalanan kerja di Indonesia.</p>
          <span>Data acuan: {referenceData.asOf}</span>
        </footer>
      </div>
    </main>
  );
}
