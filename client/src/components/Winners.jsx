import React from 'react';
import './Winners.css';

export default function Winners(){
  return (
    <section id="results" className="winners-section">
      <div className="maxwrap">
        <h3 className="section-title">Recent Winners</h3>
        <div className="podium">
          <div className="place second">
            <div className="num">2</div>
            <div className="name">Team Alpha</div>
            <div className="medal">🥈</div>
          </div>
          <div className="place first">
            <div className="num">1</div>
            <div className="name">Team Zenith</div>
            <div className="medal">🏆</div>
          </div>
          <div className="place third">
            <div className="num">3</div>
            <div className="name">Team Nova</div>
            <div className="medal">🥉</div>
          </div>
        </div>
        <div className="cta-row"><button className="primary small">View All Results</button></div>
      </div>
    </section>
  );
}
