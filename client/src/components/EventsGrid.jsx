import React from 'react';
import './EventsGrid.css';

const events = [
  {id:1,title:'Intercollegiate Hackathon',dept:'CS',date:'Jan 15, 2026',fee:'Free',img:''},
  {id:2,title:'Cultural Fiesta',dept:'Arts',date:'Feb 3, 2026',fee:'$10',img:''},
  {id:3,title:'Robotics Challenge',dept:'Mech',date:'Mar 10, 2026',fee:'$15',img:''},
  {id:4,title:'Debate Championship',dept:'Humanities',date:'Apr 22, 2026',fee:'$5',img:''}
];

import useReveal from '../hooks/useReveal';

export default function EventsGrid(){
  useReveal('.event-card');
  return (
    <section id="events" className="events-section">
      <div className="maxwrap">
        <h3 className="section-title">Trending Events</h3>
        <div className="events-grid">
          {events.map(e=> (
            <div className="event-card" key={e.id}>
              <div className="thumb" aria-hidden />
              <div className="info">
                <div className="dept">{e.dept}</div>
                <h4>{e.title}</h4>
                <div className="meta">{e.date} • {e.fee}</div>
                <div className="actions"><button className="view">View Details</button></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
