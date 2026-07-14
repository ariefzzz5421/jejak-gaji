import Link from "next/link";
import { professionList } from "../data";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Jejak Gaji — beranda">
        <span className="brand-mark">JG</span>
        <span>Jejak Gaji</span>
      </Link>
      <nav className="nav-links" aria-label="Profesi">
        {professionList.map((profession) => (
          <Link key={profession.slug} href={`/profesi/${profession.slug}`}>
            {profession.navName}
          </Link>
        ))}
      </nav>
      <Link href="/profesi/upah-minimum" className="header-cta">
        Mulai hitung <span aria-hidden="true">↗</span>
      </Link>
    </header>
  );
}
