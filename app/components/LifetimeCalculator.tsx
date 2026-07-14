"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  cityWages,
  investments,
  referenceData,
  type Profession,
} from "../data";

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const compactRupiah = (value: number) => {
  if (value >= 1_000_000_000_000) return `Rp${(value / 1_000_000_000_000).toFixed(2)} T`;
  if (value >= 1_000_000_000) return `Rp${(value / 1_000_000_000).toFixed(2)} M`;
  if (value >= 1_000_000) return `Rp${(value / 1_000_000).toFixed(1)} jt`;
  return rupiah.format(value);
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function LifetimeCalculator({ profession }: { profession: Profession }) {
  const [cityId, setCityId] = useState("kediri");
  const [salary, setSalary] = useState(profession.defaultSalary);
  const [startAge, setStartAge] = useState(profession.startAge);
  const [retirementAge, setRetirementAge] = useState(profession.retirementAge);
  const [salaryGrowth, setSalaryGrowth] = useState(3);
  const [savingRate, setSavingRate] = useState(15);
  const [instrumentId, setInstrumentId] = useState<keyof typeof investments>("sbn");
  const [assetPrices, setAssetPrices] = useState({
    gold: referenceData.gold10g,
    car: referenceData.car,
    house: referenceData.house,
  });

  const city = cityWages.find((item) => item.id === cityId) ?? cityWages[0];
  const instrument = investments[instrumentId];
  const workYears = Math.max(retirementAge - startAge, 1);
  const postRetirementYears = Math.max(referenceData.lifeExpectancy - retirementAge, 0);
  const realYield = instrument.netYield - referenceData.inflation;

  const calculation = useMemo(() => {
    const months = workYears * 12;
    const monthlyEquivalent = salary * (profession.annualPayments / 12);
    const monthlyRate = instrument.netYield / 100 / 12;
    let totalIncome = 0;
    let cashSaved = 0;
    let invested = 0;

    for (let month = 0; month < months; month += 1) {
      const year = Math.floor(month / 12);
      const incomeThisMonth = monthlyEquivalent * Math.pow(1 + salaryGrowth / 100, year);
      const contribution = incomeThisMonth * (savingRate / 100);
      totalIncome += incomeThisMonth;
      cashSaved += contribution;
      invested = invested * (1 + monthlyRate) + contribution;
    }

    return {
      totalIncome,
      cashSaved,
      invested,
      growth: invested - cashSaved,
      monthlyEquivalent,
    };
  }, [instrument.netYield, profession.annualPayments, salary, salaryGrowth, savingRate, workYears]);

  const handleCity = (nextId: string) => {
    const nextCity = cityWages.find((item) => item.id === nextId);
    setCityId(nextId);
    if (profession.slug === "upah-minimum" && nextCity) setSalary(nextCity.amount);
  };

  const assets = [
    { id: "gold" as const, name: "Emas Antam 10g", price: assetPrices.gold, helper: "Rp2,635 jt/gram" },
    { id: "car" as const, name: "Mobil keluarga", price: assetPrices.car, helper: "contoh kelas Rp300 juta" },
    { id: "house" as const, name: "Rumah sederhana", price: assetPrices.house, helper: "contoh Rp600 juta" },
  ];

  return (
    <div className="calculator-shell">
      <section className="calculator-controls" aria-labelledby="input-title">
        <div className="section-heading compact-heading">
          <span className="step-number">01</span>
          <div>
            <p className="section-kicker">Atur asumsi</p>
            <h2 id="input-title">Ceritakan jalur kerjamu</h2>
          </div>
        </div>

        <div className="control-stack">
          <label className="field-label" htmlFor="city">
            <span>Kota tempat bekerja</span>
            <select id="city" value={cityId} onChange={(event) => handleCity(event.target.value)}>
              {cityWages.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.city} · {item.type} {rupiah.format(item.amount)}
                </option>
              ))}
            </select>
            <small>
              {city.type} 2026 {city.city}: <strong>{rupiah.format(city.amount)}</strong> ·{" "}
              <a href={city.source} target="_blank" rel="noreferrer">lihat sumber</a>
            </small>
          </label>

          <div className="field-label">
            <div className="label-row">
              <span>Penghasilan per bulan</span>
              <strong>{rupiah.format(salary)}</strong>
            </div>
            <input
              aria-label="Penghasilan per bulan"
              type="range"
              min={1_500_000}
              max={30_000_000}
              step={100_000}
              value={salary}
              onChange={(event) => setSalary(Number(event.target.value))}
            />
            <div className="range-ends"><span>Rp1,5 jt</span><span>Rp30 jt</span></div>
          </div>

          <div className="split-fields">
            <label className="field-label" htmlFor="start-age">
              <span>Mulai bekerja</span>
              <div className="number-field">
                <input
                  id="start-age"
                  type="number"
                  min={17}
                  max={45}
                  value={startAge}
                  onChange={(event) => setStartAge(clamp(Number(event.target.value), 17, 45))}
                />
                <span>tahun</span>
              </div>
            </label>
            <label className="field-label" htmlFor="retirement-age">
              <span>Estimasi pensiun</span>
              <div className="number-field">
                <input
                  id="retirement-age"
                  type="number"
                  min={Math.max(startAge + 1, 40)}
                  max={70}
                  value={retirementAge}
                  onChange={(event) => setRetirementAge(clamp(Number(event.target.value), startAge + 1, 70))}
                />
                <span>tahun</span>
              </div>
            </label>
          </div>

          <div className="split-fields">
            <div className="field-label">
              <div className="label-row"><span>Kenaikan gaji</span><strong>{salaryGrowth}% / th</strong></div>
              <input aria-label="Kenaikan gaji tahunan" type="range" min={0} max={10} step={0.5} value={salaryGrowth} onChange={(event) => setSalaryGrowth(Number(event.target.value))} />
            </div>
            <div className="field-label">
              <div className="label-row"><span>Disisihkan</span><strong>{savingRate}%</strong></div>
              <input aria-label="Persentase penghasilan yang disisihkan" type="range" min={0} max={40} step={1} value={savingRate} onChange={(event) => setSavingRate(Number(event.target.value))} />
            </div>
          </div>
        </div>

        <div className="assumption-note">
          <span aria-hidden="true">i</span>
          <p>{profession.salaryNote}</p>
        </div>
      </section>

      <section className="calculator-results" aria-live="polite">
        <div className="result-topline">
          <p>Estimasi penghasilan seumur kerja</p>
          <span>{workYears} tahun bekerja</span>
        </div>
        <p className="hero-number">{compactRupiah(calculation.totalIncome)}</p>
        <p className="result-caption">
          Nominal sebelum biaya hidup, dengan kenaikan gaji {salaryGrowth}% per tahun dan {profession.annualPayments} kali pembayaran gaji per tahun.
        </p>

        <div className="life-timeline" aria-label="Garis waktu hidup dan kerja">
          <div className="timeline-labels">
            <span>Lahir</span><span>Mulai {startAge}</span><span>Pensiun {retirementAge}</span><span>UHH {referenceData.lifeExpectancy}</span>
          </div>
          <div className="timeline-track">
            <span className="timeline-before" style={{ width: `${(startAge / referenceData.lifeExpectancy) * 100}%` }} />
            <span className="timeline-work" style={{ width: `${(workYears / referenceData.lifeExpectancy) * 100}%` }} />
            <span className="timeline-after" />
            <i className="timeline-person" style={{ left: `${(retirementAge / referenceData.lifeExpectancy) * 100}%` }}>●</i>
          </div>
          <p>Setelah pensiun, ada sekitar <strong>{postRetirementYears.toFixed(1)} tahun</strong> yang perlu dibiayai menurut rata-rata harapan hidup nasional.</p>
        </div>

        <div className="mini-metrics">
          <div><span>Setara bulanan + bonus</span><strong>{compactRupiah(calculation.monthlyEquivalent)}</strong></div>
          <div><span>Masa kerja</span><strong>{workYears} tahun</strong></div>
          <div><span>Masa setelah pensiun</span><strong>{postRetirementYears.toFixed(1)} tahun</strong></div>
        </div>
      </section>

      <section className="investment-panel full-span">
        <div className="section-heading">
          <span className="step-number">02</span>
          <div>
            <p className="section-kicker">Uang yang sama, hasil berbeda</p>
            <h2>Menabung saja vs investasi sangat konservatif</h2>
          </div>
        </div>

        <div className="instrument-tabs" role="group" aria-label="Pilih instrumen investasi">
          {(Object.keys(investments) as Array<keyof typeof investments>).map((key) => (
            <button key={key} type="button" className={instrumentId === key ? "active" : ""} onClick={() => setInstrumentId(key)}>
              <strong>{investments[key].name}</strong><span>{investments[key].short}</span>
            </button>
          ))}
        </div>

        <div className="scenario-grid">
          <article className="scenario-card cash-card">
            <div className="scenario-icon">0%</div>
            <p>Disimpan tunai</p>
            <strong>{compactRupiah(calculation.cashSaved)}</strong>
            <small>Pokok dari {savingRate}% penghasilan · tanpa imbal hasil</small>
          </article>
          <div className="versus-badge">VS</div>
          <article className="scenario-card invest-card">
            <div className="scenario-icon">+{instrument.netYield.toFixed(2)}%</div>
            <p>Diinvestasikan di {instrument.name}</p>
            <strong>{compactRupiah(calculation.invested)}</strong>
            <small>Estimasi akhir · reinvestasi bulanan</small>
          </article>
          <article className="growth-card">
            <p>Potensi tambahan dari compounding</p>
            <strong>+{compactRupiah(calculation.growth)}</strong>
            <div className="yield-row">
              <span>Yield neto <b>{instrument.netYield.toFixed(2)}%</b></span>
              <span>Inflasi <b>{referenceData.inflation}%</b></span>
              <span>Real yield ≈ <b>{realYield.toFixed(2)}%</b></span>
            </div>
          </article>
        </div>
        <p className="fine-print">⚠️ Risiko: {instrument.note} SBN memiliki risiko harga jika dijual sebelum jatuh tempo; RDPU juga bukan deposito dan hasilnya tidak dijamin. Ini simulasi edukasi, bukan janji keuntungan.</p>
      </section>

      <section className="purchase-panel full-span">
        <div className="section-heading">
          <span className="step-number">03</span>
          <div>
            <p className="section-kicker">Daya beli hari ini</p>
            <h2>Berapa kali gaji untuk membelinya?</h2>
          </div>
        </div>

        <div className="purchase-grid">
          {assets.map((asset, index) => {
            const months = asset.price / salary;
            return (
              <article className="purchase-card" key={asset.id}>
                <div className="purchase-art" aria-hidden="true">
                  <span>{index === 0 ? "Au" : index === 1 ? "▰" : "⌂"}</span>
                </div>
                <p>{asset.name}</p>
                <div className="price-input-row">
                  <span>Rp</span>
                  <input
                    aria-label={`Harga ${asset.name}`}
                    type="number"
                    min={1_000_000}
                    step={1_000_000}
                    value={asset.price}
                    onChange={(event) => setAssetPrices((current) => ({ ...current, [asset.id]: Math.max(Number(event.target.value), 0) }))}
                  />
                </div>
                <strong>{months.toFixed(1)}× gaji bulanan</strong>
                <small>≈ {(months / 12).toFixed(1)} tahun gaji kotor · {asset.helper}</small>
              </article>
            );
          })}
        </div>
        <p className="fine-print">Perbandingan ini menganggap 100% gaji dipakai membeli aset, jadi waktu nyata pasti lebih lama setelah biaya hidup. Harga mobil dan rumah adalah contoh nasional yang bisa kamu ubah.</p>
      </section>

      <footer className="calculator-footer full-span">
        <p><strong>Angka bukan takdir.</strong> Kalkulator ini membantu melihat skala, bukan meramal masa depan.</p>
        <Link href="/#metodologi">Baca metodologi & sumber <span aria-hidden="true">→</span></Link>
      </footer>
    </div>
  );
}
