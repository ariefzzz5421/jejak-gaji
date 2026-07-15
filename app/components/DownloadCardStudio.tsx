"use client";

import { useState } from "react";
import { compactRupiah } from "../format";

const designs = [
  { id: "editorial", name: "Editorial", number: "01" },
  { id: "split", name: "Split Signal", number: "02" },
  { id: "orbit", name: "Orbit", number: "03" },
  { id: "ledger", name: "Ledger", number: "04" },
  { id: "neon", name: "Neon Grid", number: "05" },
] as const;

type DesignId = (typeof designs)[number]["id"];

interface DownloadCardStudioProps {
  accent: string;
  cashSaved: number;
  invested: number;
  instrumentName: string;
  isDownloading: boolean;
  onDownloadingChange: (value: boolean) => void;
  professionSlug: string;
  savingRate: number;
  workYears: number;
}

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

const drawWrappedValue = (
  context: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  maxWidth: number,
  color: string,
  align: CanvasTextAlign = "left",
) => {
  context.textAlign = align;
  context.fillStyle = color;
  let size = 72;
  do {
    context.font = `700 ${size}px Georgia, serif`;
    size -= 2;
  } while (context.measureText(value).width > maxWidth && size > 38);
  context.fillText(value, x, y);
  context.textAlign = "left";
};

export function DownloadCardStudio({
  accent,
  cashSaved,
  invested,
  instrumentName,
  isDownloading,
  onDownloadingChange,
  professionSlug,
  savingRate,
  workYears,
}: DownloadCardStudioProps) {
  const [designId, setDesignId] = useState<DesignId>("editorial");
  const cashLabel = compactRupiah(cashSaved);
  const investedLabel = compactRupiah(invested);
  const growthLabel = compactRupiah(Math.max(invested - cashSaved, 0));

  const downloadCard = async () => {
    onDownloadingChange(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1200;
      const context = canvas.getContext("2d");
      if (!context) return;

      const dark = "#101713";
      const cream = "#f6efe2";
      const orange = "#ea6b35";
      const mint = "#8dd9bb";

      const drawHeader = (foreground: string, secondary: string) => {
        context.fillStyle = foreground;
        context.font = "800 25px Segoe UI, Arial";
        context.letterSpacing = "4px";
        context.fillText("INVESTASI VS TIDAK BERINVESTASI", 72, 88);
        context.fillStyle = secondary;
        context.font = "500 20px Segoe UI, Arial";
        context.letterSpacing = "1px";
        context.fillText(`${savingRate}% penghasilan · ${workYears} tahun`, 72, 125);
      };

      const drawFooter = (foreground: string, secondary: string) => {
        context.fillStyle = secondary;
        context.font = "500 17px Segoe UI, Arial";
        context.letterSpacing = "1px";
        context.fillText("SIMULASI EDUKASI · BUKAN JANJI KEUNTUNGAN", 72, 1128);
        context.fillStyle = foreground;
        context.font = "800 20px Segoe UI, Arial";
        context.textAlign = "right";
        context.fillText("JEJAK GAJI · 2026", 1128, 1128);
        context.textAlign = "left";
      };

      if (designId === "editorial") {
        context.fillStyle = cream;
        context.fillRect(0, 0, 1200, 1200);
        context.fillStyle = dark;
        context.fillRect(0, 0, 1200, 190);
        drawHeader(cream, "rgba(246,239,226,.65)");
        context.strokeStyle = "rgba(16,23,19,.13)";
        for (let x = 0; x <= 1200; x += 60) {
          context.beginPath(); context.moveTo(x, 190); context.lineTo(x, 1200); context.stroke();
        }
        for (let y = 190; y <= 1200; y += 60) {
          context.beginPath(); context.moveTo(0, y); context.lineTo(1200, y); context.stroke();
        }
        context.fillStyle = "#fffdf8";
        roundedRect(context, 70, 265, 1060, 300, 30); context.fill();
        context.fillStyle = accent;
        roundedRect(context, 70, 600, 1060, 350, 30); context.fill();
        context.fillStyle = "#6c695f"; context.font = "700 22px Segoe UI, Arial"; context.fillText("TANPA INVESTASI", 115, 335);
        drawWrappedValue(context, cashLabel, 115, 465, 920, dark);
        context.fillStyle = "rgba(255,255,255,.72)"; context.font = "700 22px Segoe UI, Arial"; context.fillText(`DENGAN ${instrumentName.toUpperCase()}`, 115, 675);
        drawWrappedValue(context, investedLabel, 115, 810, 920, "#fffdf8");
        context.fillStyle = "rgba(255,255,255,.72)"; context.font = "500 22px Segoe UI, Arial"; context.fillText(`Potensi tambahan ${growthLabel}`, 115, 885);
        drawFooter(dark, "#706b61");
      } else if (designId === "split") {
        context.fillStyle = cream; context.fillRect(0, 0, 1200, 570);
        context.fillStyle = orange; context.fillRect(0, 570, 1200, 60);
        context.fillStyle = dark; context.fillRect(0, 630, 1200, 570);
        context.fillStyle = dark; context.font = "800 24px Segoe UI, Arial"; context.fillText("TANPA INVESTASI", 70, 90);
        context.fillStyle = "#6c695f"; context.font = "500 19px Segoe UI, Arial"; context.fillText("Hanya disimpan", 70, 140);
        drawWrappedValue(context, cashLabel, 70, 395, 1060, dark);
        context.fillStyle = cream; context.font = "800 24px Segoe UI, Arial"; context.fillText(`DENGAN ${instrumentName.toUpperCase()}`, 70, 720);
        context.fillStyle = "rgba(246,239,226,.62)"; context.font = "500 19px Segoe UI, Arial"; context.fillText("Setoran dan imbal hasil", 70, 770);
        drawWrappedValue(context, investedLabel, 70, 1020, 1060, cream);
        context.fillStyle = cream; context.font = "800 20px Segoe UI, Arial"; context.textAlign = "right"; context.fillText("JEJAK GAJI · 2026", 1130, 1145); context.textAlign = "left";
        context.fillStyle = dark; context.font = "800 24px Segoe UI, Arial"; context.textAlign = "center"; context.fillText("VS", 600, 608); context.textAlign = "left";
      } else if (designId === "orbit") {
        context.fillStyle = "#e6ddd0"; context.fillRect(0, 0, 1200, 1200);
        context.strokeStyle = "rgba(16,23,19,.12)"; context.lineWidth = 2;
        [190, 290, 390, 490].forEach((radius) => { context.beginPath(); context.arc(600, 620, radius, 0, Math.PI * 2); context.stroke(); });
        context.fillStyle = dark; roundedRect(context, 330, 390, 540, 460, 270); context.fill();
        context.fillStyle = orange; context.beginPath(); context.arc(600, 620, 210, -Math.PI / 2, Math.PI * .22); context.lineTo(600, 620); context.fill();
        context.fillStyle = cream; context.beginPath(); context.arc(600, 620, 145, 0, Math.PI * 2); context.fill();
        context.fillStyle = dark; context.font = "800 22px Segoe UI, Arial"; context.textAlign = "center"; context.fillText("INVESTASI VS", 600, 585); context.fillText("TIDAK BERINVESTASI", 600, 620); context.textAlign = "left";
        context.fillStyle = dark; context.font = "700 20px Segoe UI, Arial"; context.fillText("TANPA INVESTASI", 72, 128);
        drawWrappedValue(context, cashLabel, 72, 215, 470, dark);
        context.fillStyle = accent; context.font = "700 20px Segoe UI, Arial"; context.textAlign = "right"; context.fillText(`DENGAN ${instrumentName.toUpperCase()}`, 1128, 995);
        drawWrappedValue(context, investedLabel, 1128, 1080, 500, accent, "right");
        drawFooter(dark, "#706b61");
      } else if (designId === "ledger") {
        context.fillStyle = "#f8f5ec"; context.fillRect(0, 0, 1200, 1200);
        context.strokeStyle = "rgba(28,58,46,.13)";
        for (let y = 70; y < 1200; y += 48) { context.beginPath(); context.moveTo(0, y); context.lineTo(1200, y); context.stroke(); }
        context.fillStyle = accent; context.fillRect(54, 0, 12, 1200);
        drawHeader(dark, "#706b61");
        context.fillStyle = dark; context.font = "800 120px Georgia, serif"; context.fillText("01", 72, 420);
        context.font = "700 22px Segoe UI, Arial"; context.fillText("TANPA INVESTASI", 280, 345);
        drawWrappedValue(context, cashLabel, 280, 435, 820, dark);
        context.fillStyle = accent; context.font = "800 120px Georgia, serif"; context.fillText("02", 72, 755);
        context.font = "700 22px Segoe UI, Arial"; context.fillText(`DENGAN ${instrumentName.toUpperCase()}`, 280, 680);
        drawWrappedValue(context, investedLabel, 280, 770, 820, accent);
        context.fillStyle = dark; roundedRect(context, 72, 900, 1056, 118, 14); context.fill();
        context.fillStyle = cream; context.font = "700 23px Segoe UI, Arial"; context.fillText(`SELISIH  +${growthLabel}`, 112, 972);
        drawFooter(dark, "#706b61");
      } else {
        context.fillStyle = "#07100d"; context.fillRect(0, 0, 1200, 1200);
        context.strokeStyle = "rgba(91,244,212,.1)";
        for (let p = 0; p <= 1200; p += 60) {
          context.beginPath(); context.moveTo(p, 0); context.lineTo(p, 1200); context.stroke();
          context.beginPath(); context.moveTo(0, p); context.lineTo(1200, p); context.stroke();
        }
        context.shadowBlur = 28; context.shadowColor = "rgba(91,244,212,.32)";
        context.strokeStyle = mint; context.lineWidth = 3; roundedRect(context, 68, 195, 1064, 330, 28); context.stroke();
        context.shadowColor = "rgba(234,107,53,.35)"; context.strokeStyle = orange; roundedRect(context, 68, 570, 1064, 370, 28); context.stroke();
        context.shadowBlur = 0; drawHeader("#f3f4ec", "rgba(243,244,236,.55)");
        context.fillStyle = mint; context.font = "700 22px Segoe UI, Arial"; context.fillText("TANPA INVESTASI", 115, 270);
        drawWrappedValue(context, cashLabel, 115, 410, 920, "#f3f4ec");
        context.fillStyle = orange; context.font = "700 22px Segoe UI, Arial"; context.fillText(`DENGAN ${instrumentName.toUpperCase()}`, 115, 650);
        drawWrappedValue(context, investedLabel, 115, 795, 920, "#f3f4ec");
        context.fillStyle = "rgba(243,244,236,.65)"; context.font = "500 22px Segoe UI, Arial"; context.fillText(`+${growthLabel} dari compounding`, 115, 865);
        drawFooter("#f3f4ec", "rgba(243,244,236,.5)");
      }

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
          <span>5 desain kartu</span>
          <strong>Pilih preview sebelum download</strong>
        </div>
        <small>PNG hanya memuat perbandingan investasi.</small>
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
              <small>Tanpa investasi</small>
              <b>{cashLabel}</b>
              <em>VS</em>
              <small>Dengan investasi</small>
              <b>{investedLabel}</b>
            </span>
            <strong>{design.name}</strong>
          </button>
        ))}
      </div>

      <button className="download-summary" type="button" onClick={downloadCard} disabled={isDownloading}>
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 20h14" /></svg>
        {isDownloading ? "Menyiapkan PNG..." : `Download desain ${designs.find((design) => design.id === designId)?.name}`}
      </button>
    </div>
  );
}
