"use client";

import { useEffect, useState } from "react";

type Metric = {
  value: number;
  date?: string;
  changePercent?: number;
  source: string;
  isFallback: boolean;
};

type MarketResponse = {
  metrics: {
    biRate: Metric;
    usdIdr: Metric;
    antam1g: Metric;
    ihsg: Metric;
  };
  updatedAt: string;
  allLive: boolean;
};

const number = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 });
const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function MarketTicker() {
  const [data, setData] = useState<MarketResponse | null>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch("/api/market-data", { signal: controller.signal });
        if (!response.ok) return;
        const next = (await response.json()) as MarketResponse;
        if (active) setData(next);
      } catch {
        // Keep the calm loading state; the API itself supplies per-source fallbacks.
      }
    };

    load();
    const timer = window.setInterval(load, 30 * 60 * 1000);
    return () => {
      active = false;
      controller.abort();
      window.clearInterval(timer);
    };
  }, []);

  const metrics = data?.metrics;
  const cells = [
    {
      key: "bi",
      label: "BI Rate · acuan SBN",
      value: metrics ? `${number.format(metrics.biRate.value)}%` : "Memuat...",
      metric: metrics?.biRate,
      source: "https://www.bi.go.id/id/statistik/indikator/bi-rate.aspx",
    },
    {
      key: "usd",
      label: "USD / IDR",
      value: metrics ? rupiah.format(metrics.usdIdr.value).replace("Rp", "Rp ") : "Memuat...",
      metric: metrics?.usdIdr,
      source: "https://frankfurter.dev/",
    },
    {
      key: "gold",
      label: "Antam 1 gram",
      value: metrics ? rupiah.format(metrics.antam1g.value).replace("Rp", "Rp ") : "Memuat...",
      metric: metrics?.antam1g,
      source: "https://www.logammulia.com/id/harga-emas-hari-ini",
    },
    {
      key: "ihsg",
      label: "IHSG Composite",
      value: metrics ? number.format(metrics.ihsg.value) : "Memuat...",
      metric: metrics?.ihsg,
      change: metrics?.ihsg.changePercent,
      source: "https://finance.yahoo.com/quote/%5EJKSE/",
    },
  ];

  return (
    <section className="market-ticker" aria-label="Ringkasan data pasar Indonesia">
      <div className="market-status">
        <span className={data?.allLive ? "live-dot" : "live-dot soft"} />
        <b>Data pasar</b>
        <small>{data ? (data.allLive ? "live" : "live + cadangan") : "menghubungkan"}</small>
      </div>
      <div className="market-cells">
        {cells.map((cell) => (
          <a
            key={cell.key}
            href={cell.metric?.source ?? cell.source}
            target="_blank"
            rel="noreferrer"
            title={cell.metric?.date ? `Data ${cell.metric.date}` : "Sumber data"}
          >
            <span>{cell.label}</span>
            <strong>{cell.value}</strong>
            {typeof cell.change === "number" ? (
              <em className={cell.change >= 0 ? "positive" : "negative"}>
                {cell.change >= 0 ? "+" : ""}{cell.change.toFixed(2)}%
              </em>
            ) : null}
            {cell.metric?.isFallback ? <i>cadangan</i> : null}
          </a>
        ))}
      </div>
    </section>
  );
}
