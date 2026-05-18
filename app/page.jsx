'use client';

import React, { useState, useMemo, useEffect } from "react";

// ===================== ELITE CSCP APP =====================
// ✅ Multi-paragraph realistic questions
// ✅ Exam timer
// ✅ Weak topic detection
// ✅ Modern UI styling
const topics = ["S&OP","Inventory","Logistics","Risk"];

const baseQuestions = [
  {
    topic: "S&OP",
    q: `A global manufacturing company is experiencing misalignment between sales forecasts and production output. Sales teams tend to overestimate demand, while operations are constrained by capacity limitations. This has resulted in excess inventory in some regions and stockouts in others.


Leadership wants a structured way to align demand planning, supply planning, and financial projections while minimizing cost.


What is the BEST action?`,
    opts: [
      "Increase safety stock globally",
      "Implement a cross-functional S&OP process",
      "Reduce forecast updates",
      "Increase production capacity"
    ],
    a: 1,
    e: "S&OP aligns all functions to balance demand and supply."
  },
  {
    topic: "Inventory",
    q: `A company faces frequent stockouts due to demand variability and long supplier lead times. At the same time, inventory carrying costs are increasing significantly.


Management wants to maintain service levels while controlling costs.


What is the BEST solution?`,
    opts: [
      "Reduce reorder point",
      "Increase safety stock strategically",
      "Eliminate safety stock",
      "Increase EOQ significantly"
    ],
    a: 1,
    e: "Safety stock buffers variability without drastically increasing cost."
  },
  {
    topic: "Logistics",
    q: `A company relies heavily on ocean freight to minimize shipping costs. However, customers are now experiencing delays and service complaints are rising.


Leadership wants to improve customer satisfaction without drastically increasing logistics expenses.


What is the BEST approach?`,
    opts: [
      "Switch entirely to air freight",
      "Use a blended transportation strategy",
      "Increase inventory levels everywhere",
      "Reduce shipment frequency"
    ],
    a: 1,
    e: "Blended transport balances cost and delivery speed."
  },
  {
    topic: "Risk",
    q: `A critical component is sourced from a single supplier located in a region experiencing political instability. Recent disruptions have caused delays and threaten future supply continuity.


Management wants to reduce risk exposure without significantly increasing procurement cost.


What is the BEST mitigation strategy?`,
    opts: [
      "Increase order quantities",
      "Implement dual sourcing",
      "Reduce inventory levels",
      "Change transportation modes"
    ],
    a: 1,
    e: "Dual sourcing reduces dependency and risk exposure."
  }
];

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


  const [mode,setMode]=useState("study");
  const [topicFilter,setTopicFilter]=useState("All");
  const [current,setCurrent]=useState(0);
  const [answers,setAnswers]=useState({});
  const [show,setShow]=useState(false);
  const [weak,setWeak]=useState({});


  const [time,setTime]=useState(210*60);


  useEffect(()=>{
    if(mode!=="exam") return;
    const t=setInterval(()=>setTime(t=>t-1),1000);
    return ()=>clearInterval(t);
  },[mode]);


  const filtered = useMemo(()=>{
    if(topicFilter==="All") return questionBank;
    return questionBank.filter(q=>q.topic===topicFilter);
  },[topicFilter]);


  const q = filtered[current];


  const answerQ=(i)=>{
    setAnswers(prev=>({...prev,[current]:i}));
    setShow(true);

    if(i!==q.answer){
      setWeak(w=>({...w,[q.topic]:(w[q.topic]||0)+1}));
    }
  };

  const next=()=>{
    setCurrent(c=>c+1);
    setShow(false);
  };

  const score = Object.keys(answers).filter(i=>answers[i]===filtered[i]?.answer).length;
  const pct = Math.round(score/(filtered.length||1)*100);


  const focus = Object.entries(weak).sort((a,b)=>b[1]-a[1])[0]?.[0] || "None";


  const fmt=t=>`${Math.floor(t/3600)}:${Math.floor((t%3600)/60).toString().padStart(2,"0")}`;


  return (
    <div style={{padding:15,maxWidth:420,margin:"auto",fontFamily:"Arial"}}>


      <h2>CSCP ELITE APP 🚀</h2>


      <div style={{display:"flex",gap:6,marginBottom:10}}>
        <button onClick={()=>setMode("study")}>Study</button>
        <button onClick={()=>setMode("exam")}>Exam</button>
      </div>

      <select onChange={(e)=>{setTopicFilter(e.target.value);setCurrent(0);}}>
        <option>All</option>
        {topics.map(t=><option key={t}>{t}</option>)}
      </select>
      <div style={{marginTop:10}}>
        <p>Score: {score}</p>
        <p>Accuracy: {pct}%</p>
        <p>Weakest Topic: {focus}</p>
        {mode==="exam" && <p>Time: {fmt(time)}</p>}
      </div>

      {q && (
        <div style={{background:"#fff",padding:15,marginTop:10,borderRadius:8,boxShadow:"0 2px 8px rgba(0,0,0,0.1)"}}>


          <p><b>Q{current+1} ({q.topic})</b></p>
          <p style={{whiteSpace:"pre-line"}}>{q.question}</p>
          {q.options.map((o,i)=>(
            <button key={i}
              onClick={()=>answerQ(i)}
              style={{display:"block",width:"100%",margin:"6px 0",padding:10,borderRadius:6,
              background: show ? (i===q.answer ? "#4caf50" : i===answers[current] ? "#f44336" : "#eee") : "#eee"}}
            >
              {o}
            </button>
          ))}

          {show && <p><b>Explanation:</b> {q.explanation}</p>}
          <button onClick={next} style={{marginTop:10}}>Next</button>


        </div>
      )}

    </div>
  );
}
