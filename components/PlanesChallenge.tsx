"use client";

import { useState } from "react";
import { modules } from "@/data/modules";
import {
  BOSS_PASS_THRESHOLD,
  PLANE_LABELS,
  PlaneId,
  VisualPlaneItem,
  basicPlaneQuestionIds,
  bossPlaneItems,
  scenarioPlaneItems,
  visualPlaneItems,
} from "@/data/planesChallenge";
import { Question } from "@/data/types";

type Stage = "intro" | "basic" | "visual" | "scenario" | "boss" | "complete";

const planesModule = modules.find((m) => m.id === "planes")!;
const basicItems: Question[] = basicPlaneQuestionIds
  .map((id) => planesModule.questions.find((q) => q.id === id))
  .filter((q): q is Question => Boolean(q));

export default function PlanesChallenge({
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
        <div className="planes-intro">
          <span>◫</span>
          <div>
            <p className="eyebrow">WORLD 2 · THE HUMAN MAP</p>
            <h2>Body Planes Challenge</h2>
            <p>
              Four rounds, one skill: reading how a body is sectioned. Basic recall, then a visual diagram, then
              clinical scenarios, then a boss round mixing all three.
            </p>
          </div>
        </div>
        <div className="planes-roadmap">
          <RoadmapStep n={1} title="Basic identification" desc="Five quick recall questions, one per plane." />
          <RoadmapStep n={2} title="Visual identification" desc="Click the correct line on a body diagram." />
          <RoadmapStep n={3} title="Scenario-based" desc="Clinical-imaging scenarios — pick the right plane." />
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
        items={scenarioPlaneItems}
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
      <span>◫</span>
      <p className="eyebrow">WORLD 2 CHALLENGE COMPLETE</p>
      <h2>
        {runCorrect} / {runTotal} correct
      </h2>
      <p>Nice work moving through all four rounds of the Body Planes Challenge.</p>
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
  const [picked, setPicked] = useState<PlaneId | null>(null);
  const item = visualPlaneItems[index];

  const pick = (plane: PlaneId) => {
    if (picked !== null) return;
    setPicked(plane);
    onRecord(item.id, "Planes", item.xp, plane === item.answer);
  };
  const advance = () => {
    setPicked(null);
    if (index + 1 >= visualPlaneItems.length) onDone();
    else setIndex((i) => i + 1);
  };

  const correct = picked === item.answer;
  return (
    <div className="mission-wrap">
      <span className="pill">STAGE 2 · VISUAL IDENTIFICATION</span>
      <article className="question-card" style={{ marginTop: 14 }}>
        <div className="question-top">
          <span className="topic-tag">
            Diagram {index + 1} of {visualPlaneItems.length}
          </span>
          <span>⚡ +{item.xp} XP</span>
        </div>
        <h2>{item.prompt}</h2>
        <PlaneDiagram item={item} picked={picked} onPick={pick} />
        {picked !== null && (
          <div className={correct ? "feedback good" : "feedback gentle"} aria-live="polite">
            <b>{correct ? "Great job — you found it!" : "Almost — let’s look at the clue."}</b>
            <p>{item.explanation}</p>
            <button className="primary" onClick={advance}>
              {index + 1 >= visualPlaneItems.length ? "Next round" : "Next diagram"} →
            </button>
          </div>
        )}
      </article>
    </div>
  );
}

function PlaneDiagram({
  item,
  picked,
  onPick,
}: {
  item: VisualPlaneItem;
  picked: PlaneId | null;
  onPick: (plane: PlaneId) => void;
}) {
  const lineFor = (plane: PlaneId): { x1: number; y1: number; x2: number; y2: number; dash?: string } => {
    switch (plane) {
      case "midsagittal":
        return { x1: 80, y1: 6, x2: 80, y2: 254 };
      case "sagittal":
        return { x1: 97, y1: 6, x2: 97, y2: 254, dash: "8 6" };
      case "transverse":
        return { x1: 16, y1: 130, x2: 144, y2: 130 };
      case "oblique":
        return { x1: 30, y1: 55, x2: 130, y2: 205, dash: "8 6" };
      case "frontal":
        return { x1: 80, y1: 6, x2: 80, y2: 254 };
    }
  };

  // A perfectly vertical or horizontal <line> has a zero-width/zero-height
  // bounding box, which makes it an unreliable — sometimes literally
  // unclickable — hit target. Use a properly sized invisible <rect> per
  // plane for hit-testing instead (also a much larger touch target).
  const hitRectFor = (plane: PlaneId): { x: number; y: number; width: number; height: number } => {
    switch (plane) {
      case "midsagittal":
        return { x: 72, y: 6, width: 16, height: 248 };
      case "sagittal":
        return { x: 89, y: 6, width: 16, height: 248 };
      case "transverse":
        return { x: 16, y: 122, width: 128, height: 16 };
      case "oblique":
        return { x: 22, y: 47, width: 116, height: 166 };
      case "frontal":
        return { x: 72, y: 6, width: 16, height: 248 };
    }
  };

  return (
    <div className="plane-diagram" role="group" aria-label={`Body diagram, ${item.view} view`}>
      <svg viewBox="0 0 160 260" width="220" height="280" aria-hidden={false}>
        <defs>
          <clipPath id={`clip-${item.id}`}>
            {item.view === "front" ? (
              <>
                <circle cx="80" cy="30" r="18" />
                <rect x="50" y="52" width="60" height="96" rx="22" />
                <rect x="28" y="58" width="16" height="78" rx="8" />
                <rect x="116" y="58" width="16" height="78" rx="8" />
                <rect x="54" y="148" width="22" height="92" rx="10" />
                <rect x="84" y="148" width="22" height="92" rx="10" />
              </>
            ) : (
              <>
                <circle cx="80" cy="30" r="16" />
                <ellipse cx="80" cy="110" rx="34" ry="70" />
                <rect x="65" y="175" width="26" height="75" rx="10" />
              </>
            )}
          </clipPath>
        </defs>

        {item.view === "side" && (
          <g clipPath={`url(#clip-${item.id})`}>
            <rect x="0" y="0" width="80" height="260" fill="#3973e6" opacity="0.16" />
            <rect x="80" y="0" width="80" height="260" fill="#ee785f" opacity="0.16" />
          </g>
        )}

        <g fill="none" stroke="#a7acc4" strokeWidth="2.5">
          {item.view === "front" ? (
            <>
              <circle cx="80" cy="30" r="18" />
              <rect x="50" y="52" width="60" height="96" rx="22" />
              <rect x="28" y="58" width="16" height="78" rx="8" />
              <rect x="116" y="58" width="16" height="78" rx="8" />
              <rect x="54" y="148" width="22" height="92" rx="10" />
              <rect x="84" y="148" width="22" height="92" rx="10" />
            </>
          ) : (
            <>
              <circle cx="80" cy="30" r="16" />
              <ellipse cx="80" cy="110" rx="34" ry="70" />
              <rect x="65" y="175" width="26" height="75" rx="10" />
            </>
          )}
        </g>

        {item.candidates.map((plane) => {
          const l = lineFor(plane);
          const state = picked === null ? "" : picked === plane ? (plane === item.answer ? "correct" : "wrong") : picked !== plane && plane === item.answer ? "correct" : "";
          return (
            <g
              key={plane}
              role="button"
              tabIndex={0}
              aria-label={`Select ${PLANE_LABELS[plane]} plane`}
              aria-pressed={picked === plane}
              className={`plane-line ${state}`}
              onClick={() => onPick(plane)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onPick(plane);
                }
              }}
            >
              <rect {...hitRectFor(plane)} className="plane-line-hit" />
              <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} className="plane-line-visible" strokeDasharray={l.dash} />
            </g>
          );
        })}
      </svg>
      <div className="plane-legend">
        {item.candidates.map((plane) => (
          <span key={plane} className={`plane-legend-item ${picked === plane ? (plane === item.answer ? "correct" : "wrong") : ""}`}>
            {PLANE_LABELS[plane]}
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
  const question = bossPlaneItems[index];

  const choose = (n: number) => {
    if (choice !== null) return;
    setChoice(n);
    const good = n === question.answer;
    onRecord(question.id, question.topic, question.xp, good);
    if (good) setCorrectCount((c) => c + 1);
  };
  const advance = () => {
    setChoice(null);
    if (index + 1 >= bossPlaneItems.length) onFinish(correctCount);
    else setIndex((i) => i + 1);
  };

  const correct = choice === question.answer;
  return (
    <div className="mission-wrap">
      <span className="pill boss-pill">STAGE 4 · BOSS ROUND</span>
      <article className="question-card boss-card" style={{ marginTop: 14 }}>
        <div className="question-top">
          <span className="topic-tag">
            Clash {index + 1} of {bossPlaneItems.length}
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
              {index + 1 >= bossPlaneItems.length ? "See result" : "Next clash"} →
            </button>
          </div>
        )}
      </article>
    </div>
  );
}
