import React from 'react';
import './Institutes.css';

const schools = ['IIT Frost','Green Valley College','Saint Marys','TechU','North College','Sunrise Institute'];

export default function Institutes(){
  return (
    <section id="institutes" className="inst-section">
      <div className="maxwrap">
        <h3 className="section-title">Institutes</h3>
        <div className="inst-row">
          {schools.map(s=> (
            <div className="inst-card" key={s}>{s}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
