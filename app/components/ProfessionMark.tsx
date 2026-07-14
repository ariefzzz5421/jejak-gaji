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
      <span className="mark-icon" aria-hidden="true">{profession.icon}</span>
      <span className="mark-label">{profession.navName}</span>
    </div>
  );
}
