"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { allQuestions, modules } from "@/data/modules";
import { instructorQuestions } from "@/data/courseContent/instructor";
import { caseStudies } from "@/data/cases";
import { labStations } from "@/data/labStations";
import { CaseStudy, Module, Question } from "@/data/types";
import { moduleMastery } from "@/lib/mastery";

type View = "home" | "missionSelect" | "mission" | "lab" | "case" | "explore" | "review" | "progress";
type Player = {
  xp: number;
  streak: number;
  answered: string[];
  correct: string[];
  weak: Record<string, number>;
  badges: string[];
};
const initial: Player = { xp: 240, streak: 3, answered: [], correct: [], weak: {}, badges: ["Anatomical Position Pro"] };
const level = (xp: number) => Math.min(6, Math.floor(xp / 250) + 1);
const levels = ["Anatomy Rookie", "Body Explorer", "Anatomy Detective", "Clinical Thinker", "A&P Scholar", "Future Nurse"];
const storage = "ap-quest-player-v1";

export default function Page() {
  const [view, setView] = useState<View>("home");
  const [player, setPlayer] = useState<Player>(initial);
  const [selectedModule, setSelectedModule] = useState("foundations");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storage);
    if (saved) setPlayer(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem(storage, JSON.stringify(player));
  }, [player]);

  const selected = useMemo(() => modules.find((m) => m.id === selectedModule) ?? modules[0], [selectedModule]);
  const missionQuestions = selected.questions;
  const current = missionQuestions[questionIndex % missionQuestions.length];
  const mastery = Math.min(100, Math.round((player.correct.length / Math.max(1, player.answered.length)) * 100));
  const nextModule = useMemo(
    () => modules.find((m) => moduleMastery(m, player.correct) < 100) ?? modules[modules.length - 1],
    [player.correct]
  );

  const answer = (q: Question, answerIndex: number) => {
    if (checked) return;
    setChoice(answerIndex);
    setChecked(true);
    const good = answerIndex === q.answer;
    setPlayer((p) => ({
      ...p,
      xp: p.xp + (good ? q.xp : 5),
      streak: good ? p.streak + 1 : 0,
      answered: [...new Set([...p.answered, q.id])],
      correct: good ? [...new Set([...p.correct, q.id])] : p.correct,
      weak: good ? p.weak : { ...p.weak, [q.topic]: (p.weak[q.topic] ?? 0) + 1 },
      badges:
        good && p.correct.length + 1 >= 10 && !p.badges.includes("Quest Starter")
          ? [...p.badges, "Quest Starter"]
          : p.badges,
    }));
  };
  const next = () => {
    setChoice(null);
    setChecked(false);
    setQuestionIndex((n) => n + 1);
  };
  const startModule = (id: string) => {
    setSelectedModule(id);
    setQuestionIndex(0);
    setChoice(null);
    setChecked(false);
    setView("mission");
  };
  const goToQuestion = (q: Question) => {
    const mod = modules.find((m) => m.title === q.module) ?? modules[0];
    const idx = mod.questions.findIndex((mq) => mq.id === q.id);
    setSelectedModule(mod.id);
    setQuestionIndex(idx === -1 ? 0 : idx);
    setChoice(null);
    setChecked(false);
    setView("mission");
  };
  const addXp = useCallback((amount: number) => setPlayer((p) => ({ ...p, xp: p.xp + amount })), []);

  return (
    <main>
      <aside className="sidebar">
        <div className="brand">
          <span className="logo">✦</span>
          <span>
            A&P <b>Quest</b>
          </span>
        </div>
        <nav>
          {(
            [
              ["home", "⌂", "Home"],
              ["missionSelect", "◈", "Missions"],
              ["lab", "⌁", "Practice Lab"],
              ["case", "✚", "Clinical Detective"],
              ["explore", "◎", "Anatomy Explorer"],
              ["review", "↻", "Review weak areas"],
              ["progress", "▥", "My progress"],
            ] as [View, string, string][]
          ).map(([id, icon, label]) => (
            <button key={id} className={view === id ? "nav active" : "nav"} onClick={() => setView(id)}>
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </nav>
        <div className="side-tip">
          <span>⚕</span>
          <p>
            <b>Daily challenge</b>
            <br />
            Find the appendix
            <br />
            <em>+150 XP</em>
          </p>
        </div>
      </aside>
      <section className="mobile-nav">
        <span className="brand">
          <span className="logo">✦</span>A&P Quest
        </span>
        <button onClick={() => setView("home")} aria-label="Home">
          ⌂
        </button>
        <button onClick={() => setView("missionSelect")} aria-label="Missions">
          ◈
        </button>
        <button onClick={() => setView("progress")} aria-label="Progress">
          ▥
        </button>
      </section>
      <div className="content">
        <header>
          <div>
            <p className="eyebrow">BIOS 251 STUDY ADVENTURE</p>
            <h1>
              {view === "home"
                ? "Good to see you, Jordan."
                : view === "mission"
                  ? `${selected.title}: ${selected.subtitle}`
                  : titleFor(view)}
            </h1>
          </div>
          <div className="player-chip">
            <span className="avatar">J</span>
            <div>
              <b>Level {level(player.xp)}</b>
              <small>{levels[level(player.xp) - 1]}</small>
            </div>
            <strong>⚡ {player.xp}</strong>
          </div>
        </header>
        {view === "home" && (
          <Home
            player={player}
            mastery={mastery}
            nextModule={nextModule}
            onStart={() => startModule(nextModule.id)}
            onView={setView}
            onModule={startModule}
          />
        )}
        {view === "missionSelect" && <MissionSelect player={player} onModule={startModule} />}
        {view === "mission" && (
          <Mission
            module={selected}
            question={current}
            index={questionIndex}
            choice={choice}
            checked={checked}
            onAnswer={answer}
            onNext={next}
            onBack={() => setView("missionSelect")}
          />
        )}
        {view === "lab" && <Lab onDone={() => setView("home")} onXp={addXp} />}
        {view === "case" && <Case onXp={addXp} />}
        {view === "explore" && <Explorer />}
        {view === "review" && <Review player={player} onQuestion={goToQuestion} />}
        {view === "progress" && <Progress player={player} mastery={mastery} />}
      </div>
    </main>
  );
}

function titleFor(v: View) {
  const titles: Record<View, string> = {
    home: "",
    missionSelect: "Choose your mission",
    mission: "",
    lab: "Practice Lab",
    case: "Clinical Detective",
    explore: "Anatomy Explorer",
    review: "Let’s strengthen this",
    progress: "Your learning journey",
  };
  return titles[v];
}

function Home({
  player,
  mastery,
  nextModule,
  onStart,
  onView,
  onModule,
}: {
  player: Player;
  mastery: number;
  nextModule: Module;
  onStart: () => void;
  onView: (v: View) => void;
  onModule: (id: string) => void;
}) {
  const nextIndex = modules.findIndex((m) => m.id === nextModule.id);
  return (
    <>
      <div className="hero">
        <div>
          <span className="pill">CURRENT MISSION</span>
          <h2>{nextModule.subtitle}</h2>
          <p>Build your anatomy foundation, then apply it in quick clinical scenarios.</p>
          <button className="primary" onClick={onStart}>
            Continue mission <span>→</span>
          </button>
        </div>
        <div className="hero-art">
          <div className="orbit one">+</div>
          <div className="body-icon">♁</div>
          <div className="orbit two">✦</div>
          <small>
            {nextModule.title.toUpperCase()}
            <br />
            <b>
              {nextIndex + 1} / {modules.length}
            </b>
          </small>
        </div>
      </div>
      <div className="stats">
        <Stat label="TOTAL XP" value={player.xp.toString()} icon="⚡" />
        <Stat label="ANSWER STREAK" value={`${player.streak} correct`} icon="◒" />
        <Stat label="MASTERY" value={`${mastery}%`} icon="◉" />
      </div>
      <div className="grid-section">
        <div className="section-title">
          <div>
            <p className="eyebrow">YOUR QUEST MAP</p>
            <h2>Keep exploring</h2>
          </div>
          <button className="text-button" onClick={() => onView("missionSelect")}>
            See all missions →
          </button>
        </div>
        <div className="module-grid">
          {modules.slice(0, 4).map((m, i) => {
            const pct = moduleMastery(m, player.correct);
            return (
              <button className={`module-card ${m.color}`} onClick={() => onModule(m.id)} key={m.id}>
                <span className="module-number">0{i + 1}</span>
                <span className="module-icon">{m.icon}</span>
                <b>{m.title}</b>
                <small>{m.questions.length} challenges</small>
                <div className="mini-progress">
                  <i style={{ width: `${pct}%` }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="lower-grid">
        <button className="feature-card lab-card" onClick={() => onView("lab")}>
          <span>◈</span>
          <div>
            <p className="eyebrow">PRACTICE LAB</p>
            <h3>Identify. Match. Master.</h3>
            <p>Quick hands-on style challenges for your lab practical.</p>
          </div>
          <b>Try lab rush →</b>
        </button>
        <button className="feature-card review-card" onClick={() => onView("review")}>
          <span>↻</span>
          <div>
            <p className="eyebrow">ADAPTIVE REVIEW</p>
            <h3>Review your weak areas</h3>
            <p>Small wins, targeted to what needs practice.</p>
          </div>
          <b>Build confidence →</b>
        </button>
      </div>
    </>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="stat">
      <span>{icon}</span>
      <div>
        <small>{label}</small>
        <b>{value}</b>
      </div>
    </div>
  );
}

function MissionSelect({ player, onModule }: { player: Player; onModule: (id: string) => void }) {
  return (
    <div className="grid-section">
      <div className="section-title">
        <div>
          <p className="eyebrow">YOUR QUEST MAP</p>
          <h2>Pick a mission</h2>
        </div>
      </div>
      <div className="module-grid">
        {modules.map((m, i) => {
          const pct = moduleMastery(m, player.correct);
          return (
            <button className={`module-card ${m.color}`} onClick={() => onModule(m.id)} key={m.id}>
              <span className="module-number">0{i + 1}</span>
              <span className="module-icon">{m.icon}</span>
              <b>{m.title}</b>
              <small>
                {m.questions.length} challenges · {pct}% mastered
              </small>
              <div className="mini-progress">
                <i style={{ width: `${pct}%` }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Mission({
  module,
  question,
  index,
  choice,
  checked,
  onAnswer,
  onNext,
  onBack,
}: {
  module: (typeof modules)[number];
  question: Question;
  index: number;
  choice: number | null;
  checked: boolean;
  onAnswer: (q: Question, n: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const correct = choice === question.answer;
  return (
    <div className="mission-wrap">
      <button className="back" onClick={onBack}>
        ← Choose another mission
      </button>
      <div className="mission-head">
        <div>
          <span className="pill">MISSION {String(index + 1).padStart(2, "0")}</span>
          <h2>
            {module.title}: {module.subtitle}
          </h2>
        </div>
        <span className="question-count">
          {(index % module.questions.length) + 1} / {module.questions.length}
        </span>
      </div>
      <div className="progress-line">
        <i style={{ width: `${((index % module.questions.length) + 1) / module.questions.length * 100}%` }} />
      </div>
      <article className="question-card">
        <div className="question-top">
          <span className="topic-tag">{question.topic}</span>
          <span>⚡ +{question.xp} XP</span>
        </div>
        <h2>{question.question}</h2>
        <div className="choices">
          {question.options.map((option, n) => (
            <button
              key={option}
              disabled={checked}
              onClick={() => onAnswer(question, n)}
              className={`choice ${
                choice === n ? (n === question.answer ? "correct" : "wrong") : checked && n === question.answer ? "correct" : ""
              }`}
            >
              <span>{"ABCD"[n]}</span>
              {option}
              {checked && n === question.answer && <i>✓</i>}
              {checked && choice === n && n !== question.answer && <i>✕</i>}
            </button>
          ))}
        </div>
        {checked && (
          <div className={correct ? "feedback good" : "feedback gentle"} aria-live="polite">
            <b>{correct ? "Great job! +" + question.xp + " XP" : "Almost there — let’s figure out why."}</b>
            <p>{question.explanation}</p>
            <button className="primary" onClick={onNext}>
              {correct ? "Next challenge" : "Keep going"} →
            </button>
          </div>
        )}
      </article>
    </div>
  );
}

function Lab({ onDone, onXp }: { onDone: () => void; onXp: (amount: number) => void }) {
  const [stationIndex, setStationIndex] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const finished = stationIndex >= labStations.length;
  const station = labStations[Math.min(stationIndex, labStations.length - 1)];

  const choose = (n: number) => {
    if (pick !== null) return;
    setPick(n);
    if (n === station.answer) setCorrectCount((c) => c + 1);
  };
  const advance = () => {
    setPick(null);
    setStationIndex((i) => i + 1);
  };

  if (finished) {
    const xpEarned = correctCount * 20;
    return (
      <div className="complete">
        <span>⌁</span>
        <p className="eyebrow">LAB RUSH COMPLETE</p>
        <h2>
          Practical score: {correctCount} / {labStations.length}
        </h2>
        <p>Nice work moving through the stations — review any misses below before your real lab practical.</p>
        <div>
          <b>
            Accuracy
            <br />
            <strong>{Math.round((correctCount / labStations.length) * 100)}%</strong>
          </b>
          <b>
            Reward
            <br />
            <strong>+{xpEarned} XP</strong>
          </b>
        </div>
        <button
          className="primary"
          style={{ marginTop: 18 }}
          onClick={() => {
            onXp(xpEarned);
            onDone();
          }}
        >
          Finish lab rush →
        </button>
      </div>
    );
  }

  return (
    <div className="lab-wrap">
      <div className="lab-banner">
        <span>⌁</span>
        <div>
          <p className="eyebrow">LAB RUSH</p>
          <h2>{station.title}</h2>
          <p>
            Educational practice only. Add real course images later in <code>data/labStations.ts</code>.
          </p>
        </div>
        <strong>
          {String(stationIndex + 1).padStart(2, "0")} / {String(labStations.length).padStart(2, "0")}
        </strong>
      </div>
      <div className="lab-body">
        {station.visual === "torso" ? (
          <div className="torso">
            <span className="head" />
            <span className="chest">
              ♥<i>THORACIC</i>
            </span>
            <span className="abdomen">
              ●<i>ABDOMINAL</i>
            </span>
            <span className="pelvis">
              ◒<i>PELVIC</i>
            </span>
          </div>
        ) : (
          <div className="info-card">
            <span>◎</span>
            <p className="eyebrow">SPECIMEN NOTES</p>
            <h3>Station {stationIndex + 1}</h3>
            <p>No diagram asset yet for this station — reason it out from the description.</p>
          </div>
        )}
        <div>
          <span className="pill">IDENTIFY</span>
          <h2>{station.prompt}</h2>
          {station.options.map((o, n) => (
            <button
              key={o}
              disabled={pick !== null}
              onClick={() => choose(n)}
              className={`lab-option ${pick === n ? (n === station.answer ? "correct" : "wrong") : ""}`}
            >
              {o}
            </button>
          ))}
          {pick !== null && (
            <div className={pick === station.answer ? "feedback good" : "feedback gentle"} aria-live="polite">
              <b>{pick === station.answer ? "Correct — excellent lab work!" : "Not quite."}</b>
              <p>{station.explanation}</p>
              <button className="primary" onClick={advance}>
                {stationIndex === labStations.length - 1 ? "See practical score" : "Next station"} →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Case({ onXp }: { onXp: (amount: number) => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = caseStudies.find((c) => c.id === activeId) ?? null;

  if (!active) {
    return (
      <div className="review">
        <div className="review-hero">
          <span>✚</span>
          <div>
            <p className="eyebrow">CLINICAL DETECTIVE</p>
            <h2>Choose a case file</h2>
            <p>Work through real anatomy using clinical framing. Educational only — not a diagnostic tool.</p>
          </div>
        </div>
        {caseStudies.map((c) => (
          <button className="review-question" key={c.id} onClick={() => setActiveId(c.id)}>
            <span>⚡ +{c.xp}</span>
            <b>{c.title}</b>
            <small>{c.steps.length} clues →</small>
          </button>
        ))}
      </div>
    );
  }

  return <CaseRunner key={active.id} caseStudy={active} onXp={onXp} onExit={() => setActiveId(null)} />;
}

function CaseRunner({
  caseStudy,
  onXp,
  onExit,
}: {
  caseStudy: CaseStudy;
  onXp: (amount: number) => void;
  onExit: () => void;
}) {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const done = step >= caseStudy.steps.length;
  const current = caseStudy.steps[Math.min(step, caseStudy.steps.length - 1)];

  useEffect(() => {
    if (done) onXp(caseStudy.xp);
    // Deliberately depends only on `done` — it should fire exactly once
    // per case, when its final step is answered.
  }, [done]);

  const choose = (n: number) => {
    if (answer !== null) return;
    setAnswer(n);
    if (n === current.answer) setCorrectCount((c) => c + 1);
  };
  const advance = () => {
    setAnswer(null);
    setStep((s) => s + 1);
  };

  return (
    <div className="case-wrap">
      <button className="back" onClick={onExit}>
        ← Choose another case
      </button>
      <div className="case-intro">
        <span>✚</span>
        <div>
          <p className="eyebrow">EDUCATIONAL CASE STUDY</p>
          <h2>{caseStudy.title}</h2>
          <p>{caseStudy.scenario}</p>
        </div>
        <small>This activity teaches anatomy. It does not provide medical advice or diagnosis.</small>
      </div>
      {!done ? (
        <article className="question-card case-question">
          <span className="pill">
            CLUE {step + 1} OF {caseStudy.steps.length}
          </span>
          <h2>{current.prompt}</h2>
          <div className="choices">
            {current.options.map((o, i) => (
              <button
                key={o}
                disabled={answer !== null}
                onClick={() => choose(i)}
                className={`choice ${
                  answer === i ? (i === current.answer ? "correct" : "wrong") : answer !== null && i === current.answer ? "correct" : ""
                }`}
              >
                <span>{"ABCD"[i]}</span>
                {o}
                {answer !== null && i === current.answer && <i>✓</i>}
              </button>
            ))}
          </div>
          {answer !== null && (
            <div className="feedback good" aria-live="polite">
              <b>{answer === current.answer ? "Excellent clinical thinking!" : "Good attempt — anatomy takes practice."}</b>
              <p>{current.explanation}</p>
              <button className="primary" onClick={advance}>
                {step === caseStudy.steps.length - 1 ? "View result" : "Next clue"} →
              </button>
            </div>
          )}
        </article>
      ) : (
        <div className="complete">
          <span>✦</span>
          <p className="eyebrow">MISSION COMPLETE</p>
          <h2>Case solved</h2>
          <p>You applied clinical anatomy reasoning with confidence.</p>
          <div>
            <b>
              Accuracy
              <br />
              <strong>{Math.round((correctCount / caseStudy.steps.length) * 100)}%</strong>
            </b>
            <b>
              Reward
              <br />
              <strong>+{caseStudy.xp} XP</strong>
            </b>
          </div>
          <button className="primary" style={{ marginTop: 18 }} onClick={onExit}>
            Back to case files →
          </button>
        </div>
      )}
    </div>
  );
}

function Explorer() {
  const [area, setArea] = useState("RLQ");
  const info: Record<string, [string, string]> = {
    RLQ: ["Right Lower Quadrant", "Appendix, cecum, and portions of the small intestine are commonly associated here."],
    RUQ: ["Right Upper Quadrant", "The liver and gallbladder are commonly associated here."],
    LUQ: ["Left Upper Quadrant", "The stomach and spleen are commonly associated here."],
    LLQ: ["Left Lower Quadrant", "The sigmoid colon is commonly associated here."],
  };
  return (
    <div className="explorer">
      <p className="eyebrow">TAP TO EXPLORE</p>
      <h2>Abdominal quadrants</h2>
      <div className="explorer-grid">
        <div className="quadrant-map">
          {Object.keys(info).map((k) => (
            <button className={area === k ? "selected" : ""} onClick={() => setArea(k)} key={k}>
              {k}
            </button>
          ))}
        </div>
        <div className="info-card">
          <span>◎</span>
          <p className="eyebrow">{area}</p>
          <h3>{info[area][0]}</h3>
          <p>{info[area][1]}</p>
          <div className="quick">
            QUICK CHECK: Which quadrant is associated with the appendix?
            <b>Right Lower Quadrant</b>
          </div>
        </div>
      </div>
      <p className="caption">This explorer uses standard anatomical associations. Individual anatomy can vary.</p>
    </div>
  );
}

function Review({ player, onQuestion }: { player: Player; onQuestion: (q: Question) => void }) {
  const weak = Object.entries(player.weak).sort((a, b) => b[1] - a[1]);
  const picks = weak.length ? allQuestions.filter((q) => q.topic === weak[0][0]).slice(0, 3) : instructorQuestions.slice(0, 3);
  return (
    <div className="review">
      <div className="review-hero">
        <span>↻</span>
        <div>
          <p className="eyebrow">ADAPTIVE PRACTICE</p>
          <h2>{weak.length ? weak[0][0] : "Ready for a warm-up?"}</h2>
          <p>
            {weak.length
              ? "This topic deserves another pass. You’ve got this."
              : "Answer a few instructor-aligned questions to discover your first review path."}
          </p>
        </div>
      </div>
      {picks.map((q) => (
        <button className="review-question" key={q.id} onClick={() => onQuestion(q)}>
          <span>⚡ +{q.xp}</span>
          <b>{q.question}</b>
          <small>{q.week ? `Instructor material · Week ${q.week}` : q.module} →</small>
        </button>
      ))}
    </div>
  );
}

function Progress({ player, mastery }: { player: Player; mastery: number }) {
  const futureBadges = ["Body Plane Explorer", "Cavity Commander", "Quadrant Detective"];
  const shelf = [
    ...player.badges.map((name) => ({ name, unlocked: true })),
    ...futureBadges.filter((name) => !player.badges.includes(name)).map((name) => ({ name, unlocked: false })),
  ];
  return (
    <div className="progress-page">
      <div className="mastery-card">
        <div className="ring">
          <span>{mastery}%</span>
        </div>
        <div>
          <p className="eyebrow">OVERALL MASTERY</p>
          <h2>You’re building real momentum.</h2>
          <p>
            {player.correct.length} correct answers and {player.xp} XP earned.
          </p>
        </div>
      </div>
      <div className="section-title">
        <div>
          <p className="eyebrow">BADGE SHELF</p>
          <h2>Achievements</h2>
        </div>
      </div>
      <div className="badges">
        {shelf.map((b) => (
          <div className={b.unlocked ? "badge unlocked" : "badge"} key={b.name}>
            <span>{b.unlocked ? "✦" : "◇"}</span>
            <b>{b.name}</b>
            <small>{b.unlocked ? "Unlocked" : "Keep questing"}</small>
          </div>
        ))}
      </div>
      <div className="progress-modules">
        <p className="eyebrow">CURRICULUM PROGRESS</p>
        {modules.map((m) => {
          const pct = moduleMastery(m, player.correct);
          return (
            <div key={m.id}>
              <b>{m.title}</b>
              <span>
                <i style={{ width: `${pct}%` }} />
              </span>
              <small>{pct}%</small>
            </div>
          );
        })}
      </div>
      <div className="source-note">
        <b>Course content status</b>
        <p>
          Generic content powers the foundation. Week 1–3 questions from your supplied BIOS 251 lectures live in{" "}
          <code>data/courseContent/instructor.ts</code> and are clearly labeled as instructor material.
        </p>
      </div>
    </div>
  );
}
