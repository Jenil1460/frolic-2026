import React from 'react';
import './HowItWorks.css';

const steps = [
  {icon:'🔐',title:'Register / Login',desc:'Create your account to get started.'},
  {icon:'🔍',title:'Browse Events',desc:'Explore trending and upcoming events.'},
  {icon:'👥',title:'Create or Join Group',desc:'Form groups and collaborate.'},
  {icon:'🏆',title:'Participate & Win',desc:'Showcase skills and win rewards.'}
];

export default function HowItWorks(){
  return (
    <section id="how" className="how-section">
      <div className="maxwrap">
        <h3 className="section-title">How It Works</h3>
        <div className="steps">
          {steps.map((s,i)=> (
            <div className="step" key={s.title}>
              <div className="step-icon">{s.icon}</div>
              <div className="step-body">
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
              {i !== steps.length-1 && <div className="connector" aria-hidden />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
