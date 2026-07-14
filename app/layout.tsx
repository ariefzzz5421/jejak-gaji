import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "jejak-gaji.local";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const siteUrl = new URL(`${protocol}://${host}`);
  const imageUrl = new URL("/og.png", siteUrl).toString();

  return {
    metadataBase: siteUrl,
    title: {
      default: "Jejak Gaji — Estimasi Penghasilan Seumur Hidup",
      template: "%s · Jejak Gaji",
    },
    description:
      "Kalkulator estimasi penghasilan seumur hidup untuk Guru, Polisi, TNI, pekerja UMK/UMP, dan Freelancer Indonesia berdasarkan data 2026.",
    openGraph: {
      title: "Jejak Gaji — Seumur hidup bekerja, terkumpul berapa?",
      description: "Kalkulator karier Indonesia berdasarkan data 2026.",
      type: "website",
      locale: "id_ID",
      url: siteUrl,
      images: [{ url: imageUrl, width: 1732, height: 908, alt: "Jejak Gaji — kalkulator karier Indonesia" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Jejak Gaji",
      description: "Seumur hidup bekerja, terkumpul berapa?",
      images: [imageUrl],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
