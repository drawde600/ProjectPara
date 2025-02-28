import React from 'react';
import { Bus } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Bus size={48} color="#a0a7b8" />
      </div>
      <div className="empty-state-text">No buses available right now. Please try again later.</div>
    </div>
  );
};

export default EmptyState;