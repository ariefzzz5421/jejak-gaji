"use client";

import { useEffect, useState } from "react";

type Metric = {
  value: number;
  date?: string;
  changePercent?: number;
  provider: "Yahoo API" | "BI feed" | "Logam Mulia feed";
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
        // The API route already keeps a dated fallback for every metric.
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
      label: "SBN / BI Bonds Yield",
      value: metrics ? `${number.format(metrics.biRate.value)}%` : "—",
      metric: metrics?.biRate,
    },
    {
      key: "usd",
      label: "USD / IDR",
      value: metrics ? rupiah.format(metrics.usdIdr.value).replace("Rp", "Rp ") : "—",
      metric: metrics?.usdIdr,
      change: metrics?.usdIdr.changePercent,
    },
    {
      key: "gold",
      label: "Antam 1 gram",
      value: metrics ? rupiah.format(metrics.antam1g.value).replace("Rp", "Rp ") : "—",
      metric: metrics?.antam1g,
    },
    {
      key: "ihsg",
      label: "IHSG Composite",
      value: metrics ? number.format(metrics.ihsg.value) : "—",
      metric: metrics?.ihsg,
      change: metrics?.ihsg.changePercent,
    },
  ];

  return (
    <section className="market-ticker" aria-label="Ringkasan data pasar Indonesia via API">
      <div className="market-status">
        <span className={data?.allLive ? "live-dot" : "live-dot soft"} />
        <b>Market feed</b>
        <small>{data ? "diberi data via API" : "menghubungkan API"}</small>
      </div>
      <div className="market-cells">
        {cells.map((cell) => (
          <div
            className="market-cell"
            key={cell.key}
            title={cell.metric?.date ? `Data ${cell.metric.date}` : "Menunggu data API"}
          >
            <span>{cell.label}</span>
            <div className="market-value-row">
              <strong>{cell.value}</strong>
              {typeof cell.change === "number" ? (
                <em className={cell.change >= 0 ? "positive" : "negative"}>
                  {cell.change >= 0 ? "+" : ""}{cell.change.toFixed(2)}%
                </em>
              ) : null}
            </div>
            <small>{cell.metric?.provider ?? "API feed"}</small>
            {cell.metric?.isFallback ? <i>cadangan</i> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
