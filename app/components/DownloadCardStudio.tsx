"use client";

import { useState } from "react";
import { compactRupiah, percentage, rupiah } from "../format";

const designs = [
  { id: "executive", name: "Executive", number: "01" },
  { id: "bond", name: "Bond Certificate", number: "02" },
  { id: "midnight", name: "Midnight", number: "03" },
] as const;

type DesignId = (typeof designs)[number]["id"];

interface DownloadCardStudioProps {
  accent: string;
  annualPayments: number;
  benchmarkLabel: string;
  benchmarkYear: number;
  cashSaved: number;
  invested: number;
  instrumentName: string;
  instrumentShort: string;
  instrumentSource: string;
  isDownloading: boolean;
  monthlySalary: number;
  netYield: number;
  onDownloadingChange: (value: boolean) => void;
  professionName: string;
  professionSlug: string;
  salaryGrowth: number;
  savingRate: number;
  workYears: number;
}

type CardPalette = {
  accent: string;
  background: string;
  ink: string;
  line: string;
  muted: string;
  surface: string;
};

const roundedRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
};

const drawFitText = (
  context: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  maxWidth: number,
  maxSize: number,
  minSize: number,
  color: string,
  family = "Georgia, serif",
  weight = 700,
) => {
  context.fillStyle = color;
  let size = maxSize;
  do {
    context.font = `${weight} ${size}px ${family}`;
    size -= 2;
  } while (context.measureText(value).width > maxWidth && size > minSize);
  context.fillText(value, x, y);
};

export function DownloadCardStudio({
  accent,
  annualPayments,
  benchmarkLabel,
  benchmarkYear,
  cashSaved,
  invested,
  instrumentName,
  instrumentShort,
  instrumentSource,
  isDownloading,
  monthlySalary,
  netYield,
  onDownloadingChange,
  professionName,
  professionSlug,
  salaryGrowth,
  savingRate,
  workYears,
}: DownloadCardStudioProps) {
  const [designId, setDesignId] = useState<DesignId>("executive");
  const cashLabel = compactRupiah(cashSaved);
  const investedLabel = compactRupiah(invested);
  const growthLabel = compactRupiah(Math.max(invested - cashSaved, 0));

  const downloadCard = async () => {
    onDownloadingChange(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1400;
      const context = canvas.getContext("2d");
      if (!context) return;

      const palettes: Record<DesignId, CardPalette> = {
        executive: {
          background: "#f4efe4",
          surface: "#fffaf1",
          ink: "#10251c",
          muted: "#6f7168",
          accent,
          line: "rgba(16,37,28,.16)",
        },
        bond: {
          background: "#0b2239",
          surface: "#102e49",
          ink: "#f7edda",
          muted: "#b6c1c8",
          accent: "#d5ad62",
          line: "rgba(213,173,98,.34)",
        },
        midnight: {
          background: "#07100d",
          surface: "#101a17",
          ink: "#eef5ec",
          muted: "#93a39c",
          accent: "#72e4bf",
          line: "rgba(114,228,191,.24)",
        },
      };
      const palette = palettes[designId];

      context.fillStyle = palette.background;
      context.fillRect(0, 0, canvas.width, canvas.height);

      if (designId === "executive") {
        context.fillStyle = palette.ink;
        context.fillRect(0, 0, 1200, 28);
        context.fillStyle = palette.accent;
        context.fillRect(72, 0, 260, 28);
      } else if (designId === "bond") {
        context.strokeStyle = palette.line;
        context.lineWidth = 2;
        context.strokeRect(35, 35, 1130, 1330);
        context.strokeRect(50, 50, 1100, 1300);
        context.beginPath();
        context.arc(1050, 180, 170, 0, Math.PI * 2);
        context.stroke();
      } else {
        context.strokeStyle = "rgba(114,228,191,.07)";
        for (let position = 0; position <= 1400; position += 56) {
          context.beginPath(); context.moveTo(position, 0); context.lineTo(position, 1400); context.stroke();
          context.beginPath(); context.moveTo(0, position); context.lineTo(1200, position); context.stroke();
        }
        context.fillStyle = "#eb6a36";
        context.fillRect(72, 122, 12, 1160);
      }

      context.fillStyle = palette.accent;
      context.font = "800 20px Segoe UI, Arial";
      context.letterSpacing = "4px";
      context.fillText("INVESTASI VS TIDAK BERINVESTASI", 84, 105);
      context.letterSpacing = "0px";

      drawFitText(context, professionName, 84, 190, 900, 62, 38, palette.ink);
      context.fillStyle = palette.muted;
      context.font = "600 21px Segoe UI, Arial";
      context.fillText(`${benchmarkLabel} · acuan ${benchmarkYear}`, 84, 235);
      context.font = "500 20px Segoe UI, Arial";
      context.fillText(`Penghasilan awal ${rupiah.format(monthlySalary)} per bulan`, 84, 275);

      context.fillStyle = palette.surface;
      roundedRect(context, 72, 325, 1056, 175, 24);
      context.fill();
      context.strokeStyle = palette.line;
      context.stroke();

      const assumptions = [
        ["DISISIHKAN", `${savingRate}%`],
        ["KENAIKAN GAJI", `${salaryGrowth}% / tahun`],
        ["PEMBAYARAN", `${annualPayments}× / tahun`],
        ["MASA KERJA", `${workYears} tahun`],
      ];
      assumptions.forEach(([label, value], index) => {
        const x = 105 + index * 258;
        context.fillStyle = palette.muted;
        context.font = "700 15px Segoe UI, Arial";
        context.fillText(label, x, 385);
        context.fillStyle = palette.ink;
        context.font = "700 26px Georgia, serif";
        context.fillText(value, x, 440);
      });

      const drawScenario = (x: number, label: string, value: string, highlighted: boolean) => {
        context.fillStyle = highlighted ? palette.accent : palette.surface;
        roundedRect(context, x, 550, 505, 360, 28);
        context.fill();
        context.strokeStyle = palette.line;
        context.stroke();
        const foreground = highlighted && designId === "executive" ? "#fffaf1" : palette.ink;
        const secondary = highlighted && designId === "executive" ? "rgba(255,250,241,.72)" : palette.muted;
        context.fillStyle = secondary;
        context.font = "800 18px Segoe UI, Arial";
        context.fillText(label, x + 38, 625);
        drawFitText(context, value, x + 38, 755, 430, 55, 32, foreground);
        context.fillStyle = secondary;
        context.font = "500 18px Segoe UI, Arial";
        context.fillText(highlighted ? `Yield neto ${percentage.format(netYield)}% / tahun` : "Setoran tanpa imbal hasil", x + 38, 825);
        context.fillStyle = highlighted ? foreground : palette.accent;
        context.fillRect(x + 38, 860, highlighted ? 425 : 245, 7);
      };

      drawScenario(72, "TANPA INVESTASI", cashLabel, false);
      drawScenario(623, `DENGAN ${instrumentShort}`, investedLabel, true);

      context.fillStyle = palette.surface;
      roundedRect(context, 72, 955, 1056, 160, 24);
      context.fill();
      context.strokeStyle = palette.line;
      context.stroke();
      context.fillStyle = palette.muted;
      context.font = "700 17px Segoe UI, Arial";
      context.fillText("POTENSI TAMBAHAN DARI COMPOUNDING", 108, 1015);
      drawFitText(context, `+${growthLabel}`, 108, 1080, 900, 48, 30, palette.accent);

      context.fillStyle = palette.muted;
      context.font = "600 17px Segoe UI, Arial";
      context.fillText(`${instrumentName} · ${instrumentShort}`, 84, 1210);
      context.font = "500 15px Segoe UI, Arial";
      context.fillText(`Sumber instrumen: ${instrumentSource}`, 84, 1245);
      context.fillText("Simulasi edukasi berdasarkan asumsi pengguna. Bukan janji keuntungan.", 84, 1280);
      context.fillStyle = palette.ink;
      context.font = "800 18px Segoe UI, Arial";
      context.textAlign = "right";
      context.fillText("JEJAK GAJI · 2026", 1116, 1325);
      context.textAlign = "left";

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `jejak-gaji-${professionSlug}-${designId}-2026.png`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } finally {
      onDownloadingChange(false);
    }
  };

  return (
    <div className="download-card-studio">
      <div className="download-studio-heading">
        <div>
          <span>3 tema profesional</span>
          <strong>Pilih desain ringkasan</strong>
        </div>
        <small>Kartu memuat profesi, asumsi, perbandingan, dan sumber Obligasi Negara.</small>
      </div>

      <div className="download-design-grid" role="radiogroup" aria-label="Pilih desain kartu download">
        {designs.map((design) => (
          <button
            key={design.id}
            className={`download-design-option theme-${design.id} ${designId === design.id ? "active" : ""}`}
            type="button"
            role="radio"
            aria-checked={designId === design.id}
            onClick={() => setDesignId(design.id)}
          >
            <span className="design-card-mini">
              <i>{design.number}</i>
              <small>{professionName}</small>
              <strong>Investasi vs Tidak Berinvestasi</strong>
              <em>{savingRate}% disisihkan · {workYears} tahun</em>
              <span className="design-mini-values"><b>{cashLabel}</b><b>{investedLabel}</b></span>
              <u>{instrumentShort} · DJPPR Kemenkeu</u>
            </span>
            <strong>{design.name}</strong>
          </button>
        ))}
      </div>

      <button className="download-summary" type="button" onClick={downloadCard} disabled={isDownloading}>
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 20h14" /></svg>
        {isDownloading ? "Menyiapkan PNG..." : `Download ${designs.find((design) => design.id === designId)?.name}`}
      </button>
    </div>
  );
}
