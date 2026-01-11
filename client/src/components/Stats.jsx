import React from 'react';
import StatCard from './StatCard';
import './Stats.css';

export default function Stats(){
  return (
    <section id="stats" className="stats-section">
      <div className="maxwrap">
        <div className="stats-grid">
          <StatCard icon={<span>📅</span>} label="Total Events" value={1240} />
          <StatCard icon={<span>🏫</span>} label="Total Institutes" value={352} />
          <StatCard icon={<span>🧑‍🤝‍🧑</span>} label="Total Participants" value={45230} />
          <StatCard icon={<span>⏱️</span>} label="Ongoing Events" value={12} />
        </div>
      </div>
    </section>
  );
}
