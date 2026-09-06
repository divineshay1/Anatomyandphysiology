import { LabStation } from "./types";

// Lab Rush stations. Data-driven so a real lab practical (image-based ID,
// timed stations) can be built on top without touching the Lab component.
// visual:"torso" reuses the existing cavity diagram; visual:"text" is a
// described-specimen question for content with no diagram asset yet.
export const labStations: LabStation[] = [
  {
    id: "lab-1",
    title: "Spot the structure",
    visual: "torso",
    prompt: "Which cavity houses the heart and lungs?",
    options: ["Cranial cavity", "Thoracic cavity", "Abdominal cavity", "Pelvic cavity"],
    answer: 1,
    explanation: "The thoracic cavity is above the diaphragm and includes the heart and lungs.",
  },
  {
    id: "lab-2",
    title: "Spot the structure",
    visual: "torso",
    prompt: "Which cavity houses the stomach, liver, and spleen?",
    options: ["Cranial cavity", "Thoracic cavity", "Abdominal cavity", "Pelvic cavity"],
    answer: 2,
    explanation: "The abdominal cavity, below the diaphragm, contains the stomach, liver, and spleen.",
  },
  {
    id: "lab-3",
    title: "Identify the plane",
    visual: "text",
    prompt:
      "A CT technician takes one horizontal slice through the abdomen, showing superior structures separated from inferior ones. Which plane produced this image?",
    options: ["Sagittal", "Frontal (coronal)", "Transverse", "Oblique"],
    answer: 2,
    explanation: "A horizontal slice separating upper from lower structures is a transverse section.",
  },
  {
    id: "lab-4",
    title: "Identify the tissue",
    visual: "text",
    prompt:
      "Under the microscope, this tissue is made of tightly packed cells forming a continuous sheet that covers a body surface. Which tissue type is being described?",
    options: ["Epithelial tissue", "Connective tissue", "Muscle tissue", "Nervous tissue"],
    answer: 0,
    explanation: "Tightly packed sheet-forming cells covering a surface are the hallmark of epithelial tissue.",
  },
  {
    id: "lab-5",
    title: "Locate the structure",
    visual: "text",
    prompt: "A specimen label points to the appendix. Which abdominal quadrant is it found in?",
    options: ["Right upper quadrant", "Left upper quadrant", "Right lower quadrant", "Left lower quadrant"],
    answer: 2,
    explanation: "The appendix is the classic landmark of the right lower quadrant (RLQ).",
  },
];
