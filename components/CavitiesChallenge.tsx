"use client";

import Image from "next/image";
import { useState } from "react";
import { modules } from "@/data/modules";
import {
  BOSS_PASS_THRESHOLD,
  CAVITY_LABELS,
  CavityId,
  VisualCavityItem,
  basicCavityQuestionIds,
  bossCavityItems,
  scenarioCavityItems,
  visualCavityItems,
} from "@/data/cavitiesChallenge";
import { Question } from "@/data/types";

type Stage = "intro" | "basic" | "visual" | "scenario" | "boss" | "complete";

const cavitiesModule = modules.find((m) => m.id === "cavities")!;
const basicItems: Question[] = basicCavityQuestionIds
  .map((id) => cavitiesModule.questions.find((q) => q.id === id))
  .filter((q): q is Question => Boolean(q));

export default function CavitiesChallenge({
  onRecord,
  onBossWin,
  onExit,
}: {
  onRecord: (id: string, topic: string, xp: number, good: boolean) => void;
  onBossWin: () => void;
  onExit: () => void;
}) {
  const [stage, setStage] = useState<Stage>("intro");
  const [runXp, setRunXp] = useState(0);
  const [runCorrect, setRunCorrect] = useState(0);
  const [runTotal, setRunTotal] = useState(0);

  const record = (id: string, topic: string, xp: number, good: boolean) => {
    onRecord(id, topic, xp, good);
    setRunTotal((t) => t + 1);
    if (good) {
      setRunCorrect((c) => c + 1);
      setRunXp((x) => x + xp);
    }
  };

  if (stage === "intro") {
    return (
      <div className="planes-wrap">
        <button className="back" onClick={onExit}>
          ← Choose another mission
        </button>
        <div className="planes-intro cavities-intro">
          <span>◒</span>
          <div>
            <p className="eyebrow">WORLD 2 · THE HUMAN MAP</p>
            <h2>Major Body Cavities</h2>
            <p>
              Map the body&apos;s protected spaces: the five major cavities, the abdominopelvic cavity, and a close-up
              on the thoracic cavity&apos;s own subdivisions — the pleural cavities and mediastinum.
            </p>
          </div>
        </div>
        <div className="organ-strip">
          {[
            ["heart", "Heart"],
            ["lungs", "Lungs"],
            ["liver", "Liver"],
            ["kidneys", "Kidneys"],
            ["stomach", "Stomach"],
            ["brain", "Brain"],
          ].map(([file, label]) => (
            <div className="organ-chip" key={file}>
              <Image src={`/organs/${file}.png`} alt="" width={32} height={32} unoptimized />
              <small>{label}</small>
            </div>
          ))}
        </div>
        <div className="planes-roadmap">
          <RoadmapStep n={1} title="Basic identification" desc="Six quick recall questions — one per major cavity." />
          <RoadmapStep n={2} title="Visual identification" desc="Click the correct region on a body diagram." />
          <RoadmapStep n={3} title="Scenario-based" desc="Clinical scenarios, including a cavity ↔ quadrant bridge." />
          <RoadmapStep n={4} title="Boss round" desc={`Mixed challenge — score ${BOSS_PASS_THRESHOLD}/5 to win the badge.`} />
        </div>
        <button className="primary planes-start" onClick={() => setStage("basic")}>
          Start challenge <span>→</span>
        </button>
      </div>
    );
  }

  if (stage === "basic") {
    return (
      <QuestionRound
        title="Stage 1 · Basic identification"
        items={basicItems}
        onRecord={record}
        onDone={() => setStage("visual")}
      />
    );
  }

  if (stage === "visual") {
    return <VisualRound onRecord={record} onDone={() => setStage("scenario")} />;
  }

  if (stage === "scenario") {
    return (
      <QuestionRound
        title="Stage 3 · Scenario-based"
        items={scenarioCavityItems}
        onRecord={record}
        onDone={() => setStage("boss")}
      />
    );
  }

  if (stage === "boss") {
    return (
      <BossRound
        onRecord={record}
        onFinish={(correctCount) => {
          if (correctCount >= BOSS_PASS_THRESHOLD) onBossWin();
          setStage("complete");
        }}
      />
    );
  }

  return (
    <div className="complete">
      <span>◒</span>
      <p className="eyebrow">WORLD 2 CHALLENGE COMPLETE</p>
      <h2>
        {runCorrect} / {runTotal} correct
      </h2>
      <p>Nice work mapping the body&apos;s cavities, from the skull down to the pelvis.</p>
      <div>
        <b>
          Accuracy
          <br />
          <strong>{Math.round((runCorrect / Math.max(1, runTotal)) * 100)}%</strong>
        </b>
        <b>
          XP earned
          <br />
          <strong>+{runXp}</strong>
        </b>
      </div>
      <button className="primary" style={{ marginTop: 18 }} onClick={onExit}>
        Back to the quest map →
      </button>
    </div>
  );
}

function RoadmapStep({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="planes-step">
      <span>{n}</span>
      <div>
        <b>{title}</b>
        <small>{desc}</small>
      </div>
    </div>
  );
}

function QuestionRound({
  title,
  items,
  onRecord,
  onDone,
}: {
  title: string;
  items: Question[];
  onRecord: (id: string, topic: string, xp: number, good: boolean) => void;
  onDone: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const question = items[index];

  const choose = (n: number) => {
    if (choice !== null) return;
    setChoice(n);
    onRecord(question.id, question.topic, question.xp, n === question.answer);
  };
  const advance = () => {
    setChoice(null);
    if (index + 1 >= items.length) onDone();
    else setIndex((i) => i + 1);
  };

  const correct = choice === question.answer;
  return (
    <div className="mission-wrap">
      <span className="pill">{title.toUpperCase()}</span>
      <article className="question-card" style={{ marginTop: 14 }}>
        <div className="question-top">
          <span className="topic-tag">
            Question {index + 1} of {items.length}
          </span>
          <span>⚡ +{question.xp} XP</span>
        </div>
        <h2>{question.question}</h2>
        <div className="choices">
          {question.options.map((option, n) => (
            <button
              key={option}
              disabled={choice !== null}
              onClick={() => choose(n)}
              className={`choice ${
                choice === n ? (n === question.answer ? "correct" : "wrong") : choice !== null && n === question.answer ? "correct" : ""
              }`}
            >
              <span>{"ABCD"[n]}</span>
              {option}
              {choice !== null && n === question.answer && <i>✓</i>}
              {choice !== null && choice === n && n !== question.answer && <i>✕</i>}
            </button>
          ))}
        </div>
        {choice !== null && (
          <div className={correct ? "feedback good" : "feedback gentle"} aria-live="polite">
            <b>{correct ? "Great job! +" + question.xp + " XP" : "Almost there — let’s look at the clue."}</b>
            <p>{question.explanation}</p>
            <button className="primary" onClick={advance}>
              {index + 1 >= items.length ? "Next round" : "Next question"} →
            </button>
          </div>
        )}
      </article>
    </div>
  );
}

function VisualRound({
  onRecord,
  onDone,
}: {
  onRecord: (id: string, topic: string, xp: number, good: boolean) => void;
  onDone: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<CavityId | null>(null);
  const item = visualCavityItems[index];

  const pick = (cavity: CavityId) => {
    if (picked !== null) return;
    setPicked(cavity);
    onRecord(item.id, "Body cavities", item.xp, cavity === item.answer);
  };
  const advance = () => {
    setPicked(null);
    if (index + 1 >= visualCavityItems.length) onDone();
    else setIndex((i) => i + 1);
  };

  const correct = picked === item.answer;
  return (
    <div className="mission-wrap">
      <span className="pill">STAGE 2 · VISUAL IDENTIFICATION</span>
      <article className="question-card" style={{ marginTop: 14 }}>
        <div className="question-top">
          <span className="topic-tag">
            Diagram {index + 1} of {visualCavityItems.length}
          </span>
          <span>⚡ +{item.xp} XP</span>
        </div>
        <h2>{item.prompt}</h2>
        <CavityDiagram item={item} picked={picked} onPick={pick} />
        {picked !== null && (
          <div className={correct ? "feedback good" : "feedback gentle"} aria-live="polite">
            <b>{correct ? "Great job — you found it!" : "Almost — let’s look at the clue."}</b>
            <p>{item.explanation}</p>
            <button className="primary" onClick={advance}>
              {index + 1 >= visualCavityItems.length ? "Next round" : "Next diagram"} →
            </button>
          </div>
        )}
      </article>
    </div>
  );
}

type Region =
  | { shape: "circle"; cx: number; cy: number; r: number }
  | { shape: "rect"; x: number; y: number; width: number; height: number }
  | { shape: "ellipse"; cx: number; cy: number; rx: number; ry: number };

function regionFor(diagram: VisualCavityItem["diagram"], cavity: CavityId): Region {
  if (diagram === "front") {
    switch (cavity) {
      case "cranial":
        return { shape: "circle", cx: 80, cy: 30, r: 20 };
      case "thoracic":
        return { shape: "rect", x: 45, y: 50, width: 70, height: 36 };
      case "abdominal":
        return { shape: "rect", x: 45, y: 86, width: 70, height: 32 };
      case "pelvic":
      default:
        return { shape: "rect", x: 45, y: 118, width: 70, height: 90 };
    }
  }
  if (diagram === "side") {
    return { shape: "rect", x: 86, y: 14, width: 22, height: 234 };
  }
  // thoraxCrossSection
  switch (cavity) {
    case "leftPleural":
      return { shape: "ellipse", cx: 112, cy: 80, rx: 26, ry: 38 };
    case "rightPleural":
      return { shape: "ellipse", cx: 48, cy: 80, rx: 26, ry: 38 };
    case "pericardial":
      return { shape: "circle", cx: 80, cy: 85, r: 13 };
    case "mediastinum":
    default:
      return { shape: "rect", x: 68, y: 32, width: 24, height: 96 };
  }
}

function CavityDiagram({
  item,
  picked,
  onPick,
}: {
  item: VisualCavityItem;
  picked: CavityId | null;
  onPick: (cavity: CavityId) => void;
}) {
  return (
    <div className="plane-diagram" role="group" aria-label={`Body diagram, ${item.diagram}`}>
      <svg viewBox="0 0 160 260" width="220" height="280">
        {item.diagram === "thoraxCrossSection" ? (
          <>
            <g fill="none" stroke="#a7acc4" strokeWidth="2.5">
              <ellipse cx="80" cy="80" rx="70" ry="55" />
            </g>
            {/* Visible anatomical boundaries, drawn at rest so the diagram
                teaches the layout instead of hiding it behind blind hitboxes. */}
            <g fill="none" stroke="#c7cbdc" strokeWidth="1.5" strokeDasharray="4 4">
              <ellipse cx="112" cy="80" rx="26" ry="38" />
              <ellipse cx="48" cy="80" rx="26" ry="38" />
              <rect x="68" y="32" width="24" height="96" rx="8" />
              <circle cx="80" cy="85" r="13" />
            </g>
          </>
        ) : (
          <g fill="none" stroke="#a7acc4" strokeWidth="2.5">
            <circle cx="80" cy="30" r="18" />
            {item.diagram === "front" ? (
              <>
                <rect x="50" y="52" width="60" height="96" rx="22" />
                <rect x="28" y="58" width="16" height="78" rx="8" />
                <rect x="116" y="58" width="16" height="78" rx="8" />
                <rect x="54" y="148" width="22" height="92" rx="10" />
                <rect x="84" y="148" width="22" height="92" rx="10" />
                {/* Diaphragm and pelvic-brim lines, marking the three torso
                    cavities visibly instead of leaving them as blind bands. */}
                <line x1="46" y1="86" x2="114" y2="86" stroke="#c7cbdc" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="46" y1="118" x2="114" y2="118" stroke="#c7cbdc" strokeWidth="1.5" strokeDasharray="4 4" />
              </>
            ) : (
              <>
                <ellipse cx="80" cy="110" rx="34" ry="70" />
                <rect x="65" y="175" width="26" height="75" rx="10" />
                {/* Vertebral canal, visible along the back of the profile. */}
                <line x1="97" y1="18" x2="97" y2="248" stroke="#c7cbdc" strokeWidth="2" strokeDasharray="5 4" />
              </>
            )}
          </g>
        )}

        {item.candidates.map((cavity) => {
          const r = regionFor(item.diagram, cavity);
          const state =
            picked === null ? "" : picked === cavity ? (cavity === item.answer ? "correct" : "wrong") : picked !== cavity && cavity === item.answer ? "correct" : "";
          const common = {
            role: "button" as const,
            tabIndex: 0,
            "aria-label": `Select ${CAVITY_LABELS[cavity]}`,
            "aria-pressed": picked === cavity,
            className: `cavity-region ${state}`,
            onClick: () => onPick(cavity),
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onPick(cavity);
              }
            },
          };
          if (r.shape === "circle") return <circle key={cavity} {...common} cx={r.cx} cy={r.cy} r={r.r} />;
          if (r.shape === "rect") return <rect key={cavity} {...common} x={r.x} y={r.y} width={r.width} height={r.height} rx={6} />;
          return <ellipse key={cavity} {...common} cx={r.cx} cy={r.cy} rx={r.rx} ry={r.ry} />;
        })}
      </svg>
      <div className="plane-legend">
        {item.candidates.map((cavity) => (
          <span key={cavity} className={`plane-legend-item ${picked === cavity ? (cavity === item.answer ? "correct" : "wrong") : ""}`}>
            {CAVITY_LABELS[cavity]}
          </span>
        ))}
      </div>
    </div>
  );
}

function BossRound({
  onRecord,
  onFinish,
}: {
  onRecord: (id: string, topic: string, xp: number, good: boolean) => void;
  onFinish: (correctCount: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const question = bossCavityItems[index];

  const choose = (n: number) => {
    if (choice !== null) return;
    setChoice(n);
    const good = n === question.answer;
    onRecord(question.id, question.topic, question.xp, good);
    if (good) setCorrectCount((c) => c + 1);
  };
  const advance = () => {
    setChoice(null);
    if (index + 1 >= bossCavityItems.length) onFinish(correctCount);
    else setIndex((i) => i + 1);
  };

  const correct = choice === question.answer;
  return (
    <div className="mission-wrap">
      <span className="pill boss-pill">STAGE 4 · BOSS ROUND</span>
      <article className="question-card boss-card" style={{ marginTop: 14 }}>
        <div className="question-top">
          <span className="topic-tag">
            Clash {index + 1} of {bossCavityItems.length}
          </span>
          <span>⚡ +{question.xp} XP</span>
        </div>
        <h2>{question.question}</h2>
        <div className="choices">
          {question.options.map((option, n) => (
            <button
              key={option}
              disabled={choice !== null}
              onClick={() => choose(n)}
              className={`choice ${
                choice === n ? (n === question.answer ? "correct" : "wrong") : choice !== null && n === question.answer ? "correct" : ""
              }`}
            >
              <span>{"ABCD"[n]}</span>
              {option}
              {choice !== null && n === question.answer && <i>✓</i>}
              {choice !== null && choice === n && n !== question.answer && <i>✕</i>}
            </button>
          ))}
        </div>
        {choice !== null && (
          <div className={correct ? "feedback good" : "feedback gentle"} aria-live="polite">
            <b>{correct ? "Excellent clinical thinking!" : "Good attempt — one detail changes the answer."}</b>
            <p>{question.explanation}</p>
            <button className="primary" onClick={advance}>
              {index + 1 >= bossCavityItems.length ? "See result" : "Next clash"} →
            </button>
          </div>
        )}
      </article>
    </div>
  );
}
