import { CaseStudy } from "./types";

// Clinical Detective case files. Add new cases here — the Case view is fully
// data-driven, so new scenarios need no component changes. Every case is an
// anatomy exercise using clinical framing, not a diagnostic tool.
export const caseStudies: CaseStudy[] = [
  {
    id: "find-the-pain",
    title: "Find the Pain",
    scenario:
      "A patient's pain begins near the umbilicus and later localizes to the lower right abdomen. Use anatomy language to investigate.",
    xp: 60,
    steps: [
      {
        id: "ftp-1",
        prompt: "Where is the pain now localized?",
        options: ["Right lower quadrant", "Left upper quadrant", "Right upper quadrant"],
        answer: 0,
        explanation: "The scenario localizes pain to the right lower quadrant (RLQ).",
      },
      {
        id: "ftp-2",
        prompt: "Which regional term best fits this location?",
        options: ["Right iliac (inguinal) region", "Epigastric region", "Left hypochondriac region"],
        answer: 0,
        explanation: "The right iliac/inguinal region lies in the lower right of the nine-region scheme.",
      },
    ],
  },
  {
    id: "appendicitis",
    title: "The Migrating Pain",
    scenario:
      "A patient develops abdominal pain that eventually localizes to the right lower quadrant, with tenderness near a classic landmark.",
    xp: 90,
    steps: [
      {
        id: "app-1",
        prompt: "Which quadrant does the pain ultimately localize to?",
        options: ["Right lower quadrant", "Left lower quadrant", "Right upper quadrant", "Left upper quadrant"],
        answer: 0,
        explanation: "The pain migrates to and settles in the right lower quadrant (RLQ).",
      },
      {
        id: "app-2",
        prompt: "Which of the nine abdominal regions overlaps this quadrant?",
        options: ["Right iliac (inguinal) region", "Epigastric region", "Left hypochondriac region", "Umbilical region"],
        answer: 0,
        explanation: "The right iliac/inguinal region sits in the lower right of the nine-region scheme, inside the RLQ.",
      },
      {
        id: "app-3",
        prompt: "Which structure located here is classically associated with this presentation?",
        options: ["Appendix", "Spleen", "Gallbladder", "Left kidney"],
        answer: 0,
        explanation:
          "The appendix sits in the RLQ and is the classic anatomy-class landmark for this presentation. This is an anatomy exercise, not a diagnosis.",
      },
      {
        id: "app-4",
        prompt: "Which directional terms correctly relate the appendix to the umbilicus?",
        options: ["Inferior and lateral", "Superior and medial", "Anterior only", "Proximal"],
        answer: 0,
        explanation: "The appendix sits below (inferior) and to the side of (lateral to) the umbilicus.",
      },
      {
        id: "app-5",
        prompt: "Why does the exact location matter anatomically?",
        options: [
          "It tells you which regional/quadrant landmarks and nearby structures are involved",
          "It changes the patient's diagnosis",
          "It has no anatomical significance",
          "It only matters for billing codes",
        ],
        answer: 0,
        explanation:
          "Anatomical location tells you which structures and regional terms apply — that's the connection this exercise is teaching, not a diagnostic call.",
      },
    ],
  },
];
