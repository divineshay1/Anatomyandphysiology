import { Question } from "./types";

// World 2 — The Human Map: Major Body Cavities Challenge.
// Mirrors the Body Planes Challenge's 4-stage shape (basic → visual →
// scenario → boss), layered on top of the real "Body Cavities" module
// (data/modules.ts, ids c1-c14) the same way Planes' stage 1 reuses real
// planes-module ids.

export type CavityId =
  | "cranial"
  | "vertebral"
  | "thoracic"
  | "abdominal"
  | "pelvic"
  | "leftPleural"
  | "rightPleural"
  | "mediastinum"
  | "pericardial";

export const CAVITY_LABELS: Record<CavityId, string> = {
  cranial: "Cranial cavity",
  vertebral: "Vertebral (spinal) cavity",
  thoracic: "Thoracic cavity",
  abdominal: "Abdominal cavity",
  pelvic: "Pelvic cavity",
  leftPleural: "Left pleural cavity",
  rightPleural: "Right pleural cavity",
  mediastinum: "Mediastinum",
  pericardial: "Pericardial cavity",
};

// Stage 1 — Basic identification: real ids from the "cavities" module,
// one per major cavity, including the abdominopelvic compound term.
export const basicCavityQuestionIds = ["c1", "c2", "c3", "c4", "c5", "c11"];

// Stage 2 — Visual identification: click the correct region on a diagram.
export type VisualCavityItem = {
  id: string;
  diagram: "front" | "side" | "thoraxCrossSection";
  candidates: CavityId[];
  prompt: string;
  answer: CavityId;
  explanation: string;
  xp: number;
};

export const visualCavityItems: VisualCavityItem[] = [
  {
    id: "bc-v-cranial",
    diagram: "front",
    candidates: ["cranial", "thoracic", "abdominal", "pelvic"],
    prompt: "Click the cavity that houses the brain.",
    answer: "cranial",
    explanation: "The cranial cavity, inside the skull, protects the brain.",
    xp: 25,
  },
  {
    id: "bc-v-thoracic",
    diagram: "front",
    candidates: ["cranial", "thoracic", "abdominal", "pelvic"],
    prompt: "Click the cavity that houses the heart and lungs.",
    answer: "thoracic",
    explanation: "The thoracic cavity, above the diaphragm, contains the heart and lungs.",
    xp: 25,
  },
  {
    id: "bc-v-abdominal",
    diagram: "front",
    candidates: ["cranial", "thoracic", "abdominal", "pelvic"],
    prompt: "Click the cavity that houses the stomach, liver, and spleen.",
    answer: "abdominal",
    explanation: "The abdominal cavity, below the diaphragm, contains the stomach, liver, and spleen.",
    xp: 25,
  },
  {
    id: "bc-v-pelvic",
    diagram: "front",
    candidates: ["cranial", "thoracic", "abdominal", "pelvic"],
    prompt: "Click the cavity that houses the urinary bladder and reproductive organs.",
    answer: "pelvic",
    explanation: "The pelvic cavity, at the base of the trunk, contains the bladder and reproductive organs.",
    xp: 25,
  },
  {
    id: "bc-v-vertebral",
    diagram: "side",
    candidates: ["vertebral"],
    prompt: "This is a side view. Click the canal running down the back that houses the spinal cord.",
    answer: "vertebral",
    explanation:
      "The vertebral (spinal) cavity runs inside the vertebral column, along the back of the trunk — that's why it doesn't show up in a front view.",
    xp: 30,
  },
  {
    id: "bc-v-leftpleural",
    diagram: "thoraxCrossSection",
    candidates: ["leftPleural", "rightPleural", "mediastinum"],
    prompt: "This is a cross-section through the chest, viewed from below (the patient's left is on your right — the standard imaging convention). Click the space surrounding the patient's LEFT lung.",
    answer: "leftPleural",
    explanation: "Each lung has its own pleural cavity — the patient's left lung sits in the left pleural cavity.",
    xp: 30,
  },
  {
    id: "bc-v-mediastinum",
    diagram: "thoraxCrossSection",
    candidates: ["leftPleural", "rightPleural", "mediastinum"],
    prompt: "Click the central compartment between the two pleural cavities that contains the heart, trachea, and esophagus.",
    answer: "mediastinum",
    explanation: "The mediastinum is the central thoracic compartment between the lungs.",
    xp: 30,
  },
  {
    id: "bc-v-pericardial",
    diagram: "thoraxCrossSection",
    candidates: ["mediastinum", "pericardial"],
    prompt: "Within the mediastinum, click the small space immediately surrounding the heart itself.",
    answer: "pericardial",
    explanation: "The pericardial cavity is the space directly around the heart, nested inside the mediastinum.",
    xp: 30,
  },
];

// Stage 3 — Scenario-based, clinical framing. Includes a cavity ↔
// abdominopelvic-quadrant bridge question tying World 2's pieces together.
const scenario = (id: string, question: string, options: string[], answer: number, explanation: string): Question => ({
  id,
  week: 0,
  module: "Body Cavities",
  topic: "Body cavities",
  difficulty: "medium",
  questionType: "multiple-choice",
  question,
  options,
  answer,
  explanation,
  xp: 30,
  tags: ["cavities-challenge", "scenario"],
});

export const scenarioCavityItems: Question[] = [
  scenario(
    "bc-s1",
    "A patient presents with chest pain and shortness of breath. Which body cavity does a clinician focus on first?",
    ["Thoracic cavity", "Cranial cavity", "Pelvic cavity", "Vertebral cavity"],
    0,
    "Chest pain and breathing trouble point to the thoracic cavity, home to the heart and lungs."
  ),
  scenario(
    "bc-s2",
    "Imaging shows fluid buildup around only the right lung, not the left. Which specific space is affected?",
    ["Right pleural cavity", "Left pleural cavity", "Mediastinum", "Pericardial cavity"],
    0,
    "Each lung has its own separate pleural cavity, so fluid can build up around one side without affecting the other."
  ),
  scenario(
    "bc-s3",
    "A trauma patient has a penetrating injury directly over the sternum, at the midline of the chest. Which central thoracic structure is at highest risk?",
    ["Mediastinum", "Left pleural cavity", "Abdominal cavity", "Vertebral cavity"],
    0,
    "A midline chest injury threatens the mediastinum — the central compartment holding the heart, great vessels, trachea, and esophagus."
  ),
  scenario(
    "bc-s4",
    "A patient's appendicitis pain localizes to the right lower quadrant. Which larger cavity contains that quadrant?",
    ["Abdominopelvic cavity", "Thoracic cavity", "Cranial cavity", "Vertebral cavity"],
    0,
    "The abdominal quadrants and nine regions are both ways of mapping the same abdominopelvic cavity — the RLQ sits within it."
  ),
];

// Stage 4 — Boss: mixed round. Passing (4/5) unlocks "Cavity Commander",
// matching the placeholder already shown on the Progress page's badge shelf.
export const bossCavityItems: Question[] = [
  scenario(
    "bc-boss1",
    "BOSS: Which two cavities together make up the dorsal cavity?",
    ["Cranial and vertebral", "Thoracic and abdominal", "Pleural and pericardial", "Abdominal and pelvic"],
    0,
    "The dorsal cavity, along the back of the body, combines the cranial and vertebral cavities."
  ),
  scenario(
    "bc-boss2",
    "BOSS: Which space would be affected by inflammation of the sac directly around the heart?",
    ["Pericardial cavity", "Pleural cavity", "Peritoneal cavity", "Vertebral cavity"],
    0,
    "The pericardial cavity surrounds the heart specifically, distinct from the pleural cavities around each lung."
  ),
  scenario(
    "bc-boss3",
    "BOSS: Which cavity has no physical wall separating its two named parts?",
    ["Abdominopelvic cavity", "Thoracic cavity", "Cranial cavity", "Dorsal cavity"],
    0,
    "The abdominal and pelvic cavities blend into one continuous space — no wall divides them, unlike the diaphragm between thoracic and abdominal."
  ),
  scenario(
    "bc-boss4",
    "BOSS: What structure forms the boundary between the thoracic and abdominal cavities?",
    ["The diaphragm", "The mediastinum", "The peritoneum", "The sternum"],
    0,
    "The diaphragm, a dome-shaped muscle, is the physical boundary separating thoracic from abdominal."
  ),
  scenario(
    "bc-boss5",
    "BOSS: Besides the heart, which structures also run through the mediastinum?",
    ["Trachea and esophagus", "Stomach and spleen", "Bladder and rectum", "Cerebellum and brainstem"],
    0,
    "The mediastinum carries the trachea and esophagus alongside the heart and great vessels, all between the two lungs."
  ),
];

export const BOSS_PASS_THRESHOLD = 4;
export const BOSS_BADGE = "Cavity Commander";
