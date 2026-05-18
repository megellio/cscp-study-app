'use client';

import React, { useState, useEffect, useMemo } from "react";

// ===================== CSCP SYSTEM (EXAM-LEVEL QUESTIONS) =====================
// ✅ Variable scenarios
// ✅ Variable correct answers
// ✅ Trick/distractor answers


const topics = ["S&OP","Inventory","Logistics","Risk"];

// ---------- ADVANCED QUESTION GENERATOR ----------
const buildStudyBank = () => {


  const scenarios = {
    "S&OP": [
      "Forecasts exceed actual demand",
      "Production cannot meet demand peaks",
      "Sales and operations plans conflict",
      "Inventory imbalances across regions",
      "Financial plans misaligned with supply plans"
    ],


    "Inventory": [
      "Stockouts are increasing",
      "Inventory costs are rising",
      "Demand variability is high",
      "Lead times are unstable",
      "Warehouse capacity is constrained"
    ],


    "Logistics": [
      "Late deliveries increasing",
      "Freight costs rising",
      "Customer complaints rising",
      "Global shipping delays",
      "Inefficient distribution network"
    ],


    "Risk": [
      "Supplier in unstable region",
      "Frequent supply disruptions",
      "Single-source dependency",
      "Natural disaster exposure",
      "Geopolitical instability"
    ]
  };


  const strategies = [
    { text: "Increase inventory buffers", correctFor: ["Inventory"] },
    { text: "Improve cross-functional coordination", correctFor: ["S&OP"] },
    { text: "Implement dual sourcing", correctFor: ["Risk"] },
    { text: "Use blended transportation strategy", correctFor: ["Logistics"] },
    { text: "Reduce planning frequency", correctFor: [] },
    { text: "Increase order quantities", correctFor: [] }
  ];


  return topics.flatMap(topic =>
    Array.from({ length: 30 }, (_, i) => {


      const scenario = scenarios[topic][i % scenarios[topic].length];


      // shuffle options
      const shuffled = [...strategies].sort(() => Math.random() - 0.5).slice(0,4);


      // find correct answer
      const correctIndex = shuffled.findIndex(s => s.correctFor.includes(topic));


      return {
        id: `${topic}-${i}`,
        topic,
        question: `(${topic}) Scenario ${i + 1}: ${scenario}. What is the BEST action?`,
        options: shuffled.map(s => s.text),
        answer: correctIndex,
        explanation: `Best answer aligns with ${topic} principle: ${shuffled[correctIndex]?.text || "coordination strategy"}.`
      };


    })
  );
};

const studyQuestions = buildStudyBank();

// ---------- EXAM BANK ----------
const examQuestions = Array.from({ length: 150 }, (_, i) => {
  const topic = topics[i % topics.length];


  const options = [
    "Increase inventory",
    "Improve coordination",
    "Change supplier",
    "Reduce forecasts"
  ].sort(() => Math.random() - 0.5);
  const answerMap = {
    "S&OP": "Improve coordination",
    "Inventory": "Increase inventory",
    "Logistics": "Improve coordination",
    "Risk": "Change supplier"
  };


  const correct = options.indexOf(answerMap[topic]);


  return {
    id: i,
    topic,
    question: `Exam Scenario #${i+1}: A supply chain must balance cost, service, and risk with conflicting objectives. What is the BEST action?`,
    options,
    answer: correct
  };
});


export default function Page() {

  const [mode,setMode]=useState("study");
  const [module,setModule]=useState("All");

  const [current,setCurrent]=useState(0);
  const [selected,setSelected]=useState(null);
  const [answers,setAnswers]=useState({});

  const [flagged,setFlagged]=useState({});
  const [submitted,setSubmitted]=useState(false);

  const [time,setTime]=useState(210*60);

  useEffect(()=>{
    if(mode!=="exam"||submitted) return;
    const t=setInterval(()=>setTime(t=>t-1),1000);
    return ()=>clearInterval(t);
  },[mode,submitted]);

  const studyFiltered = useMemo(()=>{
    if(module==="All") return studyQuestions;
    return studyQuestions.filter(q=>q.topic===module);
  },[module]);

  const reviewQuestions = examQuestions.filter((q,i)=>answers[i]!==undefined && answers[i]!==q.answer);
  const active = mode==="exam"?examQuestions:mode==="review"?reviewQuestions:studyFiltered;
  const q = active[current];

  const answerQ=(i)=>{
    setSelected(i);
    if(mode!=="study"){
      setAnswers(prev=>({...prev,[current]:i}));
    }
  };

  const next=()=>{
    setCurrent(c=>c+1);
    setSelected(null);
  };

  const toggleFlag=()=>{
    setFlagged(prev=>({...prev,[current]:!prev[current]}));
  };

  const score = Object.keys(answers).filter(i=>answers[i]===examQuestions[i]?.answer).length;

  const fmt=t=>`${Math.floor(t/3600)}:${Math.floor((t%3600)/60).toString().padStart(2,"0")}`;

  const progress = topics.map(t=>{
    const total = examQuestions.filter(q=>q.topic===t).length;
    const correct = examQuestions.filter(q=>answers[q.id]===q.answer && q.topic===t).length;
    return {topic:t,pct:Math.round((correct/(total||1))*100)};
  });

  return (
    <div style={{padding:20,maxWidth:600,margin:"auto"}}>


      <h2>CSCP Elite Prep System 🚀</h2>


      <div style={{display:"flex",gap:6}}>
        <button onClick={()=>{setMode("study");setCurrent(0)}}>Study</button>
        <button onClick={()=>{setMode("review");setCurrent(0)}}>Review</button>
        <button onClick={()=>{setMode("exam");setCurrent(0)}}>Exam</button>
      </div>

      <div>
        {progress.map(p=>(
          <p key={p.topic}>{p.topic}: {p.pct}%</p>
        ))}
      </div>

      {mode==="study" && (
        <select onChange={(e)=>{setModule(e.target.value);setCurrent(0)}}>
          <option>All</option>
          {topics.map(t=><option key={t}>{t}</option>)}
        </select>
      )}

      {mode==="exam" && !submitted && <p>Time: {fmt(time)}</p>}
      {q && !submitted && (
        <div>
          <p>{q.question}</p>

          {q.options.map((o,i)=>(
            <button key={i}
              onClick={()=>answerQ(i)}
              disabled={mode==="exam"&&answers[current]!=undefined}
              style={{display:"block",margin:5,
              background: mode!=="exam"&&selected!==null
                ? i===q.answer?"green":i===selected?"red":"#eee"
                : "#eee"}}
            >{o}</button>
          ))}

          {mode!=="exam"&&selected!==null && <p>{q.explanation}</p>}

          <button onClick={()=>setCurrent(Math.max(0,current-1))}>Prev</button>
          <button onClick={()=>setCurrent(Math.min(active.length-1,current+1))}>Next</button>
          {mode==='exam'&&<button onClick={toggleFlag}>Flag</button>}
        </div>
      )}

      {mode==='exam'&&submitted && (
        <div>
          <h3>Score: {score}/150</h3>
        </div>
      )}

    </div>
  );
}
