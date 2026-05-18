'use client';

import React, { useState, useMemo, useEffect } from "react";

const topics = ["S&OP","Inventory","Logistics","Risk"];

// ✅ GENERATE 150 EXAM QUESTIONS
const examQuestions = Array.from({ length: 150 }, (_, i) => ({
  id: i,
  topic: topics[i % topics.length],
  question: `Exam Scenario #${i+1}:

A company must balance cost, service, and risk across its supply chain while facing variability and constraints.

What is the BEST action?`,
  options: [
    "Increase inventory",
    "Improve cross-functional coordination",
    "Change suppliers immediately",
    "Reduce forecast updates"
  ],
  answer: 1
}));

export default function Page() {

  const [mode,setMode]=useState("study");

  // ✅ EXAM STATE
  const [current,setCurrent]=useState(0);
  const [answers,setAnswers]=useState({});
  const [flagged,setFlagged]=useState({});
  const [submitted,setSubmitted]=useState(false);

  // ✅ TIMER (3.5 hours)
  const [time,setTime]=useState(210*60);

  useEffect(()=>{
    if(mode!=="exam" || submitted) return;
    const t=setInterval(()=>setTime(t=>t-1),1000);
    return ()=>clearInterval(t);
  },[mode,submitted]);

  const q = examQuestions[current];

  // ✅ SELECT ANSWER (LOCKED PER QUESTION)
  const answerQ=(i)=>{
    setAnswers(prev => ({ ...prev, [current]: i }));
  };

  // ✅ FLAG QUESTION
  const toggleFlag=()=>{
    setFlagged(prev => ({
      ...prev,
      [current]: !prev[current]
    }));
  };

  // ✅ SCORE
  const score = Object.keys(answers)
    .filter(i=>answers[i]===examQuestions[i]?.answer).length;

  const fmt = t =>
    `${Math.floor(t/3600)}:${Math.floor((t%3600)/60).toString().padStart(2,"0")}`;

  return (
    <div style={{padding:20,maxWidth:500,margin:"auto",fontFamily:"Arial"}}>

      <h2>CSCP FULL EXAM MODE 🚀</h2>

      <button onClick={()=>setMode("exam")}>Start Exam</button>

      {mode==="exam" && !submitted && (
        <>
          <p>Time Remaining: {fmt(time)}</p>

          {/* ✅ NAV GRID */}
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {examQuestions.map((_,i)=>(
              <button key={i}
                onClick={()=>setCurrent(i)}
                style={{
                  width:30,height:30,
                  background:
                    flagged[i] ? "#ff9800" :
                    answers[i]!==undefined ? "#4caf50" :
                    "#eee"
                }}
              >
                {i+1}
              </button>
            ))}
          </div>

          {/* ✅ QUESTION CARD */}
          <div style={{marginTop:15,padding:15,background:"#fff",borderRadius:8,boxShadow:"0 2px 6px rgba(0,0,0,0.1)"}}>
            <p><b>Q{current+1} ({q.topic})</b></p>
            <p style={{whiteSpace:"pre-line"}}>{q.question}</p>

            {q.options.map((o,i)=>(
              <button key={i}
                onClick={()=>answerQ(i)}
                style={{
                  display:"block",
                  width:"100%",
                  margin:"6px 0",
                  padding:10,
                  background: answers[current]===i ? "#bbb" : "#eee"
                }}
              >
                {o}
              </button>
            ))}

            {/* ✅ CONTROL BUTTONS */}
            <div style={{display:"flex",gap:10,marginTop:10}}>
              <button onClick={()=>setCurrent(Math.max(0,current-1))}>Prev</button>
              <button onClick={()=>setCurrent(Math.min(examQuestions.length-1,current+1))}>Next</button>
              <button onClick={toggleFlag}>
                {flagged[current] ? "Unflag" : "Flag"}
              </button>
            </div>

            <button
              style={{marginTop:10,background:"#f44336",color:"#fff"}}
              onClick={()=>setSubmitted(true)}
            >
              Submit Exam
            </button>

          </div>
        </>
      )}

      {/* ✅ RESULTS SCREEN */}
      {submitted && (
        <div>
          <h3>Exam Results</h3>
          <p>Score: {score}/{examQuestions.length}</p>

          <h4>Flagged Questions</h4>
          {Object.keys(flagged).filter(i=>flagged[i]).map(i=>(
            <p key={i}>Q{Number(i)+1}</p>
          ))}
        </div>
      )}

    </div>
  );
}
