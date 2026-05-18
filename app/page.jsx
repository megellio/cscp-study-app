'use client';

import React, { useState, useEffect, useMemo } from "react";
// ===================== COMPLETE CSCP SYSTEM =====================
// ✅ Study modules
// ✅ Progress dashboard
// ✅ Review mistakes
// ✅ Exam simulator (150 questions + timer + flagging)
// ✅ Progress tracking


const topics = ["S&OP","Inventory","Logistics","Risk"];

// ---------------- STUDY BANK ----------------
const studyQuestions = [
  {
    topic: "S&OP",
    question: "Demand and supply are misaligned across departments. What is the BEST action?",
    options: ["Increase inventory","Reduce production","Implement S&OP","Ignore forecasts"],
    answer: 2,
    explanation: "S&OP aligns demand, supply, and financial plans across functions."
  },
  {
    topic: "Inventory",
    question: "Stockouts occur due to variability. What is the BEST solution?",
    options: ["Lower reorder point","Increase safety stock","Stop ordering","Ignore demand"],
    answer: 1,
    explanation: "Safety stock protects against variability and maintains service levels."
  }
];

// ---------------- EXAM BANK ----------------
const examQuestions = Array.from({ length: 150 }, (_, i) => ({
  id: i,
  topic: topics[i % topics.length],
  question: `Exam Scenario #${i+1}: A company must balance cost, service, and risk across its supply chain. What is the BEST action?`,
  options: [
    "Increase inventory",
    "Improve coordination",
    "Change supplier",
    "Reduce forecast frequency"
  ],
  answer: 1
}));

export default function Page() {

  const [mode,setMode]=useState("study");
  const [module,setModule]=useState("All");
  const [current,setCurrent]=useState(0);
  const [selected,setSelected]=useState(null);
  const [answers,setAnswers]=useState({});
  const [flagged,setFlagged]=useState({});
  const [submitted,setSubmitted]=useState(false);


  const [time,setTime]=useState(210*60);

  // ---------- TIMER ----------
  useEffect(()=>{
    if(mode !== "exam" || submitted) return;
    const t = setInterval(()=>setTime(t=>t-1),1000);
    return ()=>clearInterval(t);
  },[mode,submitted]);


  // ---------- FILTER STUDY MODULE ----------
  const studyFiltered = useMemo(()=>{
    if(module === "All") return studyQuestions;
    return studyQuestions.filter(q=>q.topic === module);
  },[module]);


  // ---------- REVIEW MODE ----------
  const reviewQuestions = examQuestions.filter((q,i)=>
    answers[i] !== undefined && answers[i] !== q.answer
  );


  const active =
    mode === "exam" ? examQuestions :
    mode === "review" ? reviewQuestions :
    studyFiltered;


  const q = active[current];


  // ---------- ANSWER ----------
  const answerQ=(i)=>{
    setSelected(i);


    if(mode === "exam" || mode === "review"){
      setAnswers(prev => ({ ...prev, [current]: i }));
    }
  };


  const next=()=>{
    setCurrent(c=>c+1);
    setSelected(null);
  };

  const toggleFlag=()=>{
    setFlagged(prev => ({...prev,[current]:!prev[current]}));
  };

  const score = Object.keys(answers).filter(i=>answers[i]===examQuestions[i]?.answer).length;

  const fmt=t=>`${Math.floor(t/3600)}:${Math.floor((t%3600)/60).toString().padStart(2,"0")}`;


  // ---------- PROGRESS DASHBOARD ----------
  const progress = topics.map(t => {
    const total = examQuestions.filter(q=>q.topic===t).length;
    const correct = examQuestions.filter(q=>answers[q.id]===q.answer && q.topic===t).length;
    return {
      topic: t,
      pct: Math.round((correct/(total||1))*100)
    };
  });

  return (
    <div style={{padding:20,maxWidth:550,margin:"auto",fontFamily:"Arial"}}>


      <h2>CSCP Master Study System 🚀</h2>


      {/* MODE BUTTONS */}
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>{setMode("study");setCurrent(0)}}>Study</button>
        <button onClick={()=>{setMode("review");setCurrent(0)}}>Review</button>
        <button onClick={()=>{setMode("exam");setCurrent(0)}}>Exam</button>
      </div>


      {/* DASHBOARD */}
      <div style={{marginTop:10}}>
        <h4>Progress Dashboard</h4>
        {progress.map(p=>(
          <p key={p.topic}>
            {p.topic}: {p.pct}%
          </p>
        ))}
      </div>


      {/* MODULE SELECT (Study only) */}
      {mode === "study" && (
        <select onChange={(e)=>{setModule(e.target.value);setCurrent(0)}}>
          <option>All</option>
          {topics.map(t=><option key={t}>{t}</option>)}
        </select>
      )}


      {/* EXAM CONFIG */}
      {mode === "exam" && !submitted && (
        <p>Time: {fmt(time)} | Score: {score}/150</p>
      )}


      {/* NAV GRID (Exam) */}
      {mode === "exam" && !submitted && (
        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
          {examQuestions.map((_,i)=>(
            <button key={i}
              onClick={()=>setCurrent(i)}
              style={{width:28,height:28,
                background: flagged[i] ? "orange" : answers[i]!==undefined ? "#4caf50" : "#eee"}}
            >{i+1}</button>
          ))}
        </div>
      )}


      {/* QUESTION UI */}
      {q && !submitted && (
        <div style={{marginTop:15,padding:15,background:"#fff",borderRadius:8}}>


          <p><b>Q{current+1} ({q.topic})</b></p>
          <p>{q.question}</p>


          {q.options.map((o,i)=>(
            <button key={i}
              onClick={()=>answerQ(i)}
              disabled={mode === "exam" && answers[current]!=undefined}
              style={{display:"block",width:"100%",margin:"6px 0",padding:10,
              background:
                mode === "study" && selected!==null
                  ? i===q.answer
                    ? "#4caf50"
                    : i===selected
                    ? "#f44336"
                    : "#eee"
                  : mode === "review" && selected!==null
                  ? i===q.answer
                    ? "#4caf50"
                    : i===selected
                    ? "#f44336"
                    : "#eee"
                  : "#eee"}}
            >
              {o}
            </button>
          ))}


          {/* EXPLANATION */}
          {mode !== "exam" && selected!==null && (
            <p><b>Explanation:</b> {q.explanation || "Review the concept."}</p>
          )}

          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setCurrent(Math.max(0,current-1))}>Prev</button>
            <button onClick={()=>setCurrent(Math.min(active.length-1,current+1))}>Next</button>
            {mode === "exam" && (
              <button onClick={toggleFlag}>{flagged[current]?"Unflag":"Flag"}</button>
            )}
          </div>

          {mode === "exam" && (
            <button onClick={()=>setSubmitted(true)} style={{marginTop:10,background:"red",color:"white"}}>
              Submit Exam
            </button>
          )}


        </div>
      )}

      {/* RESULTS */}
      {mode === "exam" && submitted && (
        <div>
          <h3>Exam Results</h3>
          <p>Score: {score}/150</p>


          <h4>Weak Topics</h4>
          {progress.map(p=>(
            <p key={p.topic}>{p.topic}: {p.pct}%</p>
          ))}


          <h4>Review</h4>
          {examQuestions.map((q,i)=>(
            <p key={i}>Q{i+1}: {answers[i]===q.answer ? "✅" : "❌"}</p>
          ))}
        </div>
      )}

    </div>
  );
}
