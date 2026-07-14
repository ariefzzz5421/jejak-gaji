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
  assert.match(html, /BI Rate · acuan SBN/);
  assert.match(html, /USD \/ IDR/);
  assert.match(html, /Antam 1 gram/);
  assert.match(html, /IHSG Composite/);
  assert.doesNotMatch(html, /class="nav-links"/);
  assert.doesNotMatch(html, /class="header-cta"/);
});

test("renders the separated freelance calculator and real asset images", async () => {
  const response = await request("/profesi/freelance");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Langkah 2 dari 2/);
  assert.match(html, /Jejak Gaji\s*(?:<!-- -->)?\s*Freelancer/);
  assert.match(html, /Pendapatan tidak tetap tetap bisa punya arah/);
  assert.match(html, /antam-10g\.jpg/);
  assert.match(html, /avanza\.png/);
  assert.match(html, /rumah-600-juta\.png/);
  assert.match(html, /Toyota Avanza 1\.5 G CVT/);
});

test("market API always returns usable values", async () => {
  const response = await request("/api/market-data", "application/json");
  assert.equal(response.status, 200);
  const data = await response.json();

  for (const key of ["biRate", "usdIdr", "antam1g", "ihsg"]) {
    assert.equal(typeof data.metrics[key].value, "number");
    assert.ok(data.metrics[key].value > 0);
    assert.equal(typeof data.metrics[key].source, "string");
  }
});
