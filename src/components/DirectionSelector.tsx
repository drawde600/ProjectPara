import React from 'react';

interface DirectionSelectorProps {
  currentDirection: 'southbound' | 'northbound';
  onDirectionChange: (direction: 'southbound' | 'northbound') => void;
}

const DirectionSelector: React.FC<DirectionSelectorProps> = ({ 
  currentDirection, 
  onDirectionChange 
}) => {
  return (
    <div className="direction-selector">
      <button 
        className={`direction-btn ${currentDirection === 'southbound' ? 'active' : ''}`}
        onClick={() => onDirectionChange('southbound')}
      >
        Southbound
      </button>
      <button 
        className={`direction-btn ${currentDirection === 'northbound' ? 'active' : ''}`}
        onClick={() => onDirectionChange('northbound')}
      >
        Northbound
      </button>
    </div>
  );
};

export default DirectionSelector;