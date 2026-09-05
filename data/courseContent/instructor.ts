import { Question } from "../types";

// Instructor-specific questions derived from the supplied BIOS 251 Week 1–3 decks.
// Add or replace questions here when new lecture material is available.
const i = (id: string, week: number, module: string, topic: string, question: string, options: string[], answer: number, explanation: string): Question => ({ id, week, module, topic, difficulty: "medium", questionType: "multiple-choice", question, options, answer, explanation, xp: 30, tags: ["instructor", `week-${week}`, topic.toLowerCase()] });

export const instructorQuestions: Question[] = [
  i("w1-1",1,"Foundations","A&P overview","Physiology focuses on…",["how body parts function","the names of body regions","only disease treatment","cell chemistry only"],0,"Your Week 1 deck distinguishes physiology (function) from anatomy (structure)."),
  i("w1-2",1,"Foundations","Homeostasis","Homeostasis keeps the internal environment…",["within a relatively stable range","identical at every moment","outside the body","unaffected by feedback"],0,"Your Week 1 material introduces homeostasis as the body’s maintenance of stable internal conditions."),
  i("w1-3",1,"Foundations","Organization","Cells combine to form…",["tissues","organ systems","organelles","body cavities"],0,"The structural hierarchy moves from cells to tissues, organs, and organ systems."),
  i("w2-1",2,"Chemistry","Atoms","The atomic number equals the number of…",["protons","neutrons","electrons plus neutrons","valence shells"],0,"Your Week 2 deck defines atomic number as the number of protons in the nucleus."),
  i("w2-2",2,"Chemistry","Atoms","The mass number equals…",["protons plus neutrons","protons plus electrons","electrons minus protons","neutrons only"],0,"Mass number is the combined number of protons and neutrons."),
  i("w2-3",2,"Chemistry","Atoms","Isotopes of an element differ in their number of…",["neutrons","protons","electrons in a neutral atom","valence shells only"],0,"Isotopes have the same number of protons but different numbers of neutrons."),
  i("w2-4",2,"Chemistry","Bonds","An ionic bond forms when electrons are…",["transferred","shared equally","absent","made into protons"],0,"Electron transfer creates oppositely charged ions that attract each other."),
  i("w2-5",2,"Chemistry","Bonds","A covalent bond involves…",["sharing electrons","transferring protons","destroying neutrons","only attraction between ions"],0,"Covalent bonds result when atoms share electrons."),
  i("w2-6",2,"Chemistry","Water","A substance that dissolves in water is…",["hydrophilic","hydrophobic","radioactive","isotonic"],0,"Hydrophilic substances are charged or polar enough to dissolve in water."),
  i("w2-7",2,"Chemistry","Ions","Electrolytes are…",["ions in water that can conduct electricity","uncharged fats","types of tissue","atoms with no electrons"],0,"Week 2 notes that electrolytes are ions in solution and are clinically important."),
  i("w3-1",3,"Cells","Membrane","The plasma membrane is selectively permeable, meaning it…",["controls what moves into and out of the cell","allows everything through","contains all DNA","produces all ATP"],0,"Your Week 3 deck describes the membrane as the cell’s selective boundary."),
  i("w3-2",3,"Cells","Membrane","In a phospholipid bilayer, hydrophilic heads face…",["the watery environments on either side","the center of the membrane","the nucleus only","away from water"],0,"Hydrophilic phosphate heads face water; hydrophobic tails point inward."),
  i("w3-3",3,"Cells","Transport","Facilitated diffusion uses…",["a membrane carrier or channel","ATP directly","vesicles only","a nuclear pore"],0,"It is passive movement down a gradient aided by a transport protein."),
  i("w3-4",3,"Cells","Transport","In a hypertonic solution, a cell typically…",["shrinks","swells","remains unchanged","divides"],0,"More solute outside the cell draws water out by osmosis."),
  i("w3-5",3,"Cells","Transport","Active transport moves substances…",["against a concentration gradient using ATP","down a gradient without energy","only through water","only into the nucleus"],0,"Week 3 identifies ATP-requiring movement from lower to higher concentration as active transport."),
  i("w3-6",3,"Cells","Transport","The sodium-potassium pump is an example of…",["active transport","osmosis","simple diffusion","filtration"],0,"The Na⁺/K⁺ ATPase uses energy to move ions against gradients.")
];
