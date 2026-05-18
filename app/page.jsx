'use client';

import React, { useState, useMemo, useEffect } from "react";

export default function Page() {

  const topics = ["S&OP","Inventory","Logistics","Risk"];

  const questionBank = [
  {
    topic: "S&OP",
    question: "A company has frequent mismatch between sales forecasts and production capacity. What is the BEST action?",
    options: [
      "Increase production capacity",
      "Implement cross-functional S&OP process",
      "Reduce forecast frequency",
      "Increase inventory levels"
    ],
    answer: 1,
    explanation: "S&OP aligns demand and supply across functions to reduce mismatch."
  },
  {
    topic: "Inventory",
    question: "Demand variability is causing frequent stockouts. What is the BEST solution?",
    options: [
      "Reduce reorder point",
      "Increase safety stock",
      "Eliminate safety stock",
      "Increase EOQ significantly"
    ],
    answer: 1,
    explanation: "Safety stock buffers demand uncertainty and protects service levels."
  },
  {
    topic: "Logistics",
    question: "A company is experiencing late deliveries due to ocean shipping delays. What is the BEST option?",
    options: [
      "Shift entirely to air freight",
      "Use a blended transportation strategy",
      "Increase shipment sizes",
      "Reduce order frequency"
    ],
    answer: 1,
    explanation: "Blended transport balances cost and speed."
  },
  {
    topic: "Risk",
    question: "A critical supplier is in a politically unstable region. What is the BEST mitigation?",
    options: [
      "Increase order quantities",
      "Implement dual sourcing",
      "Reduce inventory",
      "Change transportation mode"
    ],
    answer: 1,
    explanation: "Dual sourcing reduces dependency risk."
  }
];


  const [mode,setMode]=useState("study");
  const [current,setCurrent]=useState(0);
  const [answers,setAnswers]=useState({});
  const [show,setShow]=useState(false);
  const [mistakes,setMistakes]=useState([]);

  const answerQ=(i)=>{
    setAnswers({...answers,[current]:i});
    setShow(true);
    if(i!==questionBank[current].answer){
      setMistakes(m=>[...new Set([...m,current])]);
    }
  };

  const next=()=>{
    setCurrent(c=>c+1);
    setShow(false);
  };

  const score = Object.keys(answers).filter(i=>answers[i]===questionBank[i]?.answer).length;
  const percent = Math.round(score/(questionBank.length||1)*100);

  return (
    <div style={{padding:20,maxWidth:400,margin:"auto"}}>

      <h1>CSCP Study System 🚀</h1>

      <div style={{marginBottom:10}}>
        <button onClick={()=>setMode("study")}>Study</button>
        <button onClick={()=>setMode("exam")}>Exam</button>
      </div>

      <p>Score: {score}</p>
      <p>Accuracy: {percent}%</p>
      <p>Mistakes: {mistakes.length}</p>

      {current < questionBank.length && (
        <div>

          <p><b>Q{current+1}:</b> {questionBank[current].question}</p>

          {questionBank[current].options.map((o,i)=>(
            <button key={i} onClick={()=>answerQ(i)} style={{display:"block",margin:"5px 0"}}>
              {o}
            </button>
          ))}

          {show && (
            <p><b>Explanation:</b> {questionBank[current].explanation}</p>
          )}

          <button onClick={next}>Next</button>

        </div>
      )}

    </div>
  );
}
