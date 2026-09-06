// Hand-authored pixel-art nurse + patient characters, matching the palette
// and proportions of the provided reference art (rounded head, flat scrub
// colors, simple outlines) without copying any specific image file — none
// of the reference images are cropped/licensable sprite assets, they're
// composite style-guide sheets. Decorative only: no game logic attached.

const INK = "#20242c";
const SKIN = "#f0c39a";
const HAIR = "#3a2a1f";
const SCRUB = "#2f9a9d";
const SCRUB_DARK = "#1c7274";
const BADGE = "#d9435a";
const SHOE = "#fdfbf4";

export function NurseSprite({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 16" shapeRendering="crispEdges" className={className} aria-hidden="true">
      {/* ponytail, drawn behind the head */}
      <rect x="7" y="1" width="2" height="4" fill={HAIR} />
      {/* hair */}
      <rect x="2" y="0" width="6" height="2" fill={HAIR} />
      <rect x="2" y="2" width="1" height="2" fill={HAIR} />
      <rect x="7" y="2" width="1" height="2" fill={HAIR} />
      {/* face */}
      <rect x="3" y="2" width="4" height="3" fill={SKIN} />
      <rect x="3" y="4" width="1" height="1" fill={INK} />
      <rect x="6" y="4" width="1" height="1" fill={INK} />
      {/* neck */}
      <rect x="4" y="5" width="2" height="1" fill={SKIN} />
      {/* scrub top + sleeves */}
      <rect x="1" y="6" width="8" height="5" fill={SCRUB} />
      <rect x="4" y="7" width="1" height="1" fill={BADGE} />
      {/* hands */}
      <rect x="1" y="10" width="1" height="1" fill={SKIN} />
      <rect x="8" y="10" width="1" height="1" fill={SKIN} />
      {/* waistband */}
      <rect x="2" y="11" width="6" height="2" fill={SCRUB} />
      {/* legs */}
      <rect x="2" y="13" width="2" height="2" fill={SCRUB_DARK} />
      <rect x="6" y="13" width="2" height="2" fill={SCRUB_DARK} />
      {/* shoes */}
      <rect x="2" y="15" width="2" height="1" fill={SHOE} />
      <rect x="6" y="15" width="2" height="1" fill={SHOE} />
    </svg>
  );
}

export function PatientBedScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 26" shapeRendering="crispEdges" className={className} aria-hidden="true">
      {/* bed legs */}
      <rect x="5" y="22" width="2" height="3" fill={INK} />
      <rect x="29" y="22" width="2" height="3" fill={INK} />
      {/* bed frame */}
      <rect x="3" y="7" width="3" height="15" fill="#c7cbdc" stroke={INK} strokeWidth="0.5" />
      <rect x="4" y="16" width="27" height="6" fill="#dfe2ec" stroke={INK} strokeWidth="0.5" />
      {/* blanket */}
      <rect x="14" y="13" width="17" height="7" rx="1" fill="#e4b73a" stroke={INK} strokeWidth="0.5" />
      {/* pillow */}
      <rect x="6" y="10" width="9" height="6" rx="1" fill="#fdfbf4" stroke={INK} strokeWidth="0.5" />
      {/* patient head + hair */}
      <circle cx="10" cy="11" r="3" fill={SKIN} stroke={INK} strokeWidth="0.5" />
      <rect x="7.5" y="8" width="5" height="2" fill={HAIR} />
      {/* gown collar peeking above blanket */}
      <rect x="12" y="13" width="6" height="2" fill="#f0e68c" />
      {/* monitor */}
      <rect x="36" y="9" width="1.5" height="12" fill="#9aa0b0" />
      <rect x="30" y="2" width="11" height="8" rx="1" fill="#1a2028" stroke={INK} strokeWidth="0.5" />
      <polyline points="31,7 33,7 34,3 35,9 36,5 37,7 40,7" fill="none" stroke="#4be3a0" strokeWidth="0.7" />
    </svg>
  );
}
