"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DownloadCardStudio } from "./DownloadCardStudio";
import {
  cityWages,
  investments,
  referenceData,
  type Profession,
} from "../data";
import { compactRupiah, percentage, rupiah } from "../format";

export function LifetimeCalculator({ profession }: { profession: Profession }) {
  const isMinimumWage = profession.slug === "upah-minimum";
  const isCustom = profession.slug === "custom";
  const [cityId, setCityId] = useState("kediri");
  const [salaryOptionId, setSalaryOptionId] = useState(
    profession.defaultSalaryOptionId ?? profession.salaryOptions?.[0]?.id ?? "",
  );
  const [salary, setSalary] = useState(profession.defaultSalary);
  const [customStartAge, setCustomStartAge] = useState(profession.startAge);
  const [customRetirementAge, setCustomRetirementAge] = useState(profession.retirementAge);
  const [customAnnualPayments, setCustomAnnualPayments] = useState(profession.annualPayments);
  const [salaryGrowth, setSalaryGrowth] = useState(3);
  const [savingRate, setSavingRate] = useState(30);
  const [isDownloading, setIsDownloading] = useState(false);
  const [assetPrices, setAssetPrices] = useState({
    gold: referenceData.gold10g,
    car: referenceData.car,
    house: referenceData.house,
    ferrari: referenceData.ferrari,
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
  const instrument = investments.sbn;
  const salaryOption = profession.salaryOptions?.find((item) => item.id === salaryOptionId);
  const startAge = isCustom ? customStartAge : salaryOption?.startAge ?? profession.startAge;
  const retirementAge = isCustom
    ? Math.max(customRetirementAge, customStartAge + 1)
    : salaryOption?.retirementAge ?? profession.retirementAge;
  const annualPayments = isCustom ? customAnnualPayments : profession.annualPayments;
  const retirementRule = isCustom
    ? `Target pensiun custom pada usia ${retirementAge} tahun`
    : salaryOption?.retirementRule ?? profession.retirementRule;
  const workYears = Math.max(retirementAge - startAge, 1);
  const retirementYear = referenceData.currentYear + workYears;
  const postRetirementYears = Math.max(referenceData.lifeExpectancy - retirementAge, 0);
  const realYield = instrument.netYield - referenceData.inflation;
  const benchmarkLabel = isMinimumWage
    ? `${city.type} ${city.city} · pekerja <1 tahun`
    : salaryOption
      ? `${salaryOption.label} · gaji pokok minimum`
      : isCustom
        ? `Data custom · ${annualPayments} kali pembayaran per tahun`
        : profession.benchmarkLabel;

  const calculation = useMemo(() => {
    const months = workYears * 12;
    const monthlyEquivalent = salary * (annualPayments / 12);
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
      firstMonthlySaving: salary * (savingRate / 100),
      firstYearSaving: salary * annualPayments * (savingRate / 100),
    };
  }, [annualPayments, instrument.netYield, salary, salaryGrowth, savingRate, workYears]);

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
      image: "/purchasing/antam-10g-cutout.png",
      alt: "Emas batangan Antam 10 gram dalam kemasan",
      fit: "contain",
      width: 1254,
      height: 1254,
    },
    {
      id: "car" as const,
      name: "Toyota Avanza 1.5 G CVT",
      price: assetPrices.car,
      helper: "acuan OTR Jakarta 2026",
      image: "/purchasing/avanza-cutout.png",
      alt: "Toyota All New Avanza warna abu-abu",
      fit: "contain",
      width: 1535,
      height: 1024,
    },
    {
      id: "house" as const,
      name: "Rumah sederhana",
      price: assetPrices.house,
      helper: "ilustrasi rumah kelas Rp600 juta",
      image: "/purchasing/rumah-cutout.png",
      alt: "Rumah sederhana satu lantai dengan carport",
      fit: "contain",
      width: 1536,
      height: 1024,
    },
    {
      id: "ferrari" as const,
      name: "Ferrari Roma",
      price: assetPrices.ferrari,
      helper: "ilustrasi harga Rp10 miliar",
      image: "/purchasing/ferrari-cutout.png",
      alt: "Ferrari Roma merah tampak depan tiga perempat",
      fit: "contain",
      width: 1536,
      height: 1024,
    },
  ];

  return (
    <div className="calculator-shell">
      <section className="calculator-controls" aria-labelledby="input-title">
        <div className="section-heading compact-heading">
          <span className="step-number">01</span>
          <div>
            <p className="section-kicker">{isCustom ? "Data milikmu" : "Benchmark otomatis"}</p>
            <h2 id="input-title">{isCustom ? "Atur jalur kerjamu" : "Jalurmu sudah diisi"}</h2>
          </div>
        </div>

        <div className="control-stack">
          {isCustom ? (
            <div className="custom-input-grid">
              <label className="field-label custom-salary-field" htmlFor="custom-salary">
                <span>Penghasilan per bulan</span>
                <div className="number-field">
                  <span>Rp</span>
                  <input
                    id="custom-salary"
                    type="number"
                    min={100_000}
                    step={100_000}
                    value={salary}
                    onChange={(event) => setSalary(Math.max(Number(event.target.value), 0))}
                  />
                </div>
              </label>
              <label className="field-label" htmlFor="custom-start-age">
                <span>Usia mulai bekerja</span>
                <div className="number-field">
                  <input
                    id="custom-start-age"
                    type="number"
                    min={15}
                    max={70}
                    value={customStartAge}
                    onChange={(event) => setCustomStartAge(Math.min(Math.max(Number(event.target.value), 15), 70))}
                  />
                  <span>tahun</span>
                </div>
              </label>
              <label className="field-label" htmlFor="custom-retirement-age">
                <span>Target pensiun</span>
                <div className="number-field">
                  <input
                    id="custom-retirement-age"
                    type="number"
                    min={16}
                    max={85}
                    value={customRetirementAge}
                    onChange={(event) => setCustomRetirementAge(Math.min(Math.max(Number(event.target.value), 16), 85))}
                  />
                  <span>tahun</span>
                </div>
              </label>
              <label className="field-label" htmlFor="custom-payments">
                <span>Pembayaran per tahun</span>
                <div className="number-field">
                  <input
                    id="custom-payments"
                    type="number"
                    min={1}
                    max={24}
                    value={customAnnualPayments}
                    onChange={(event) => setCustomAnnualPayments(Math.min(Math.max(Number(event.target.value), 1), 24))}
                  />
                  <span>kali</span>
                </div>
              </label>
            </div>
          ) : null}

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
                <span>{isCustom ? "Ringkasan input" : `Benchmark ${isMinimumWage ? 2026 : profession.benchmarkYear}`}</span>
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
            <div className="field-label saving-rate-field">
              <div className="label-row"><span>Disisihkan</span><strong>{savingRate}%</strong></div>
              <input aria-label="Persentase penghasilan yang disisihkan" type="range" min={0} max={40} step={1} value={savingRate} onChange={(event) => setSavingRate(Number(event.target.value))} />
              <div className="saving-live-preview" aria-live="polite">
                <div><span>Dari gaji bulanan awal</span><strong>{rupiah.format(calculation.firstMonthlySaving)}</strong></div>
                <div><span>Setoran tahun pertama</span><strong>{compactRupiah(calculation.firstYearSaving)}</strong></div>
                <div><span>Tanpa investasi sampai pensiun</span><strong>{compactRupiah(calculation.cashSaved)}</strong></div>
                <div><span>Jika rutin di {instrument.short}</span><strong>{compactRupiah(calculation.invested)}</strong></div>
                <p>
                  Dari estimasi total penghasilan <b>{compactRupiah(calculation.totalIncome)}</b>, porsi {savingRate}% setara <b>{compactRupiah(calculation.cashSaved)}</b> sebelum imbal hasil.
                </p>
              </div>
              <small className="saving-rate-note">Simulasi dimulai dari 30%. Geser persentase untuk melihat nominalnya berubah langsung.</small>
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
          <p>Preview skenario akhir masa kerja</p>
          <span>{workYears} tahun bekerja</span>
        </div>

        <div
          className="result-scenario-preview"
          key={`${salary}-${salaryGrowth}-${savingRate}-${workYears}`}
        >
          <article className="result-scenario-card">
            <div className="result-scenario-card-head"><b>01</b><span>Tanpa investasi</span></div>
            <strong>{compactRupiah(calculation.cashSaved)}</strong>
            <small>{savingRate}% penghasilan hanya disimpan</small>
            <div className="result-mini-bars flat" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
            <i aria-hidden="true"><b style={{ width: `${calculation.invested > 0 ? (calculation.cashSaved / calculation.invested) * 100 : 0}%` }} /></i>
          </article>
          <div className="result-scenario-vs">VS</div>
          <article className="result-scenario-card invested">
            <div className="result-scenario-card-head"><b>02</b><span>Dengan {instrument.name}</span></div>
            <strong>{compactRupiah(calculation.invested)}</strong>
            <small>Yield neto {percentage.format(instrument.netYield)}% per tahun</small>
            <div className="result-mini-bars" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
            <i aria-hidden="true"><b style={{ width: calculation.invested > 0 ? "100%" : "0%" }} /></i>
          </article>
        </div>

        <div className="result-growth-highlight">
          <div><span>Potensi tambahan dari investasi</span><small>Efek compounding selama {workYears} tahun</small></div>
          <strong>+{compactRupiah(calculation.growth)}</strong>
        </div>

        <p className="result-caption">
          Skenario memakai kenaikan gaji {salaryGrowth}% per tahun, {annualPayments} kali pembayaran, dan setoran rutin selama masa kerja.
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
          <div><span>Total penghasilan kotor</span><strong>{compactRupiah(calculation.totalIncome)}</strong></div>
          <div><span>Tahun pensiun</span><strong>{retirementYear}</strong></div>
          <div><span>Masa setelah pensiun</span><strong>{postRetirementYears.toFixed(1)} tahun</strong></div>
        </div>

        <DownloadCardStudio
          accent={profession.accent}
          cashSaved={calculation.cashSaved}
          invested={calculation.invested}
          instrumentName={instrument.name}
          instrumentShort={instrument.short}
          instrumentSource={instrument.sourceLabel}
          netYield={instrument.netYield}
          isDownloading={isDownloading}
          onDownloadingChange={setIsDownloading}
          annualPayments={annualPayments}
          benchmarkLabel={benchmarkLabel}
          benchmarkYear={isMinimumWage ? 2026 : profession.benchmarkYear}
          monthlySalary={salary}
          professionImage={profession.image}
          professionName={profession.name}
          professionSlug={profession.slug}
          retirementAge={retirementAge}
          savingRate={savingRate}
          salaryGrowth={salaryGrowth}
          startAge={startAge}
          workYears={workYears}
        />
      </section>

      <section className="investment-panel full-span">
        <div className="section-heading">
          <span className="step-number">02</span>
          <div>
            <p className="section-kicker">Uang yang sama, hasil berbeda</p>
            <h2>Disimpan saja vs Obligasi Negara.</h2>
          </div>
        </div>

        <div className="bond-assumption" aria-label="Instrumen investasi default">
          <span className="bond-assumption-mark">ID</span>
          <div>
            <small>Instrumen default · Obligasi Negara</small>
            <strong>{instrument.short} · kupon tetap {percentage.format(instrument.grossYield)}% bruto</strong>
            <p>Simulasi memakai yield neto {percentage.format(instrument.netYield)}% setelah PPh final 10%.</p>
          </div>
          <span className="bond-source-label">Sumber: DJPPR Kementerian Keuangan</span>
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
            <div className="scenario-icon">+{percentage.format(instrument.netYield)}%</div>
            <p>Dengan investasi {instrument.name}</p>
            <strong>{compactRupiah(calculation.invested)}</strong>
            <div className="scenario-result-bar" aria-hidden="true"><span style={{ width: calculation.invested > 0 ? "100%" : "0%" }} /></div>
            <small>Total setoran + estimasi imbal hasil yang diinvestasikan kembali</small>
          </article>
          <article className="growth-card">
            <p>Potensi tambahan dari compounding</p>
            <strong>+{compactRupiah(calculation.growth)}</strong>
            <div className="yield-row">
              <span>Yield neto <b>{percentage.format(instrument.netYield)}%</b></span>
              <span>Inflasi <b>{referenceData.inflation}%</b></span>
              <span>Real yield ≈ <b>{percentage.format(realYield)}%</b></span>
            </div>
          </article>
        </div>
        <p className="fine-print">⚠️ Risiko: {instrument.note} ORI memiliki risiko harga jika dijual sebelum jatuh tempo. Ini simulasi edukasi, bukan janji keuntungan.</p>
      </section>

      <section className="purchase-panel full-span">
        <div className="section-heading">
          <span className="step-number">03</span>
          <div>
            <p className="section-kicker">Daya beli hari ini</p>
            <h2>Berapa kali gaji bulanan untuk membelinya?</h2>
          </div>
        </div>

        <div className="purchase-journey-list">
          {assets.map((asset) => {
            const years = asset.price / Math.max(salary * annualPayments, 1);
            const salaryMultiple = asset.price / Math.max(salary, 1);
            const totalUnits = calculation.totalIncome / Math.max(asset.price, 1);
            const timeLabel = years < 1 ? `${(years * 12).toFixed(1)} bulan` : `${years.toFixed(1)} tahun`;
            return (
              <article className="purchase-journey" key={asset.id}>
                <div className="purchase-total-block">
                  <span>Gaji bulanan awal</span>
                  <strong>{compactRupiah(salary)}</strong>
                  <div className="purchase-lifetime-note">
                    <span>Estimasi penghasilan seumur kerja</span>
                    <b>{compactRupiah(calculation.totalIncome)}</b>
                  </div>
                </div>

                <div className="purchase-arrow-block">
                  <div className="purchase-arrow-motion" aria-hidden="true">
                    <span /><i /><i /><i />
                  </div>
                  <strong>{salaryMultiple.toFixed(1)}×</strong>
                  <span>gaji bulanan menuju aset</span>
                  <small>≈ {timeLabel} gaji kotor</small>
                </div>

                <div className="purchase-asset-block">
                  <div className="purchase-cutout">
                    <Image
                      className="asset-cutout"
                      src={asset.image}
                      alt={asset.alt}
                      width={asset.width}
                      height={asset.height}
                      sizes="(max-width: 680px) 75vw, 260px"
                      loading="eager"
                      unoptimized
                    />
                  </div>
                  <div className="purchase-asset-copy">
                    <div className="purchase-asset-title">
                      <span className="purchase-asset-icon" aria-hidden="true">
                        <Image src={asset.image} alt="" width={64} height={64} unoptimized />
                      </span>
                      <p>{asset.name}</p>
                    </div>
                    <strong className="purchase-price-value">{compactRupiah(asset.price)}</strong>
                    <div className="price-input-row">
                      <span>Ubah Rp</span>
                      <input
                        aria-label={`Harga ${asset.name}`}
                        type="number"
                        min={1_000_000}
                        step={1_000_000}
                        value={asset.price}
                        onChange={(event) => setAssetPrices((current) => ({ ...current, [asset.id]: Math.max(Number(event.target.value), 0) }))}
                      />
                    </div>
                    <small>
                      {totalUnits >= 1
                        ? `Total gaji setara ${totalUnits.toFixed(1)} unit`
                        : `Total gaji menutup ${(totalUnits * 100).toFixed(0)}% harga`} · {asset.helper}
                    </small>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <p className="fine-print">Estimasi tahun memakai 100% gaji awal sebelum biaya hidup. Waktu nyata pasti lebih lama setelah kebutuhan bulanan, pajak, dan perubahan harga aset.</p>
      </section>

      <footer className="calculator-footer full-span">
        <p><strong>Angka bukan takdir.</strong> Kalkulator ini membantu melihat skala, bukan meramal masa depan.</p>
        <Link href="/#metodologi">Baca metodologi data <span aria-hidden="true">→</span></Link>
      </footer>
    </div>
  );
}
