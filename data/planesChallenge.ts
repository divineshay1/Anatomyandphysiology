import { Question } from "./types";

// World 2 — The Human Map: Body Planes Challenge.
// A multi-stage, data-driven activity layered on top of (not replacing) the
// existing "Planes & Sections" module. Stage 1 reuses real questions from
// that module by id, so answering them here updates the same mastery/weak
// tracking as playing that module directly.

export type PlaneId = "sagittal" | "midsagittal" | "frontal" | "transverse" | "oblique";

export const PLANE_LABELS: Record<PlaneId, string> = {
  sagittal: "Sagittal",
  midsagittal: "Midsagittal",
  frontal: "Frontal (coronal)",
  transverse: "Transverse",
  oblique: "Oblique",
};

// Stage 1 — Basic identification: real ids from data/modules.ts's "planes"
// module (module: "Planes & Sections"), one per plane type.
export const basicPlaneQuestionIds = ["p1", "p2", "p3", "p4", "p5"];

// Stage 2 — Visual identification: click the correct line on a body diagram.
export type VisualPlaneItem = {
  id: string;
  view: "front" | "side";
  candidates: PlaneId[];
  prompt: string;
  answer: PlaneId;
  explanation: string;
  xp: number;
};

export const visualPlaneItems: VisualPlaneItem[] = [
  {
    id: "bp-v-mid",
    view: "front",
    candidates: ["midsagittal", "sagittal"],
    prompt: "Click the line that divides the body into EQUAL left and right halves, exactly through the midline.",
    answer: "midsagittal",
    explanation: "Only a cut through the exact midline creates two equal halves — that's the midsagittal plane.",
    xp: 25,
  },
  {
    id: "bp-v-sag",
    view: "front",
    candidates: ["midsagittal", "sagittal"],
    prompt: "Click the line that divides the body into left and right portions that are NOT equal — off to one side.",
    answer: "sagittal",
    explanation: "A vertical cut anywhere other than the exact midline is a (para)sagittal plane — still left/right, just unequal.",
    xp: 25,
  },
  {
    id: "bp-v-trans",
    view: "front",
    candidates: ["transverse"],
    prompt: "Click the plane shown — the one separating superior (upper) from inferior (lower) portions.",
    answer: "transverse",
    explanation: "A horizontal cut separating upper from lower structures is a transverse (horizontal) plane.",
    xp: 25,
  },
  {
    id: "bp-v-obl",
    view: "front",
    candidates: ["oblique"],
    prompt: "Click the plane shown — the one that's neither perfectly vertical nor perfectly horizontal.",
    answer: "oblique",
    explanation: "Any angled cut that isn't sagittal, frontal, or transverse is classified as oblique.",
    xp: 25,
  },
  {
    id: "bp-v-front",
    view: "side",
    candidates: ["frontal"],
    prompt: "This is a side view. Click the plane that divides the body into anterior (front) and posterior (back) portions.",
    answer: "frontal",
    explanation: "Seen from the side, a vertical cut separating front from back is the frontal (coronal) plane.",
    xp: 25,
  },
];

// Stage 3 — Scenario-based, clinical-imaging framing.
const scenario = (id: string, question: string, options: string[], answer: number, explanation: string): Question => ({
  id,
  week: 0,
  module: "Planes & Sections",
  topic: "Planes",
  difficulty: "medium",
  questionType: "multiple-choice",
  question,
  options,
  answer,
  explanation,
  xp: 30,
  tags: ["planes-challenge", "scenario"],
});

export const scenarioPlaneItems: Question[] = [
  scenario(
    "bp-s1",
    "A radiologist wants one image comparing both kidneys side by side. Which plane should the scan use?",
    ["Frontal (coronal)", "Midsagittal", "Transverse", "Oblique"],
    0,
    "A frontal/coronal image shows the body from the front, capturing both left and right kidneys in one view."
  ),
  scenario(
    "bp-s2",
    "A surgeon needs a single CT slice showing the relationship between the stomach, spleen, and liver at the same vertical level. Which plane?",
    ["Transverse", "Sagittal", "Frontal", "Midsagittal"],
    0,
    "A horizontal (transverse) slice captures multiple organs that sit at the same superior-inferior level."
  ),
  scenario(
    "bp-s3",
    "An anatomy instructor cuts a model exactly down the midline to show that the left and right lungs are mirror images. Which plane?",
    ["Midsagittal", "Sagittal", "Transverse", "Frontal"],
    0,
    "An exact midline cut producing equal mirror-image halves is specifically the midsagittal plane."
  ),
  scenario(
    "bp-s4",
    "A physical therapy textbook shows a diagram cut at an angle across the shoulder to reveal the joint capsule from a non-standard direction. Which plane is this?",
    ["Oblique", "Transverse", "Frontal", "Sagittal"],
    0,
    "A cut that isn't vertical, horizontal, or at the midline — angled through the region of interest — is oblique."
  ),
];

// Stage 4 — Boss: a tougher mixed round. Passing (4/5) unlocks the
// "Body Plane Explorer" badge, matching the placeholder already shown on
// the Progress page's badge shelf.
export const bossPlaneItems: Question[] = [
  scenario(
    "bp-boss1",
    "BOSS: Which plane divides the body into unequal left and right portions?",
    ["Sagittal", "Midsagittal", "Frontal", "Transverse"],
    0,
    "Sagittal is the general term; midsagittal is the special case at the exact midline."
  ),
  scenario(
    "bp-boss2",
    "BOSS: An X-ray tech takes one image showing the chest from the front, lungs and heart both visible. Which plane?",
    ["Frontal (coronal)", "Transverse", "Sagittal", "Oblique"],
    0,
    "A front-facing view showing left and right structures together is a frontal (coronal) image."
  ),
  scenario(
    "bp-boss3",
    "BOSS: Which plane would a technician use to get one image showing both the superior and inferior lobes of a lung separated?",
    ["Frontal (coronal)", "Transverse", "Midsagittal", "Sagittal"],
    0,
    "Frontal images run top-to-bottom through the body, so superior and inferior structures both appear in the same image."
  ),
  scenario(
    "bp-boss4",
    "BOSS: A single horizontal slice through the abdomen at the level of the umbilicus uses which plane?",
    ["Transverse", "Frontal", "Sagittal", "Oblique"],
    0,
    "A horizontal slice at one level of the body is a transverse plane."
  ),
  scenario(
    "bp-boss5",
    "BOSS: Which plane is neither vertical nor horizontal, and is often used to image a joint at its natural angle?",
    ["Oblique", "Transverse", "Midsagittal", "Frontal"],
    0,
    "Oblique planes cut at an angle — useful for imaging structures that aren't aligned with the standard planes."
  ),
];

export const BOSS_PASS_THRESHOLD = 4;
export const BOSS_BADGE = "Body Plane Explorer";
