"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";

const ageStages = [
  { age: 20, image: "/age-journey/age-20.png", phase: "Mulai bekerja", note: "Langkah pertama membangun pengalaman dan kebiasaan finansial." },
  { age: 30, image: "/age-journey/age-30.png", phase: "Bangun fondasi", note: "Penghasilan dan tanggung jawab biasanya mulai bertumbuh bersama." },
  { age: 40, image: "/age-journey/age-40.png", phase: "Masa produktif", note: "Waktu kerja masih panjang dan efek compounding semakin terasa." },
  { age: 50, image: "/age-journey/age-50.png", phase: "Siapkan pensiun", note: "Fokus mulai bergeser dari mengejar hasil ke menjaga ketahanan aset." },
  { age: 60, image: "/age-journey/age-60.png", phase: "Usia pensiun", note: "Penghasilan aktif berkurang dan tabungan mulai menopang kehidupan." },
  { age: 74, image: "/age-journey/age-74.png", phase: "Harapan hidup", note: "Masa setelah pensiun juga perlu dibiayai dengan rencana yang matang." },
] as const;

function nearestStageIndex(age: number) {
  return ageStages.reduce((closest, stage, index) => {
    const currentDistance = Math.abs(ageStages[closest].age - age);
    const nextDistance = Math.abs(stage.age - age);
    return nextDistance < currentDistance ? index : closest;
  }, 0);
}

export function AgeJourney() {
  const [age, setAge] = useState(20);
  const activeIndex = nearestStageIndex(age);
  const activeStage = ageStages[activeIndex];
  const progress = ((age - 20) / (74 - 20)) * 100;
  const careerMessage = age < 60
    ? `${60 - age} tahun menuju estimasi pensiun`
    : age === 60
      ? "Titik estimasi pensiun"
      : `${age - 60} tahun setelah estimasi pensiun`;

  const moveStage = (direction: -1 | 1) => {
    const nextIndex = Math.min(Math.max(activeIndex + direction, 0), ageStages.length - 1);
    setAge(ageStages[nextIndex].age);
  };

  return (
    <div className="age-journey" aria-label="Simulasi perubahan usia dari 20 hingga 74 tahun">
      <div className="age-journey-copy" aria-live="polite">
        <span className="age-journey-kicker">Perjalanan hidup</span>
        <div className="age-number"><strong>{age}</strong><span>tahun</span></div>
        <p className="age-phase">{activeStage.phase}</p>
        <p className="age-note">{activeStage.note}</p>
        <span className="age-career-message">{careerMessage}</span>
      </div>

      <div className="age-character-stage" aria-hidden="true">
        <span className="age-orbit orbit-one" />
        <span className="age-orbit orbit-two" />
        <span className="age-character-shadow" />
        {ageStages.map((stage, index) => (
          <Image
            key={stage.age}
            className={`age-character ${index === activeIndex ? "active" : ""}`}
            src={stage.image}
            alt=""
            width={832}
            height={1890}
            sizes="(max-width: 680px) 70vw, 330px"
            priority={index === 0}
            unoptimized
          />
        ))}
      </div>

      <div className="age-controller">
        <div className="age-controller-head">
          <span>Geser untuk melihat perubahan usia</span>
          <b>{activeStage.age}+</b>
        </div>
        <div className="age-slider-row">
          <button type="button" onClick={() => moveStage(-1)} disabled={activeIndex === 0} aria-label="Lihat usia sebelumnya">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <div className="age-range-wrap" style={{ "--age-progress": `${progress}%` } as CSSProperties}>
            <input
              type="range"
              min="20"
              max="74"
              step="1"
              value={age}
              aria-label="Pilih usia manusia"
              onChange={(event) => setAge(Number(event.target.value))}
            />
            <div className="age-marks" aria-hidden="true">
              {ageStages.map((stage) => <span key={stage.age}>{stage.age}</span>)}
            </div>
          </div>
          <button type="button" onClick={() => moveStage(1)} disabled={activeIndex === ageStages.length - 1} aria-label="Lihat usia berikutnya">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
