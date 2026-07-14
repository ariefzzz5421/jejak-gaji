import Link from "next/link";
import { MarketTicker } from "./MarketTicker";

export function SiteHeader() {
  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Jejak Gaji — beranda">
          <span className="brand-mark">JG</span>
          <span>Jejak Gaji</span>
        </Link>
      </header>
      <MarketTicker />
    </>
  );
}
