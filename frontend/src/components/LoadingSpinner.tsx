// src/components/LoadingSpinner.tsx
import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;