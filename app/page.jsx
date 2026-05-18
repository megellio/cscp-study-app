'use client';

import React, { useState, useMemo, useEffect } from "react";

const topics = ["S&OP","Inventory","Logistics","Risk"];

// ---- BASE QUESTIONS ----
const baseQuestions = [
  {
    topic: "S&OP",
    q: "Demand and supply plans are misaligned. What is the BEST action?",
    opts: ["Increase inventory","Reduce production","Implement S&OP","Ignore forecasts"],
    a: 2,
    e: "S&OP aligns demand and supply across functions."
  },
  {
    topic: "Inventory",
    q: "Stockouts are occurring due to demand variability. What is the BEST action?",
    opts: ["Lower ROP","Increase safety stock","Stop ordering","Ignore demand"],
    a: 1,
    e: "Safety stock protects against demand uncertainty."
  },
  {
    topic: "Logistics",
    q: "Customer complaints due to slow delivery. Best option?",
    opts: ["Air only","Blended transport","Increase inventory","Reduce shipments"],
    a: 1,
    e: "Blended transport balances cost and speed."
  },
  {
    topic: "Risk",
    q: "Supplier disruption risk detected. Best mitigation?",
    opts: ["Increase orders","Dual sourcing","Reduce stock","Change route"],
    a: 1,
    e: "Dual sourcing improves resilience."
  }
];

// ---- GENERATE 300 QUESTIONS ----
const questionBank = Array.from({ length: 300 }, (_, i) => {
  const base = baseQuestions[i % baseQuestions.length];
  return {
    topic: base.topic,
    question: `${base.q} (#${i+1})`,
    options: base.opts,
    answer: base.a,
    explanation: base.e
  };
});

export default function Page() {

  const [topicFilter,setTopicFilter]=useState("All");
  const [current,setCurrent]=useState(0);
  const [answers,setAnswers]=useState({});
  const [show,setShow]=useState(false);
  const [mistakes,setMistakes]=useState([]);

  // LOAD SAVED PROGRESS
  useEffect(()=>{
    const saved = localStorage.getItem("cscp-progress");
    if(saved){
      const data = JSON.parse(saved);
      setAnswers(data.answers || {});
      setMistakes(data.mistakes || []);
      setCurrent(data.current || 0);
    }
  },[]);

  // SAVE PROGRESS
  useEffect(()=>{
    localStorage.setItem("cscp-progress",JSON.stringify({answers,mistakes,current}));
  },[answers,mistakes,current]);

  // FILTER QUESTIONS
  const filtered = useMemo(()=>{
    if(topicFilter==="All") return questionBank;
    return questionBank.filter(q=>q.topic===topicFilter);
  },[topicFilter]);

  const q = filtered[current];

  // ANSWER FUNCTION
  const answerQ=(i)=>{
    setAnswers(prev => ({ ...prev, [current]: i }));
    setShow(true);

    if(i!==q.answer){
      setMistakes(prev => [...new Set([...prev,current])]);
    }
  };

  const next=()=>{
    setCurrent(c=>c+1);
    setShow(false);
  };

  const score = Object.keys(answers).filter(i=>answers[i]===filtered[i]?.answer).length;
  const pct = Math.round(score/(filtered.length||1)*100);

  return (
    <div style={{padding:15,maxWidth:420,margin:"auto",fontFamily:"Arial"}}>

      <h2>CSCP Study System 🚀</h2>

      {/* FILTER */}
      <div style={{marginBottom:10}}>
        <select onChange={(e)=>{setTopicFilter(e.target.value);setCurrent(0);}}>
          <option>All</option>
          {topics.map(t=>(
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* STATS */}
      <div style={{fontSize:14,marginBottom:10}}>
        <p>Score: {score}</p>
        <p>Accuracy: {pct}%</p>
        <p>Mistakes: {mistakes.length}</p>
      </div>

      {/* QUESTION */}
      {q && (
        <div>
          <p><b>Q{current+1} ({q.topic})</b></p>
          <p>{q.question}</p>

          {q.options.map((o,i)=>(
            <button
              key={i}
              onClick={()=>answerQ(i)}
              style={{
                display:"block",
                margin:"5px 0",
                width:"100%",
                padding:10,
                background: show
                  ? i === q.answer
                    ? "#4caf50"
                    : i === answers[current]
                    ? "#f44336"
                    : "#f0f0f0"
                  : "#f0f0f0"
              }}
            >
              {o}
            </button>
          ))}

          {show && (
            <p style={{marginTop:10}}>
              <b>Explanation:</b> {q.explanation}
            </p>
          )}

          <button onClick={next} style={{marginTop:10}}>Next</button>
        </div>
      )}

    </div>
  );
}
``
