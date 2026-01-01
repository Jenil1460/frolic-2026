import './Background3D.css';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Background3D = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`background-3d background-3d--${theme}`} aria-hidden="true">
      <svg className="bg-svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="g1" x1="0%" x2="100%">
            <stop offset="0%" stopColor="var(--bg-grad-start)" />
            <stop offset="50%" stopColor="var(--bg-grad-mid)" />
            <stop offset="100%" stopColor="var(--bg-grad-end)" />
          </linearGradient>
        </defs>

        <g className="layer layer-back">
          <ellipse className="blob b1" cx="20%" cy="20%" rx="420" ry="240" fill="url(#g1)" />
          <ellipse className="blob b2" cx="85%" cy="75%" rx="280" ry="160" fill="url(#g1)" />
        </g>

        <g className="layer layer-mid">
          <ellipse className="blob b3" cx="70%" cy="18%" rx="260" ry="140" fill="var(--bg-blob-1)" />
          <ellipse className="blob b4" cx="10%" cy="85%" rx="200" ry="110" fill="var(--bg-blob-2)" />
        </g>

        <g className="layer layer-front">
          <ellipse className="blob b5" cx="50%" cy="50%" rx="180" ry="100" fill="var(--bg-blob-3)" />
        </g>
      </svg>
    </div>
  );
};

export default Background3D;
