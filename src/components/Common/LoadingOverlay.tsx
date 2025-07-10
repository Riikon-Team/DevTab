import React, { useEffect, useState } from 'react';
import './LoadingOverlay.css';

const LoadingOverlay: React.FC = () => {
  const [hide, setHide] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setHide(true), 800); // 0.8s để thấy hiệu ứng ánh sáng
    return () => clearTimeout(timer);
  }, []);
  if (hide) return null;
  return (
    <div className={`loading-overlay${hide ? ' fade-out' : ''}`}>
      <div className="devtab-logo-glow">
        <span className="devtab-text">DevTab</span>
        <span className="devtab-shine" />
      </div>
    </div>
  );
};

export default LoadingOverlay; 