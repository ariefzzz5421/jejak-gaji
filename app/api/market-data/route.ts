const FALLBACK = {
  biRate: 5.75,
  usdIdr: 16_300,
  antam1g: 2_635_000,
  ihsg: 7_500,
};

const ENDPOINTS = {
  biRate: "https://www.bi.go.id/id/statistik/indikator/bi-rate.aspx",
  antam1g: "https://www.logammulia.com/id/harga-emas-hari-ini",
  yahooChart: "https://query1.finance.yahoo.com/v8/finance/chart",
};

type MarketMetric = {
  value: number;
  date?: string;
  changePercent?: number;
  provider: "Yahoo API" | "BI feed" | "Logam Mulia feed";
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
  const response = await fetchWithTimeout(ENDPOINTS.biRate);
  if (!response.ok) throw new Error("BI feed unavailable");
  const text = cleanText(await response.text());
  const match = text.match(/(\d{1,2}\s+[A-Za-z]+\s+\d{4})\s+(\d+[.,]\d+)\s*%/i);
  if (!match) throw new Error("BI rate not found");
  const value = Number(match[2].replace(",", "."));
  if (!Number.isFinite(value) || value <= 0) throw new Error("BI rate is invalid");
  return { value, date: match[1], provider: "BI feed", isFallback: false };
}

async function getYahooMetric(symbol: string): Promise<Omit<MarketMetric, "provider">> {
  const response = await fetchWithTimeout(
    `${ENDPOINTS.yahooChart}/${encodeURIComponent(symbol)}?interval=1d&range=5d`,
  );
  if (!response.ok) throw new Error(`Yahoo API unavailable for ${symbol}`);
  const data = (await response.json()) as {
    chart?: {
      result?: Array<{
        meta?: {
          regularMarketPrice?: number;
          chartPreviousClose?: number;
          regularMarketTime?: number;
        };
      }>;
    };
  };
  const meta = data.chart?.result?.[0]?.meta;
  if (!meta?.regularMarketPrice) throw new Error(`Yahoo value not found for ${symbol}`);
  const previous = meta.chartPreviousClose;
  return {
    value: meta.regularMarketPrice,
    changePercent: previous ? ((meta.regularMarketPrice - previous) / previous) * 100 : undefined,
    date: meta.regularMarketTime
      ? new Date(meta.regularMarketTime * 1000).toISOString()
      : undefined,
    isFallback: false,
  };
}

async function getUsdIdr(): Promise<MarketMetric> {
  return { ...(await getYahooMetric("IDR=X")), provider: "Yahoo API" };
}

async function getAntam1g(): Promise<MarketMetric> {
  const response = await fetchWithTimeout(ENDPOINTS.antam1g);
  if (!response.ok) throw new Error("Antam feed unavailable");
  const text = cleanText(await response.text());
  const date = text.match(/Harga Emas Hari Ini,?\s+([^H]+?)\s+Harga di-update/i)?.[1]?.trim();
  const price = text.match(/(?:^|\s)1\s*gr\s+([\d.,]+)/i)?.[1];
  if (!price) throw new Error("Antam price not found");
  const value = toPrice(price);
  if (!Number.isFinite(value) || value <= 0) throw new Error("Antam price is invalid");
  return { value, date, provider: "Logam Mulia feed", isFallback: false };
}

async function getIhsg(): Promise<MarketMetric> {
  return { ...(await getYahooMetric("^JKSE")), provider: "Yahoo API" };
}

const fallbackMetric = (
  value: number,
  provider: MarketMetric["provider"],
): MarketMetric => ({ value, provider, isFallback: true });

export async function GET() {
  const [biRate, usdIdr, antam1g, ihsg] = await Promise.allSettled([
    getBiRate(),
    getUsdIdr(),
    getAntam1g(),
    getIhsg(),
  ]);

  const metrics = {
    biRate: biRate.status === "fulfilled" ? biRate.value : fallbackMetric(FALLBACK.biRate, "BI feed"),
    usdIdr: usdIdr.status === "fulfilled" ? usdIdr.value : fallbackMetric(FALLBACK.usdIdr, "Yahoo API"),
    antam1g: antam1g.status === "fulfilled" ? antam1g.value : fallbackMetric(FALLBACK.antam1g, "Logam Mulia feed"),
    ihsg: ihsg.status === "fulfilled" ? ihsg.value : fallbackMetric(FALLBACK.ihsg, "Yahoo API"),
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
