// Central asset registry — the single source of truth for every pixel-art
// asset the game can place into a scene (data/sceneAssets.ts) or a scene
// layer (components/scene/Scene.tsx).
//
// Every entry is either:
//   - a REAL asset (`src` points at a file actually in public/), cropped
//     directly from the user's provided reference images, or
//   - a PENDING slot (`src: null`) — a named, typed placeholder for an
//     asset category the reference material describes but no usable
//     file exists for yet. Pending slots render as an honest labeled
//     placeholder (see PendingAsset in components/scene/Scene.tsx) and
//     must never be swapped for invented/AI-generated art. Drop a real
//     file into public/ and set `src` here when one becomes available —
//     nothing else needs to change.
export type AssetCategory =
  | "nurse"
  | "patient"
  | "environment"
  | "furniture"
  | "equipment"
  | "monitor"
  | "organ"
  | "system"
  | "tool"
  | "role";

export type SceneAsset = {
  id: string;
  category: AssetCategory;
  label: string;
  src: string | null;
  width: number;
  height: number;
};

export const sceneAssets: SceneAsset[] = [
  // --- Nurse (the player character) ---
  // Real: cropped from "Option P1: Pixel Nurse (Pink Scrubs)", Character
  // Concept Sheet. The reference's customization map names several more
  // variants (scrub colors: purple/blue/teal/yellow/green/white lab coat;
  // hair: short dark/ponytail brown/afro/blonde bob) — those are real,
  // named parts of the asset system but no individual cropped file exists
  // for them yet, so they're listed as pending slots rather than guessed at.
  { id: "nurse-default", category: "nurse", label: "Nurse — pink scrubs", src: "/characters/nurse.png", width: 321, height: 230 },
  { id: "nurse-scrubs-purple", category: "nurse", label: "Nurse — purple scrubs", src: null, width: 321, height: 230 },
  { id: "nurse-scrubs-teal", category: "nurse", label: "Nurse — teal scrubs", src: null, width: 321, height: 230 },
  { id: "nurse-labcoat", category: "role", label: "Nurse practitioner — lab coat", src: null, width: 321, height: 230 },

  // --- Patient (population + condition variety) ---
  // Real: cropped from "Option P2: Pixel Patient & Monitor", same sheet —
  // patient and monitor were cropped as two separate layers so they can be
  // composed independently rather than as one fused photo.
  { id: "patient-default", category: "patient", label: "Patient — bedridden adult", src: "/characters/patient.png", width: 195, height: 230 },
  { id: "patient-pediatric", category: "patient", label: "Patient — pediatric", src: null, width: 195, height: 230 },
  { id: "patient-obstetric", category: "patient", label: "Patient — obstetric", src: null, width: 195, height: 230 },
  { id: "patient-older-adult", category: "patient", label: "Patient — older adult", src: null, width: 195, height: 230 },
  { id: "patient-ambulatory-cane", category: "patient", label: "Patient — ambulatory, cane", src: null, width: 195, height: 230 },
  { id: "patient-ambulatory-walker", category: "patient", label: "Patient — ambulatory, walker", src: null, width: 195, height: 230 },

  // --- Environment / furniture ---
  { id: "env-ward-bay", category: "environment", label: "Standard multi-bed ward", src: "/characters/ward-bay.png", width: 148, height: 106 },
  { id: "env-operating-room", category: "environment", label: "Operating room", src: null, width: 148, height: 106 },
  { id: "env-ambulance", category: "environment", label: "Ambulance / ER bay", src: null, width: 148, height: 106 },

  // --- Equipment / monitors ---
  { id: "equipment-monitor", category: "monitor", label: "Vital-signs monitor", src: "/characters/monitor.png", width: 136, height: 200 },
  { id: "tool-stethoscope", category: "tool", label: "Stethoscope", src: "/characters/stethoscope.png", width: 90, height: 67 },
  { id: "tool-bp-cuff", category: "tool", label: "Blood pressure cuff & gauge", src: null, width: 90, height: 67 },
  { id: "tool-pulse-ox", category: "tool", label: "Pulse oximeter", src: null, width: 90, height: 67 },
  { id: "equipment-iv-pump", category: "equipment", label: "IV pump", src: null, width: 90, height: 90 },
  { id: "equipment-medication-cart", category: "equipment", label: "Medication cart", src: null, width: 148, height: 106 },

  // --- Organs (real — the Organ & Biology Atlas) ---
  { id: "organ-heart", category: "organ", label: "Heart", src: "/organs/heart.png", width: 85, height: 85 },
  { id: "organ-lungs", category: "organ", label: "Lungs", src: "/organs/lungs.png", width: 85, height: 85 },
  { id: "organ-liver", category: "organ", label: "Liver", src: "/organs/liver.png", width: 85, height: 85 },
  { id: "organ-kidneys", category: "organ", label: "Kidneys", src: "/organs/kidneys.png", width: 85, height: 85 },
  { id: "organ-stomach", category: "organ", label: "Stomach", src: "/organs/stomach.png", width: 85, height: 85 },
  { id: "organ-brain", category: "organ", label: "Brain", src: "/organs/brain.png", width: 85, height: 85 },

  // --- Body systems (pending — named per the Curriculum Asset Atlas) ---
  { id: "system-skeletal", category: "system", label: "Skeletal system", src: null, width: 200, height: 300 },
  { id: "system-muscular", category: "system", label: "Muscular system", src: null, width: 200, height: 300 },
  { id: "system-integumentary", category: "system", label: "Integumentary system (skin cross-section)", src: null, width: 200, height: 300 },
  { id: "system-cell", category: "system", label: "Cell / organelle diagram", src: null, width: 150, height: 150 },
  { id: "system-tissue", category: "system", label: "Tissue sample (microscopy)", src: null, width: 150, height: 150 },
  { id: "equipment-microscope", category: "equipment", label: "Microscope", src: null, width: 90, height: 90 },
];

export function getAsset(id: string): SceneAsset {
  const asset = sceneAssets.find((a) => a.id === id);
  if (!asset) throw new Error(`Unknown scene asset id: ${id}`);
  return asset;
}
