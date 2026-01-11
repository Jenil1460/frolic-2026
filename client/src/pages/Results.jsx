import React from 'react';
import { Trophy, Award, Medal } from 'lucide-react';
import './Results.css';

const Results = () => {
  const results = [];

  return (
    <div className="results-page">
      <div className="results-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>

      <div className="results-container">
        <div className="results-header">
          <h1 className="results-title">Event Results</h1>
          <p className="results-subtitle">View winners and achievements</p>
        </div>

        {results.length === 0 ? (
          <div className="no-results">
            <Trophy size={80} />
            <h2>No Results Published</h2>
            <p>Results will be announced after events conclude!</p>
          </div>
        ) : (
          <div className="results-grid">
            {results.map((result) => (
              <div key={result.id} className="result-card">
                <div className="result-header">
                  <h3 className="result-event">{result.event}</h3>
                  <div className="result-date">{result.date}</div>
                </div>
                <div className="winners-list">
                  <div className="winner-item first">
                    <Trophy size={24} />
                    <span>{result.first}</span>
                  </div>
                  <div className="winner-item second">
                    <Award size={24} />
                    <span>{result.second}</span>
                  </div>
                  <div className="winner-item third">
                    <Medal size={24} />
                    <span>{result.third}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;