import assert from "node:assert/strict";
import test from "node:test";

async function request(pathname = "/", accept = "text/html") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept } }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the selection-first home page", async () => {
  const response = await request();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Jejak Gaji/);
  assert.match(html, /Apa pekerjaanmu saat ini\?/);
  assert.match(html, /Langkah 1 dari 2/);
  assert.match(html, /Freelancer/);
  assert.match(html, /SBN \/ BI Bonds Yield/);
  assert.match(html, /USD \/ IDR/);
  assert.match(html, /Antam 1 gram/);
  assert.match(html, /IHSG Composite/);
  assert.match(html, /Market feed/i);
  assert.doesNotMatch(html, /diberi data via API/);
  assert.doesNotMatch(html, /class="nav-links"/);
  assert.doesNotMatch(html, /class="header-cta"/);
});

test("renders automatic freelance benchmark, PNG download, and real asset images", async () => {
  const response = await request("/profesi/freelance");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Langkah 2 dari 2/);
  assert.match(html, /Jejak Gaji\s*(?:<!-- -->)?\s*Freelancer/);
  assert.match(html, /Pendapatan tidak tetap tetap bisa punya arah/);
  assert.match(html, /Benchmark otomatis/);
  assert.match(html, /Rp\s*1\.920\.000/);
  assert.match(html, /Unduh ringkasan PNG/);
  assert.doesNotMatch(html, /Daerah tempat tinggal dan bekerja/);
  assert.match(html, /antam-10g\.png/);
  assert.match(html, /avanza\.png/);
  assert.match(html, /rumah-600-juta\.png/);
  assert.match(html, /Toyota Avanza 1\.5 G CVT/);
  assert.match(html, /purchase-progress/);
  assert.match(html, /Tanpa investasi/);
  assert.match(html, /Dengan investasi/);
  assert.match(html, /Aktifkan mode gelap/);
  assert.match(html, /<header class="site-header">[\s\S]*?class="theme-toggle"/);
  assert.doesNotMatch(html, /<section class="calculator-results"[^>]*>[\s\S]*?class="theme-toggle"/);
});

test("only the minimum-wage route asks for a working region", async () => {
  const response = await request("/profesi/upah-minimum");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Daerah tempat tinggal dan bekerja/);
  assert.match(html, /UMK(?:<!-- -->)?\s*2026/);
  assert.match(html, /Jika mulai 2026/);
});

test("renders current profession retirement benchmarks", async () => {
  const cases = [
    ["/profesi/guru", /BUP Guru ASN 60 tahun/, /2063/, /Golongan IV\/e/],
    ["/profesi/polisi", /BUP Bintara Polri 59 tahun/, /2066/, /Kombes/],
    ["/profesi/tni", /BUP Bintara TNI 55 tahun/, /2062/, /Kolonel/],
  ];

  for (const [path, rule, year, seniorGrade] of cases) {
    const response = await request(path);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, rule);
    assert.match(html, year);
    assert.match(html, /Golongan \/ pangkat|Golongan PNS/);
    assert.match(html, seniorGrade);
  }
});

test("market API always returns usable values", async () => {
  const response = await request("/api/market-data", "application/json");
  assert.equal(response.status, 200);
  const data = await response.json();

  for (const key of ["biRate", "usdIdr", "antam1g", "ihsg"]) {
    assert.equal(typeof data.metrics[key].value, "number");
    assert.ok(data.metrics[key].value > 0);
    assert.equal(typeof data.metrics[key].provider, "string");
  }
  assert.equal(data.metrics.usdIdr.provider, "Yahoo API");
  assert.equal(data.metrics.ihsg.provider, "Yahoo API");
});
