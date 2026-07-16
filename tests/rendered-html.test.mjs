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
  assert.match(html, /Simulasi perubahan usia dari 20 hingga 74 tahun/);
  assert.match(html, /Geser untuk melihat perubahan usia/);
  assert.match(html, /Pilih usia manusia/);
  assert.match(html, /age-journey\/age-20\.png/);
  assert.match(html, /age-journey\/age-74\.png/);
  assert.match(html, /age-journey\/female-age-20\.png/);
  assert.match(html, /age-journey\/female-age-74\.png/);
  assert.match(html, /Tampilkan karakter laki-laki/);
  assert.match(html, /Tampilkan karakter perempuan/);
  assert.match(html, /Freelancer/);
  assert.match(html, /Custom/);
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
  assert.match(html, /Download/);
  assert.match(html, /3 tema profesional/);
  assert.match(html, /Executive/);
  assert.match(html, /Bond Certificate/);
  assert.match(html, /Cobalt Report/);
  assert.doesNotMatch(html, /Midnight/);
  assert.match(html, /Investasi vs Tidak Berinvestasi/);
  assert.match(html, /Ringkasan asumsi/);
  assert.match(html, /Perjalanan karier/);
  assert.match(html, /tahun bekerja/);
  assert.match(html, /design-profession-logo/);
  assert.match(html, /DJPPR Kemenkeu/);
  assert.match(html, /ORI030T6/);
  assert.match(html, /Simulasi dimulai dari 30%/);
  assert.match(html, /Dari gaji bulanan awal/);
  assert.match(html, /Dari estimasi total penghasilan/);
  assert.match(html, /Tanpa investasi sampai pensiun/);
  assert.doesNotMatch(html, /RD Pasar Uang/);
  assert.match(html, /Rp(?:<!-- -->)?\s*[\d,.]+(?:<!-- -->)?\s*(?:Juta|Milyar|Triliun)/);
  assert.match(html, /Preview skenario akhir masa kerja/);
  assert.match(html, /Potensi tambahan dari investasi/);
  assert.doesNotMatch(html, /Daerah tempat tinggal dan bekerja/);
  assert.match(html, /purchasing\/antam-10g-cutout\.png/);
  assert.match(html, /purchasing\/avanza-cutout\.png/);
  assert.match(html, /purchasing\/rumah-cutout\.png/);
  assert.match(html, /purchasing\/ferrari-cutout\.png/);
  assert.match(html, /Toyota Avanza 1\.5 G CVT/);
  assert.match(html, /Ferrari/);
  assert.match(html, /purchase-journey/);
  assert.match(html, /gaji kotor/);
  assert.match(html, /Gaji bulanan awal/);
  assert.match(html, /gaji bulanan menuju aset/);
  assert.match(html, /purchase-arrow-motion/);
  assert.match(html, /Tanpa investasi/);
  assert.match(html, /Dengan investasi/);
  assert.match(html, /Aktifkan mode gelap/);
  assert.match(html, /<header class="site-header">[\s\S]*?class="theme-toggle"/);
  assert.doesNotMatch(html, /<section class="calculator-results"[^>]*>[\s\S]*?class="theme-toggle"/);
});

test("renders the sixth custom profession with user-controlled career inputs", async () => {
  const response = await request("/profesi/custom");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Jejak Gaji\s*(?:<!-- -->)?\s*Custom/);
  assert.match(html, /Atur jalur kerjamu/);
  assert.match(html, /Penghasilan per bulan/);
  assert.match(html, /Usia mulai bekerja/);
  assert.match(html, /Target pensiun/);
  assert.match(html, /Pembayaran per tahun/);
  assert.match(html, /input pengguna/);
  assert.doesNotMatch(html, /Benchmark profesi terisi otomatis/);
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
