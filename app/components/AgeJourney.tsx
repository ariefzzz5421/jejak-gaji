"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

const ageStages = [
  { age: 20, phase: "Mulai bekerja", note: "Langkah pertama membangun pengalaman dan kebiasaan finansial." },
  { age: 30, phase: "Bangun fondasi", note: "Penghasilan dan tanggung jawab biasanya mulai bertumbuh bersama." },
  { age: 40, phase: "Masa produktif", note: "Waktu kerja masih panjang dan efek compounding semakin terasa." },
  { age: 50, phase: "Siapkan pensiun", note: "Fokus mulai bergeser dari mengejar hasil ke menjaga ketahanan aset." },
  { age: 60, phase: "Usia pensiun", note: "Penghasilan aktif berkurang dan tabungan mulai menopang kehidupan." },
  { age: 74, phase: "Harapan hidup", note: "Masa setelah pensiun juga perlu dibiayai dengan rencana yang matang." },
] as const;

const genders = ["male", "female"] as const;
type Gender = (typeof genders)[number];

function imageFor(gender: Gender, age: number) {
  return gender === "female"
    ? `/age-journey/female-age-${age}.png`
    : `/age-journey/age-${age}.png`;
}

function nearestStageIndex(age: number) {
  return ageStages.reduce((closest, stage, index) => {
    const currentDistance = Math.abs(ageStages[closest].age - age);
    const nextDistance = Math.abs(stage.age - age);
    return nextDistance < currentDistance ? index : closest;
  }, 0);
}

function stageWeights(age: number) {
  const lastIndex = ageStages.length - 1;
  const lowerIndex = Math.max(
    ageStages.findLastIndex((stage) => stage.age <= age),
    0,
  );
  const upperIndex = Math.min(lowerIndex + 1, lastIndex);
  const lowerAge = ageStages[lowerIndex].age;
  const upperAge = ageStages[upperIndex].age;
  const blend = upperAge === lowerAge ? 0 : (age - lowerAge) / (upperAge - lowerAge);

  return ageStages.map((_, index) => {
    if (lowerIndex === upperIndex && index === lowerIndex) return 1;
    if (index === lowerIndex) return 1 - blend;
    if (index === upperIndex) return blend;
    return 0;
  });
}

export function AgeJourney() {
  const [age, setAge] = useState(20);
  const [gender, setGender] = useState<Gender>("male");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const frameRef = useRef<number | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeIndex = nearestStageIndex(age);
  const activeStage = ageStages[activeIndex];
  const weights = stageWeights(age);
  const progress = ((age - 20) / (74 - 20)) * 100;
  const careerMessage = age < 60
    ? `${60 - age} tahun menuju estimasi pensiun`
    : age === 60
      ? "Titik estimasi pensiun"
      : `${age - 60} tahun setelah estimasi pensiun`;

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    if (transitionTimerRef.current !== null) clearTimeout(transitionTimerRef.current);
  }, []);

  const markTransition = (duration = 500) => {
    setIsTransitioning(true);
    if (transitionTimerRef.current !== null) clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = setTimeout(() => {
      setIsTransitioning(false);
      transitionTimerRef.current = null;
    }, duration);
  };

  const setAgeImmediately = (nextAge: number) => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    markTransition(420);
    setAge(nextAge);
  };

  const animateToAge = (targetAge: number) => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    const startAge = age;
    const distance = Math.abs(targetAge - startAge);
    const duration = Math.min(900, 380 + distance * 28);
    const startedAt = performance.now();
    markTransition(duration + 120);

    const tick = (now: number) => {
      const elapsed = Math.min((now - startedAt) / duration, 1);
      const eased = elapsed < 0.5
        ? 4 * elapsed * elapsed * elapsed
        : 1 - Math.pow(-2 * elapsed + 2, 3) / 2;
      setAge(Math.round(startAge + (targetAge - startAge) * eased));

      if (elapsed < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(tick);
  };

  const moveStage = (direction: -1 | 1) => {
    const nextStage = direction === 1
      ? ageStages.find((stage) => stage.age > age)
      : [...ageStages].reverse().find((stage) => stage.age < age);
    animateToAge(nextStage?.age ?? (direction === 1 ? 74 : 20));
  };

  return (
    <div className={`age-journey ${isTransitioning ? "is-transitioning" : ""}`} aria-label="Simulasi perubahan usia dari 20 hingga 74 tahun">
      <div className="age-gender-switch" role="group" aria-label="Pilih gender karakter">
        <button
          type="button"
          className={gender === "male" ? "active" : ""}
          aria-pressed={gender === "male"}
          aria-label="Tampilkan karakter laki-laki"
          title="Laki-laki"
          onClick={() => { markTransition(); setGender("male"); }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="15" r="5" /><path d="m13 11 7-7m-5 0h5v5" /></svg>
        </button>
        <button
          type="button"
          className={gender === "female" ? "active" : ""}
          aria-pressed={gender === "female"}
          aria-label="Tampilkan karakter perempuan"
          title="Perempuan"
          onClick={() => { markTransition(); setGender("female"); }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="5" /><path d="M12 13v8m-3-3h6" /></svg>
        </button>
      </div>

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
        {genders.flatMap((characterGender) => ageStages.map((stage, index) => {
          const stageOpacity = weights[index] * (gender === characterGender ? 1 : 0);
          return (
            <div
              key={`${characterGender}-${stage.age}`}
              className={`age-character-layer ${stageOpacity > 0.01 ? "visible" : ""}`}
              style={{
                opacity: stageOpacity,
                transform: `translateX(${(1 - weights[index]) * 8}px) scale(${0.985 + weights[index] * 0.015})`,
              }}
            >
              <Image
                className="age-character"
                src={imageFor(characterGender, stage.age)}
                alt=""
                width={832}
                height={1890}
                sizes="(max-width: 680px) 72vw, 360px"
                priority={characterGender === "male" && index === 0}
                unoptimized
              />
            </div>
          );
        }))}
      </div>

      <div className="age-controller">
        <div className="age-controller-head">
          <span>Geser untuk melihat perubahan usia</span>
          <b>{age} tahun</b>
        </div>
        <div className="age-slider-row">
          <button type="button" onClick={() => moveStage(-1)} disabled={age <= 20} aria-label="Lihat usia sebelumnya">
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
              onChange={(event) => setAgeImmediately(Number(event.target.value))}
            />
            <div className="age-marks" aria-hidden="true">
              {ageStages.map((stage) => <span key={stage.age}>{stage.age}</span>)}
            </div>
          </div>
          <button type="button" onClick={() => moveStage(1)} disabled={age >= 74} aria-label="Lihat usia berikutnya">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
