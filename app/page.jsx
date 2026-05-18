'use client';

import React, { useState, useMemo, useEffect } from "react";

export default function Page() {

  const topics = ["S&OP","Inventory","Logistics","Risk"];

  const questionBank = Array.from({ length: 200 }, (_, i) => {
    const topic = topics[i % topics.length];
    return {
      topic,
      question: `${topic} scenario question #${i+1}`,
      options: ["Option A","Option B","Option C","Option D"],
      answer: 1,
      explanation: "This is the correct decision based on CSCP principles."
    };
  });

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
