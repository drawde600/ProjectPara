import React from 'react';

interface LoadingIndicatorProps {
  isLoading: boolean;
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  isLoading, 
  message = 'Updating bus locations...' 
}) => {
  if (!isLoading) return null;
  
  return (
    <div className="loading" style={{ display: 'flex' }}>
      <div className="loading-spinner"></div>
      <div className="loading-text">{message}</div>
    </div>
  );
};

export default LoadingIndicator;