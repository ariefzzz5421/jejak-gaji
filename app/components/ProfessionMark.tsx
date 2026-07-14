import Image from "next/image";
import type { Profession } from "../data";

export function ProfessionMark({ profession, large = false }: { profession: Profession; large?: boolean }) {
  return (
    <div
      className={`profession-mark ${large ? "profession-mark-large" : ""}`}
      style={{
        "--mark-accent": profession.accent,
        "--mark-soft": profession.softAccent,
      } as React.CSSProperties}
      aria-label={`Lambang ${profession.name}`}
    >
      <span className="mark-orbit" aria-hidden="true" />
      <Image
        className="mark-image"
        src={profession.image}
        alt=""
        width={1024}
        height={1024}
        sizes={large ? "310px" : "132px"}
        priority={large}
        unoptimized
      />
      <span className="mark-label">{profession.navName}</span>
    </div>
  );
}
