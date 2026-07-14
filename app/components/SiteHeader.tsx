"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MarketTicker } from "./MarketTicker";

export function SiteHeader() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("jejak-gaji-theme");
    const dark = storedTheme
      ? storedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    const frame = window.requestAnimationFrame(() => {
      setIsDark(dark);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.dataset.theme = nextDark ? "dark" : "light";
    window.localStorage.setItem("jejak-gaji-theme", nextDark ? "dark" : "light");
  };

  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Jejak Gaji — beranda">
          <span className="brand-mark">JG</span>
          <span>Jejak Gaji</span>
        </Link>
        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
          aria-pressed={isDark}
          title={isDark ? "Mode terang" : "Mode gelap"}
        >
          {isDark ? (
            <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" /></svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.5 15.2A8.4 8.4 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z" /></svg>
          )}
        </button>
      </header>
      <MarketTicker />
    </>
  );
}
