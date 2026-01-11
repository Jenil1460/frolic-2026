import React, { useEffect, useState } from 'react';
import './Testimonials.css';

const reviews = [
  {id:1,name:'Aisha',inst:'TechU','text':'Frolic made participating in events so easy — love the live updates!'},
  {id:2,name:'Rohan',inst:'IIT Frost','text':'Our team won the hackathon! Platform was flawless.'},
  {id:3,name:'Sara',inst:'Green Valley','text':'Intuitive UI and quick registration — highly recommend.'}
];

export default function Testimonials(){
  const [idx,setIdx] = useState(0);
  useEffect(()=>{
    const id = setInterval(()=> setIdx(i => (i+1)%reviews.length),4500);
    return ()=>clearInterval(id);
  },[]);

  return (
    <section id="testimonials" className="testimonials">
      <div className="maxwrap">
        <h3 className="section-title">What Students Say</h3>
        <div className="carousel">
          {reviews.map((r,i)=> (
            <div key={r.id} className={`slide ${i===idx? 'active':''}`}>
              <div className="avatar">{r.name[0]}</div>
              <div className="body">
                <div className="name">{r.name} <span className="inst">{r.inst}</span></div>
                <p>{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
