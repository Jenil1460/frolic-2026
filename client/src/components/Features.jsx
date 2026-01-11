import React from 'react';
import './Features.css';

const features = [
  {icon:'🗂️', title:'Event Management', desc:'Create, manage and schedule events seamlessly.'},
  {icon:'👥', title:'Group & Participant System', desc:'Teams, roles and participant tracking made easy.'},
  {icon:'⚡', title:'Real-Time Results', desc:'Live scoring and instant result updates.'},
  {icon:'🏛️', title:'Institute Control', desc:'Institute & department management tools.'},
  {icon:'🔒', title:'Secure Registration', desc:'Robust auth and verification flows.'},
  {icon:'📊', title:'Reports & Analytics', desc:'Exportable insights and performance dashboards.'}
];

import useReveal from '../hooks/useReveal';

export default function Features(){
  useReveal('.feature-card');
  return (
    <section id="features" className="features-section">
      <div className="maxwrap">
        <h3 className="section-title">Features</h3>
        <div className="features-grid">
          {features.map(f=> (
            <div key={f.title} className="feature-card">
              <div className="feat-icon">{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
