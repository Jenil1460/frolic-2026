import React, { useEffect, useRef, useState } from 'react';
import './Stats.css';

export default function StatCard({ icon, label, value }){
  const ref = useRef();
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(()=>{
    const el = ref.current;
    if(!el) return;
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          setStarted(true);
          io.unobserve(el);
        }
      })
    },{threshold:0.4});
    io.observe(el);
    return ()=>io.disconnect();
  },[]);

  useEffect(()=>{
    if(!started) return; 
    let start=0; const dur=1400; const to=value;
    const step= Math.max(1, Math.floor(to/ (dur/30)));
    const id = setInterval(()=>{
      start += step;
      if(start >= to){ setCount(to); clearInterval(id); }
      else setCount(start);
    },30);
    return ()=>clearInterval(id);
  },[started,value]);

  return (
    <div className="stat-card" ref={ref}>
      <div className="icon">{icon}</div>
      <div className="value">{count.toLocaleString()}</div>
      <div className="label">{label}</div>
    </div>
  );
}
