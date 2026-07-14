import Link from "next/link";
import { methodologySources, professionList, referenceData } from "./data";
import { ProfessionMark } from "./components/ProfessionMark";
import { SiteHeader } from "./components/SiteHeader";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default function Home() {
  return (
    <main>
      <div className="page-wrap home-page">
        <SiteHeader />
        <section className="home-hero">
          <div className="home-hero-copy">
            <p className="eyebrow"><span />Kalkulator karier Indonesia · 2026</p>
            <h1>Seumur hidup bekerja, <em>terkumpul berapa?</em></h1>
            <p className="home-lead">Lihat estimasi penghasilan dari hari pertama kerja sampai pensiun—lalu bandingkan apa yang terjadi jika sebagian kecilnya mulai diinvestasikan.</p>
            <div className="home-actions">
              <Link href="/profesi/upah-minimum" className="primary-button">Hitung dari kotamu <span>↗</span></Link>
              <a href="#profesi" className="text-button">Lihat semua profesi <span>↓</span></a>
            </div>
          </div>
          <div className="hero-visual" aria-label="Ilustrasi perjalanan gaji sepanjang hidup">
            <div className="hero-sun"><span>37</span><small>tahun<br />bekerja</small></div>
            <div className="salary-ribbon ribbon-one"><span>Mulai kerja</span><strong>23</strong></div>
            <div className="salary-ribbon ribbon-two"><span>Estimasi pensiun</span><strong>60</strong></div>
            <div className="salary-ribbon ribbon-three"><span>Harapan hidup</span><strong>73,93</strong></div>
            <div className="hero-curve"><i /><i /><i /><i /></div>
            <p>Waktu mengubah gaji kecil menjadi angka yang sangat besar.</p>
          </div>
        </section>

        <section className="data-strip" aria-label="Data acuan terbaru">
          <div><span>UMK Kota Kediri 2026</span><strong>{rupiah.format(2_742_806)}</strong></div>
          <div><span>Inflasi Indonesia</span><strong>3,34%</strong></div>
          <div><span>Yield neto SBN contoh</span><strong>5,715%</strong></div>
          <div><span>Emas Antam</span><strong>Rp2,635 jt/g</strong></div>
          <p><span className="live-dot" />Data per {referenceData.asOf}</p>
        </section>

        <section className="profession-section" id="profesi">
          <div className="section-intro">
            <div>
              <p className="section-kicker">Pilih titik awal</p>
              <h2>Setiap profesi punya garis waktu berbeda.</h2>
            </div>
            <p>Semua angka gaji bisa diubah. Yang kami siapkan adalah aturan pensiun, jumlah pembayaran tahunan, dan dasar data yang relevan.</p>
          </div>
          <div className="profession-grid">
            {professionList.map((profession, index) => (
              <Link
                key={profession.slug}
                href={`/profesi/${profession.slug}`}
                className="profession-card"
                style={{ "--card-accent": profession.accent, "--card-soft": profession.softAccent } as React.CSSProperties}
              >
                <div className="card-index">0{index + 1}</div>
                <ProfessionMark profession={profession} />
                <div>
                  <p>{profession.eyebrow}</p>
                  <h3>{profession.name}</h3>
                  <span>{profession.salaryBasis}</span>
                </div>
                <div className="card-footer"><span>Pensiun {profession.retirementAge} tahun</span><b>↗</b></div>
              </Link>
            ))}
          </div>
        </section>

        <section className="how-section">
          <div className="how-heading">
            <p className="section-kicker">Yang akan kamu lihat</p>
            <h2>Bukan hanya total gaji.</h2>
          </div>
          <div className="how-grid">
            <article><span>01</span><h3>Garis waktu hidup</h3><p>Mulai bekerja, lama masa produktif, pensiun, dan estimasi tahun hidup setelah pensiun.</p></article>
            <article><span>02</span><h3>Efek compounding</h3><p>Bandingkan uang yang hanya disimpan dengan SBN Ritel atau RDPU konservatif.</p></article>
            <article><span>03</span><h3>Daya beli nyata</h3><p>Lihat berapa kali gaji dibutuhkan untuk 10g emas, satu mobil, dan satu rumah.</p></article>
          </div>
        </section>

        <section className="methodology" id="metodologi">
          <div className="method-copy">
            <p className="section-kicker">Cara kami menghitung</p>
            <h2>Masuk akal, transparan, dan bisa kamu koreksi.</h2>
            <p>Estimasi memakai gaji saat ini, kenaikan gaji tahunan yang bisa diubah, THR/gaji ke-13 sesuai jalur, serta setoran investasi bulanan. Hasilnya nominal dan belum dikurangi biaya hidup.</p>
            <p className="risk-callout">⚠️ Risk: investasi tetap punya risiko. Yield dapat berubah, inflasi menggerus daya beli, dan karier nyata tidak selalu berjalan lurus.</p>
          </div>
          <div className="method-sources">
            <p>Sumber utama</p>
            {methodologySources.map((source, index) => (
              <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                <span>{String(index + 1).padStart(2, "0")}</span>{source.label}<b>↗</b>
              </a>
            ))}
          </div>
        </section>

        <footer className="site-footer">
          <div><span className="brand-mark">JG</span><strong>Jejak Gaji</strong></div>
          <p>Alat edukasi finansial untuk melihat panjangnya perjalanan kerja di Indonesia.</p>
          <span>Data diperbarui: {referenceData.asOf}</span>
        </footer>
      </div>
    </main>
  );
}
