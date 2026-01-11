import React from 'react';
import './CTA.css';

export default function CTA({onGetStarted}){
  return (
    <section className="cta">
      <div className="maxwrap">
        <div className="cta-inner">
          <div>
            <h3>Ready to Join the Next Big Event?</h3>
            <p>Discover, register and compete — all in one place.</p>
          </div>
          <div>
            <button className="primary big" onClick={onGetStarted}>Get Started with Frolic</button>
          </div>
        </div>
      </div>
    </section>
  );
}
