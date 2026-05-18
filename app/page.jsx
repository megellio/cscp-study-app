'use client';

import React, { useState, useEffect } from "react";

// ===================== FULL CSCP APP (STUDY + REAL EXAM) =====================
const topics = ["S&OP","Inventory","Logistics","Risk"];

// ✅ STUDY QUESTIONS (with explanations)
const studyQuestions = [
  {
    topic: "S&OP",
    question: "Demand and supply are misaligned. What is the BEST action?",
    options: ["Increase inventory","Reduce production","Implement S&OP","Ignore forecasts"],
    answer: 2,
    explanation: "S&OP aligns cross-functional planning."
  },
  {
    topic: "Inventory",
    question: "Stockouts due to variability. Best action?",
    options: ["Lower ROP","Increase safety stock","Stop ordering","Ignore demand"],
    answer: 1,
    explanation: "Safety stock protects variability."
  }
];


// ✅ EXAM QUESTIONS (NO EXPLANATIONS)
const examQuestions = Array.from({ length: 150 }, (_, i) => ({
  id: i,
  topic: topics[i % topics.length],
  question: `Exam Scenario #${i+1}: A company must balance cost, service, and risk. What is the BEST action?`,
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


  // SHARED
  const [current,setCurrent]=useState(0);
  const [selected,setSelected]=useState(null);
  const [answers,setAnswers]=useState({});


  // EXAM ONLY
  const [flagged,setFlagged]=useState({});
  const [submitted,setSubmitted]=useState(false);
  const [time,setTime]=useState(210*60);

  const active = mode === "exam" ? examQuestions : studyQuestions;
  const q = active[current];
  // TIMER
  useEffect(()=>{
    if(mode!=="exam" || submitted) return;
    const t=setInterval(()=>setTime(t=>t-1),1000);
    return ()=>clearInterval(t);
  },[mode,submitted]);
  const answerQ=(i)=>{
    setSelected(i);
    if(mode === "exam"){
      setAnswers(prev => ({ ...prev, i }));
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
  // ✅ ANALYTICS
  const analytics = topics.map(t => {
    const qs = examQuestions.filter(q=>q.topic===t);
    const correct = qs.filter(q=>answers[q.id]===q.answer).length;
    return { topic: t, correct, total: qs.length };
  });

  return (
    <div style={{padding:20,maxWidth:500,margin:"auto",fontFamily:"Arial"}}>
      <h2>CSCP Study + Exam System 🚀</h2>
      {/* MODE SWITCH */}
      <div style={{display:"flex",gap:10}}>
        <button onClick={()=>{setMode("study");setCurrent(0)}}>Study</button>
        <button onClick={()=>{setMode("exam");setCurrent(0)}}>Exam</button>
      </div>
      {/* ---------------- STUDY MODE ---------------- */}
      {mode === "study" && q && (
        <div style={{marginTop:15,padding:15,background:"#fff",borderRadius:8}}>
          <p><b>Q{current+1} ({q.topic})</b></p>
          <p>{q.question}</p>
          {q.options.map((o,i)=>(
            <button key={i}
              onClick={()=>answerQ(i)}
              style={{display:"block",width:"100%",margin:"6px 0",padding:10,
              background:
                selected!==null
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
          {selected!==null && (
            <p><b>Explanation:</b> {q.explanation}</p>
          )}
          <button onClick={next}>Next</button>
        </div>
      )}


      {/* ---------------- EXAM MODE ---------------- */}
      {mode === "exam" && !submitted && (
        <>
          <p>Time: {fmt(time)}</p>


          {/* NAV GRID */}
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {examQuestions.map((_,i)=>(
              <button key={i}
                onClick={()=>setCurrent(i)}
                style={{width:30,height:30,
                  background: flagged[i] ? "orange" : answers[i]!==undefined ? "#4caf50" : "#eee"}}
              >
                {i+1}
              </button>
            ))}
          </div>

          {/* QUESTION */}
          {q && (
            <div style={{marginTop:15,padding:15,background:"#fff",borderRadius:8}}>
              <p><b>Q{current+1} ({q.topic})</b></p>
              <p>{q.question}</p>
              {q.options.map((o,i)=>(
                <button key={i}
                  onClick={()=>answerQ(i)}
                  disabled={answers[current]!=undefined}
                  style={{display:"block",width:"100%",margin:"6px 0",padding:10,
                  background: answers[current]===i ? "#bbb" : "#eee"}}
                >
                  {o}
                </button>
              ))}
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setCurrent(Math.max(0,current-1))}>Prev</button>
                <button onClick={()=>setCurrent(Math.min(149,current+1))}>Next</button>
                <button onClick={toggleFlag}>{flagged[current]?"Unflag":"Flag"}</button>
              </div>
              <button onClick={()=>setSubmitted(true)} style={{marginTop:10,color:"white",background:"red"}}>
                Submit Exam
              </button>

            </div>
          )}
        </>
      )}

      {/* ---------------- RESULTS ---------------- */}
      {mode === "exam" && submitted && (
        <div>
          <h3>Results</h3>
          <p>Score: {score}/150</p>
          <h4>Weak Topics</h4>
          {analytics.map(a=>{
            const pct = Math.round((a.correct/(a.total||1))*100);
            return <p key={a.topic}>{a.topic}: {pct}%</p>
          })}
          <h4>Review</h4>
          {examQuestions.map((q,i)=>(
            <p key={i}>
              Q{i+1}: {answers[i]===q.answer ? "✅" : "❌"}
            </p>
          ))}
        </div>
      )}

    </div>
  );
}
