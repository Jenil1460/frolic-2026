import { useEffect } from 'react';

export default function useReveal(selector = '.feature-card'){
  useEffect(()=>{
    const els = Array.from(document.querySelectorAll(selector));
    if(!els.length) return;
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('reveal');
          io.unobserve(entry.target);
        }
      });
    },{threshold:0.15});
    els.forEach(e=> io.observe(e));
    return ()=>io.disconnect();
  },[selector]);
}
