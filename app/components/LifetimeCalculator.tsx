"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

const loadCanvasImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

export function LifetimeCalculator({ profession }: { profession: Profession }) {
  const isMinimumWage = profession.slug === "upah-minimum";
  const [cityId, setCityId] = useState("kediri");
  const [salaryOptionId, setSalaryOptionId] = useState(
    profession.defaultSalaryOptionId ?? profession.salaryOptions?.[0]?.id ?? "",
  );
  const [salary, setSalary] = useState(profession.defaultSalary);
  const [salaryGrowth, setSalaryGrowth] = useState(3);
  const [savingRate, setSavingRate] = useState(15);
  const [instrumentId, setInstrumentId] = useState<keyof typeof investments>("sbn");
  const [isDownloading, setIsDownloading] = useState(false);
  const [assetPrices, setAssetPrices] = useState({
    gold: referenceData.gold10g,
    car: referenceData.car,
    house: referenceData.house,
  });
  const [goldPriceLive, setGoldPriceLive] = useState(false);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    fetch("/api/market-data", { signal: controller.signal })
      .then((response) => response.json())
      .then((data: { metrics?: { antam1g?: { value?: number; isFallback?: boolean } } }) => {
        const antam1g = data.metrics?.antam1g;
        if (!active || !antam1g?.value) return;
        setAssetPrices((current) => ({ ...current, gold: antam1g.value! * 10 }));
        setGoldPriceLive(!antam1g.isFallback);
      })
      .catch(() => undefined);

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const city = cityWages.find((item) => item.id === cityId) ?? cityWages[0];
  const instrument = investments[instrumentId];
  const salaryOption = profession.salaryOptions?.find((item) => item.id === salaryOptionId);
  const startAge = salaryOption?.startAge ?? profession.startAge;
  const retirementAge = salaryOption?.retirementAge ?? profession.retirementAge;
  const retirementRule = salaryOption?.retirementRule ?? profession.retirementRule;
  const workYears = Math.max(retirementAge - startAge, 1);
  const retirementYear = referenceData.currentYear + workYears;
  const postRetirementYears = Math.max(referenceData.lifeExpectancy - retirementAge, 0);
  const realYield = instrument.netYield - referenceData.inflation;
  const benchmarkLabel = isMinimumWage
    ? `${city.type} ${city.city} · pekerja <1 tahun`
    : salaryOption
      ? `${salaryOption.label} · gaji pokok minimum`
      : profession.benchmarkLabel;

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
    if (nextCity) setSalary(nextCity.amount);
  };

  const handleSalaryOption = (nextId: string) => {
    const nextOption = profession.salaryOptions?.find((item) => item.id === nextId);
    setSalaryOptionId(nextId);
    if (nextOption) setSalary(nextOption.salary);
  };

  const assets = [
    {
      id: "gold" as const,
      name: "Emas Antam 10g",
      price: assetPrices.gold,
      helper: `${goldPriceLive ? "Logam Mulia API" : "harga acuan"} · 10 gram`,
      image: "/antam-10g.png",
      alt: "Emas batangan Antam 10 gram dalam kemasan",
      fit: "contain",
      width: 250,
      height: 250,
    },
    {
      id: "car" as const,
      name: "Toyota Avanza 1.5 G CVT",
      price: assetPrices.car,
      helper: "acuan OTR Jakarta 2026",
      image: "/avanza.png",
      alt: "Toyota All New Avanza warna abu-abu",
      fit: "cover",
      width: 930,
      height: 620,
    },
    {
      id: "house" as const,
      name: "Rumah sederhana",
      price: assetPrices.house,
      helper: "ilustrasi rumah kelas Rp600 juta",
      image: "/rumah-600-juta.png",
      alt: "Rumah sederhana satu lantai dengan carport",
      fit: "cover",
      width: 1536,
      height: 1024,
    },
  ];

  const downloadSummary = async () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1500;
      const context = canvas.getContext("2d");
      if (!context) return;

      context.fillStyle = "#f5f0e6";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "rgba(33,31,26,.07)";
      context.lineWidth = 1;
      for (let line = 0; line <= canvas.width; line += 60) {
        context.beginPath();
        context.moveTo(line, 0);
        context.lineTo(line, canvas.height);
        context.stroke();
      }
      for (let line = 0; line <= canvas.height; line += 60) {
        context.beginPath();
        context.moveTo(0, line);
        context.lineTo(canvas.width, line);
        context.stroke();
      }

      context.fillStyle = profession.accent;
      context.fillRect(0, 0, canvas.width, 430);
      const logo = await loadCanvasImage(profession.image);
      context.save();
      context.beginPath();
      context.arc(125, 120, 65, 0, Math.PI * 2);
      context.clip();
      context.drawImage(logo, 60, 55, 130, 130);
      context.restore();

      context.fillStyle = "rgba(255,255,255,.72)";
      context.font = "600 24px Segoe UI, Arial";
      context.letterSpacing = "3px";
      context.fillText("RINGKASAN JEJAK GAJI · 2026", 225, 105);
      context.fillStyle = "#fffdf8";
      context.font = "400 58px Georgia, serif";
      context.fillText(profession.name, 225, 165);
      context.font = "400 108px Georgia, serif";
      context.fillText(compactRupiah(calculation.totalIncome), 70, 320);
      context.font = "400 25px Segoe UI, Arial";
      context.fillStyle = "rgba(255,255,255,.72)";
      context.fillText("estimasi penghasilan kotor selama masa kerja", 75, 365);

      const drawMetric = (label: string, value: string, x: number, y: number, width = 500) => {
        context.fillStyle = "#6f6b61";
        context.font = "600 20px Segoe UI, Arial";
        context.fillText(label.toUpperCase(), x, y);
        context.fillStyle = "#211f1a";
        context.font = "400 38px Georgia, serif";
        context.fillText(value, x, y + 52, width);
      };

      context.fillStyle = "#fffdf8";
      context.fillRect(55, 475, 1090, 250);
      drawMetric("Benchmark otomatis", rupiah.format(salary), 90, 525, 470);
      drawMetric("Masa kerja", `${workYears} tahun`, 630, 525, 420);
      drawMetric("Mulai kerja", `Usia ${startAge} · ${referenceData.currentYear}`, 90, 635, 470);
      drawMetric(
        profession.retirementIsTarget ? "Target pensiun" : "Pensiun sesuai BUP",
        `Usia ${retirementAge} · ${retirementYear}`,
        630,
        635,
        420,
      );

      context.fillStyle = profession.accent;
      context.fillRect(55, 760, 1090, 300);
      context.fillStyle = "rgba(255,255,255,.7)";
      context.font = "600 20px Segoe UI, Arial";
      context.fillText(`${savingRate}% PENGHASILAN DISISIHKAN`, 90, 815);
      context.fillStyle = "#fffdf8";
      context.font = "400 42px Georgia, serif";
      context.fillText(`Tanpa investasi  ${compactRupiah(calculation.cashSaved)}`, 90, 885);
      context.fillText(`Dengan ${instrument.name}  ${compactRupiah(calculation.invested)}`, 90, 955);
      context.fillStyle = "rgba(255,255,255,.7)";
      context.font = "400 23px Segoe UI, Arial";
      context.fillText(`Yield neto ${instrument.netYield.toFixed(2)}% · potensi tambahan ${compactRupiah(calculation.growth)}`, 90, 1015);

      context.fillStyle = "#211f1a";
      context.font = "400 36px Georgia, serif";
      context.fillText("Daya beli dalam kelipatan gaji", 70, 1135);
      assets.forEach((asset, index) => {
        const x = 70 + index * 360;
        context.fillStyle = "#6f6b61";
        context.font = "600 18px Segoe UI, Arial";
        context.fillText(asset.name.toUpperCase(), x, 1195, 310);
        context.fillStyle = profession.accent;
        context.font = "400 44px Georgia, serif";
        context.fillText(`${(asset.price / salary).toFixed(1)}× gaji`, x, 1255, 310);
      });

      context.fillStyle = "#6f6b61";
      context.font = "400 20px Segoe UI, Arial";
      context.fillText(benchmarkLabel, 70, 1350, 1050);
      context.fillText(`Acuan ${profession.benchmarkYear} · UHH ${referenceData.lifeExpectancy} tahun · kenaikan gaji ${salaryGrowth}%/tahun`, 70, 1385, 1050);
      context.font = "400 17px Segoe UI, Arial";
      context.fillText("Simulasi edukasi, bukan janji pendapatan atau keuntungan investasi.", 70, 1440);
      context.fillStyle = profession.accent;
      context.font = "700 20px Segoe UI, Arial";
      context.fillText("JEJAK GAJI", 965, 1440);

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `jejak-gaji-${profession.slug}-2026.png`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="calculator-shell">
      <section className="calculator-controls" aria-labelledby="input-title">
        <div className="section-heading compact-heading">
          <span className="step-number">01</span>
          <div>
            <p className="section-kicker">Benchmark otomatis</p>
            <h2 id="input-title">Jalurmu sudah diisi</h2>
          </div>
        </div>

        <div className="control-stack">
          {isMinimumWage ? (
            <label className="field-label" htmlFor="city">
              <span>Daerah tempat tinggal dan bekerja</span>
              <select id="city" value={cityId} onChange={(event) => handleCity(event.target.value)}>
                {cityWages.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.city} · {item.type} {rupiah.format(item.amount)}
                  </option>
                ))}
              </select>
              <small>{city.type} 2026 · benchmark daerah terpilih otomatis</small>
            </label>
          ) : null}

          {profession.salaryOptions ? (
            <label className="field-label" htmlFor="salary-option">
              <span>{profession.slug === "guru" ? "Golongan PNS" : "Golongan / pangkat"}</span>
              <select
                id="salary-option"
                value={salaryOptionId}
                onChange={(event) => handleSalaryOption(event.target.value)}
              >
                {Array.from(new Set(profession.salaryOptions.map((item) => item.group))).map((group) => (
                  <optgroup label={group} key={group}>
                    {profession.salaryOptions!
                      .filter((item) => item.group === group)
                      .map((item) => (
                        <option value={item.id} key={item.id}>
                          {item.label} · {rupiah.format(item.salary)}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
              <small>Gaji pokok minimum 2024 · belum termasuk masa kerja dan tunjangan</small>
            </label>
          ) : null}

          <div className="benchmark-card">
            <div className="benchmark-card-head">
              <Image src={profession.image} alt="" width={1024} height={1024} sizes="64px" unoptimized />
              <div>
                <span>Benchmark {isMinimumWage ? 2026 : profession.benchmarkYear}</span>
                <strong>{benchmarkLabel}</strong>
              </div>
            </div>
            <div className="benchmark-salary">
              <span>Penghasilan awal per bulan</span>
              <strong>{rupiah.format(salary)}</strong>
            </div>
            <div className="benchmark-facts">
              <div><span>Mulai bekerja</span><strong>{startAge} tahun</strong></div>
              <div><span>{profession.retirementIsTarget ? "Target pensiun" : "Usia pensiun"}</span><strong>{retirementAge} tahun</strong></div>
              <div><span>Jika mulai 2026</span><strong>{retirementYear}</strong></div>
            </div>
            <p>{retirementRule}</p>
          </div>

          <div className="split-fields assumption-sliders">
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
          Nominal sebelum biaya hidup, dengan kenaikan gaji {salaryGrowth}% per tahun dan {profession.annualPayments} kali pembayaran per tahun.
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
          <p>
            {profession.retirementIsTarget ? "Target pensiun" : "Batas pensiun"} jatuh sekitar <strong>{retirementYear}</strong> jika mulai pada 2026. Setelah itu ada sekitar <strong>{postRetirementYears.toFixed(1)} tahun</strong> hingga UHH nasional.
          </p>
        </div>

        <div className="mini-metrics">
          <div><span>Setara bulanan + bonus</span><strong>{compactRupiah(calculation.monthlyEquivalent)}</strong></div>
          <div><span>Tahun pensiun</span><strong>{retirementYear}</strong></div>
          <div><span>Masa setelah pensiun</span><strong>{postRetirementYears.toFixed(1)} tahun</strong></div>
        </div>

        <button className="download-summary" type="button" onClick={downloadSummary} disabled={isDownloading}>
          <span aria-hidden="true">↓</span>
          {isDownloading ? "Menyiapkan gambar..." : "Unduh ringkasan PNG"}
        </button>
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
            <p>Tanpa investasi</p>
            <strong>{compactRupiah(calculation.cashSaved)}</strong>
            <div className="scenario-result-bar" aria-hidden="true">
              <span style={{ width: `${calculation.invested > 0 ? (calculation.cashSaved / calculation.invested) * 100 : 0}%` }} />
            </div>
            <small>Total dari {savingRate}% penghasilan · tidak mendapat imbal hasil</small>
          </article>
          <div className="versus-badge">VS</div>
          <article className="scenario-card invest-card">
            <div className="scenario-icon">+{instrument.netYield.toFixed(2)}%</div>
            <p>Dengan investasi {instrument.name}</p>
            <strong>{compactRupiah(calculation.invested)}</strong>
            <div className="scenario-result-bar" aria-hidden="true"><span style={{ width: calculation.invested > 0 ? "100%" : "0%" }} /></div>
            <small>Total setoran + estimasi imbal hasil yang diinvestasikan kembali</small>
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
          {assets.map((asset) => {
            const months = asset.price / salary;
            const years = months / 12;
            const progress = Math.min((years / workYears) * 100, 100);
            const exceedsCareer = years > workYears;
            return (
              <article className="purchase-card" key={asset.id}>
                <div className="purchase-art">
                  <Image
                    className={`asset-image ${asset.fit}`}
                    src={asset.image}
                    alt={asset.alt}
                    width={asset.width}
                    height={asset.height}
                    sizes="(max-width: 680px) 100vw, 33vw"
                    unoptimized
                  />
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
                <div className={`purchase-progress ${exceedsCareer ? "over-career" : ""}`}>
                  <div className="purchase-progress-track" aria-label={`${years.toFixed(1)} tahun gaji kotor`}>
                    <span style={{ width: `${progress}%` }} />
                  </div>
                  <div className="purchase-progress-years">
                    <span>0 th</span>
                    <strong>{years.toFixed(1)} tahun gaji</strong>
                    <span>{workYears} th karier</span>
                  </div>
                </div>
                <small>{exceedsCareer ? "Melewati estimasi masa kerja · " : "100% gaji kotor · "}{asset.helper}</small>
              </article>
            );
          })}
        </div>
        <p className="fine-print">Perbandingan ini menganggap 100% gaji dipakai membeli aset, jadi waktu nyata pasti lebih lama setelah biaya hidup. Avanza memakai acuan OTR Jakarta 2026, sedangkan rumah adalah contoh Rp600 juta yang bisa kamu ubah.</p>
      </section>

      <footer className="calculator-footer full-span">
        <p><strong>Angka bukan takdir.</strong> Kalkulator ini membantu melihat skala, bukan meramal masa depan.</p>
        <Link href="/#metodologi">Baca metodologi data <span aria-hidden="true">→</span></Link>
      </footer>
    </div>
  );
}
