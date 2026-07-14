const FALLBACK = {
  biRate: 5.75,
  usdIdr: 16_300,
  antam1g: 2_635_000,
  ihsg: 7_500,
};

const SOURCES = {
  biRate: "https://www.bi.go.id/id/statistik/indikator/bi-rate.aspx",
  usdIdr: "https://frankfurter.dev/",
  antam1g: "https://www.logammulia.com/id/harga-emas-hari-ini",
  ihsg: "https://finance.yahoo.com/quote/%5EJKSE/",
};

type MarketMetric = {
  value: number;
  date?: string;
  changePercent?: number;
  source: string;
  isFallback: boolean;
};

const fetchWithTimeout = (url: string, init: RequestInit = {}) =>
  fetch(url, {
    ...init,
    signal: AbortSignal.timeout(7_000),
    headers: {
      Accept: "application/json,text/html;q=0.9,*/*;q=0.8",
      "User-Agent": "Mozilla/5.0 (compatible; JejakGaji/1.0)",
      ...init.headers,
    },
  });

const cleanText = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ");

const toPrice = (value: string) => Number(value.replace(/[^\d]/g, ""));

async function getBiRate(): Promise<MarketMetric> {
  const response = await fetchWithTimeout(SOURCES.biRate);
  if (!response.ok) throw new Error("BI source unavailable");
  const text = cleanText(await response.text());
  const match = text.match(/(\d{1,2}\s+[A-Za-z]+\s+\d{4})\s+(\d+[.,]\d+)\s*%/i);
  if (!match) throw new Error("BI rate not found");
  const value = Number(match[2].replace(",", "."));
  if (!Number.isFinite(value) || value <= 0) throw new Error("BI rate is invalid");
  return { value, date: match[1], source: SOURCES.biRate, isFallback: false };
}

async function getUsdIdr(): Promise<MarketMetric> {
  const response = await fetchWithTimeout("https://api.frankfurter.dev/v2/rate/USD/IDR");
  if (!response.ok) throw new Error("FX source unavailable");
  const data = (await response.json()) as { rate?: number; date?: string };
  if (!data.rate) throw new Error("FX rate not found");
  return { value: data.rate, date: data.date, source: SOURCES.usdIdr, isFallback: false };
}

async function getAntam1g(): Promise<MarketMetric> {
  const response = await fetchWithTimeout(SOURCES.antam1g);
  if (!response.ok) throw new Error("Antam source unavailable");
  const text = cleanText(await response.text());
  const date = text.match(/Harga Emas Hari Ini,?\s+([^H]+?)\s+Harga di-update/i)?.[1]?.trim();
  const price = text.match(/(?:^|\s)1\s*gr\s+([\d.,]+)/i)?.[1];
  if (!price) throw new Error("Antam price not found");
  const value = toPrice(price);
  if (!Number.isFinite(value) || value <= 0) throw new Error("Antam price is invalid");
  return { value, date, source: SOURCES.antam1g, isFallback: false };
}

async function getIhsg(): Promise<MarketMetric> {
  const response = await fetchWithTimeout(
    "https://query1.finance.yahoo.com/v8/finance/chart/%5EJKSE?interval=1d&range=5d",
  );
  if (!response.ok) throw new Error("IHSG source unavailable");
  const data = (await response.json()) as {
    chart?: { result?: Array<{ meta?: { regularMarketPrice?: number; chartPreviousClose?: number } }> };
  };
  const meta = data.chart?.result?.[0]?.meta;
  if (!meta?.regularMarketPrice) throw new Error("IHSG value not found");
  const previous = meta.chartPreviousClose;
  const changePercent = previous ? ((meta.regularMarketPrice - previous) / previous) * 100 : undefined;
  return {
    value: meta.regularMarketPrice,
    changePercent,
    source: SOURCES.ihsg,
    isFallback: false,
  };
}

const fallbackMetric = (value: number, source: string): MarketMetric => ({
  value,
  source,
  isFallback: true,
});

export async function GET() {
  const [biRate, usdIdr, antam1g, ihsg] = await Promise.allSettled([
    getBiRate(),
    getUsdIdr(),
    getAntam1g(),
    getIhsg(),
  ]);

  const metrics = {
    biRate: biRate.status === "fulfilled" ? biRate.value : fallbackMetric(FALLBACK.biRate, SOURCES.biRate),
    usdIdr: usdIdr.status === "fulfilled" ? usdIdr.value : fallbackMetric(FALLBACK.usdIdr, SOURCES.usdIdr),
    antam1g: antam1g.status === "fulfilled" ? antam1g.value : fallbackMetric(FALLBACK.antam1g, SOURCES.antam1g),
    ihsg: ihsg.status === "fulfilled" ? ihsg.value : fallbackMetric(FALLBACK.ihsg, SOURCES.ihsg),
  };

  return Response.json(
    {
      metrics,
      updatedAt: new Date().toISOString(),
      allLive: Object.values(metrics).every((metric) => !metric.isFallback),
    },
    { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400" } },
  );
}
