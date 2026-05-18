'use client';

import React, { useState, useEffect, useMemo } from "react";

const topics = ["S&OP","Inventory","Logistics","Risk"];

// ---------- STUDY BANK ----------
const buildStudyBank = () => {
  const scenarios = {
    "S&OP": [
      "Forecasts exceed demand",
      "Capacity cannot meet demand",
      "Sales and operations misaligned",
      "Inventory imbalance across regions",
      "Financial mismatch with supply"
    ],
    "Inventory": [
      "Stockouts increasing",
      "Carrying costs rising",
      "Demand variability high",
      "Lead time instability",
      "Warehouse constraints"
    ],
    "Logistics": [
      "Late deliveries",
      "High freight costs",
      "Customer complaints",
      "Global delays",
      "Poor distribution network"
    ],
    "Risk": [
      "Supplier disruption",
      "Single-source risk",
      "Geopolitical instability",
      "Natural disaster exposure",
      "Supply continuity issues"
    ]
  };

  const strategies = [
    { text: "Increase safety stock", correctFor: ["Inventory"] },
    { text: "Align cross-functional planning", correctFor: ["S&OP"] },
    { text: "Implement dual sourcing", correctFor: ["Risk"] },
    { text: "Use blended transportation", correctFor: ["Logistics"] },
    { text: "Reduce planning", correctFor: [] },
    { text: "Increase batch sizes", correctFor: [] }
  ];

  return topics.flatMap(topic =>
    Array.from({ length: 30 }, (_, i) => {
      const scenario = scenarios[topic][i % scenarios[topic].length];
      const opts = [...strategies].sort(() => Math.random() - 0.5).slice(0, 4);
      const correctIndex = opts.findIndex(o => o.correctFor.includes(topic));

      return {
        id: `${topic}-${i}`,
        topic,
        question: `${scenario}. What is the BEST action?`,
        options: opts.map(o => o.text),
        answer: correctIndex,
        explanation: `${topic} issues are best addressed by ${opts[correctIndex]?.text || "cross-functional alignment"}.`
      };
    })
  );
};

const studyQuestions = buildStudyBank();

// ---------- EXAM BANK ----------
const examQuestions = Array.from({ length: 150 }, (_, i) => {
  const topic = topics[i % topics.length];

  const baseOptions = [
    "Increase safety stock",
    "Align cross-functional planning",
    "Switch supplier",
    "Reduce forecasting"
  ].sort(() => Math.random() - 0.5);

  const correctMap = {
    "S&OP": "Align cross-functional planning",
    "Inventory": "Increase safety stock",
    "Logistics": "Align cross-functional planning",
    "Risk": "Switch supplier"
  };

  return {
    id: i,
    topic,
    question: `Scenario ${i+1}: Supply chain tradeoffs between cost, service, and risk must be resolved. What is the BEST action?`,
    options: baseOptions,
    answer: baseOptions.indexOf(correctMap[topic])
  };
});

export default function Page() {

  const [mode,setMode]=useState("study");
  const [module,setModule]=useState("All");

  const [current,setCurrent]=useState(0);
  const [answers,setAnswers]=useState({});

  const [flagged,setFlagged]=useState({});
  const [submitted,setSubmitted]=useState(false);
  const [time,setTime]=useState(210*60);

  // TIMER
  useEffect(()=>{
    if(mode !== "exam" || submitted) return;
    const t=setInterval(()=>setTime(t=>t-1),1000);
    return ()=>clearInterval(t);
  },[mode,submitted]);

  // FILTERS
  const studyFiltered = useMemo(()=>{
    return module === "All"
      ? studyQuestions
      : studyQuestions.filter(q=>q.topic===module);
  },[module]);

  const reviewQuestions = useMemo(()=>{
    return examQuestions.filter((q,i)=>answers[i]!==undefined && answers[i]!==q.answer);
  },[answers]);

  const active =
    mode === "exam" ? examQuestions :
    mode === "review" ? reviewQuestions :
    studyFiltered;

  const q = active[current];

  // ANSWER HANDLER
  const handleAnswer = (i) => {

    if(mode === "exam"){
      if(answers[current] !== undefined) return;
      setAnswers(prev => ({...prev, [current]: i}));
      return;
    }

    // Study + review
    setAnswers(prev => ({...prev, [current]: i}));
  };

  // NAV
  const goNext = () => setCurrent(c => Math.min(active.length-1, c+1));
  const goPrev = () => setCurrent(c => Math.max(0, c-1));

  const toggleFlag = () => {
    setFlagged(prev => ({...prev, [current]: !prev[current]}));
  };

  const score = Object.keys(answers).filter(i=>answers[i]===examQuestions[i]?.answer).length;

  const fmt = t=>`${Math.floor(t/3600)}:${Math.floor((t%3600)/60).toString().padStart(2,"0")}`;

  // DASHBOARD
  const progress = topics.map(topic => {
    const total = examQuestions.filter(q=>q.topic===topic).length;
    const correct = examQuestions.filter(q=>answers[q.id]===q.answer && q.topic===topic).length;
    return {topic, pct: Math.round((correct/(total||1))*100)};
  });

  return (
    <div style={{padding:20,maxWidth:600,margin:"auto"}}>

      <h2>CSCP Prep System ✅</h2>

      {/* MODES */}
      <div style={{display:"flex",gap:6}}>
        <button onClick={()=>{setMode("study");setCurrent(0)}}>Study</button>
        <button onClick={()=>{setMode("review");setCurrent(0)}}>Review</button>
        <button onClick={()=>{setMode("exam");setCurrent(0)}}>Exam</button>
      </div>

      {/* DASHBOARD */}
      <div>
        {progress.map(p=>(<p key={p.topic}>{p.topic}: {p.pct}%</p>))}
      </div>

      {/* MODULE */}
      {mode === "study" && (
        <select onChange={(e)=>{setModule(e.target.value);setCurrent(0)}}>
          <option>All</option>
          {topics.map(t=><option key={t}>{t}</option>)}
        </select>
      )}

      {/* EXAM HEADER */}
      {mode === "exam" && !submitted && (
        <p>Time: {fmt(time)} | Score: {score}/150</p>
      )}

      {/* NAV GRID */}
      {mode === "exam" && !submitted && (
        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
          {examQuestions.map((_,i)=>(
            <button key={i}
              onClick={()=>setCurrent(i)}
              style={{
                width:24,height:24,
                background: flagged[i] ? "orange" :
                           answers[i]!==undefined ? "green" : "#eee"
              }}
            >{i+1}</button>
          ))}
        </div>
      )}

      {/* QUESTION */}
      {q && !submitted && (
        <div>

          <p><b>Q{current+1}</b> ({q.topic})</p>
          <p>{q.question}</p>

          {q.options.map((o,i)=>(
            <button key={i}
              onClick={()=>handleAnswer(i)}
              style={{
                display:"block",
                margin:"6px 0",
                width:"100%",
                padding:"10px",
                background:
                  mode !== "exam" && answers[current] !== undefined
                    ? i === q.answer
                      ? "#4caf50"
                      : i === answers[current]
                      ? "#f44336"
                      : "#eee"
                    : answers[current] === i
                    ? "#ccc"
                    : "#eee"
              }}
            >
              {o}
            </button>
          ))}

          {/* Explanation */}
          {mode !== "exam" && answers[current] !== undefined && (
            <p><b>Explanation:</b> {q.explanation}</p>
          )}

          <div style={{display:"flex",gap:6}}>
            <button onClick={goPrev}>Prev</button>
            <button onClick={goNext}>Next</button>
            {mode === "exam" && <button onClick={toggleFlag}>Flag</button>}
          </div>

          {mode === "exam" && (
            <button onClick={()=>setSubmitted(true)} style={{marginTop:10}}>
              Submit Exam
            </button>
          )}

        </div>
      )}

      {/* RESULTS */}
      {mode === "exam" && submitted && (
        <div>
          <h3>Score: {score}/150</h3>
        </div>
      )}

    </div>
  );
}
