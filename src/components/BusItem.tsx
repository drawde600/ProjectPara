import React from 'react';
import { Bus } from '../types';

interface BusItemProps {
  bus: Bus;
  onClick: (busId: string) => void;
}

const BusItem: React.FC<BusItemProps> = ({ bus, onClick }) => {
  return (
    <div className="bus-item" onClick={() => onClick(bus.id)}>
      <div className="bus-icon">{bus.icon}</div>
      <div className="bus-details">
        <div className="bus-number">{bus.number}</div>
        <div className="bus-route" dangerouslySetInnerHTML={{ __html: bus.route }}></div>
      </div>
      <div className="bus-info">
        <div className="bus-distance">{bus.distance}</div>
        <div className="bus-eta">{bus.eta}</div>
      </div>
    </div>
  );
};

export default BusItem;