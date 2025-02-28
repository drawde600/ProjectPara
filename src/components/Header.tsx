import React from 'react';
import { Bus } from 'lucide-react';

interface HeaderProps {
  onRefresh?: () => void;
  showRefreshButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, showRefreshButton = true }) => {
  return (
    <div className="header">
      <div className="logo">
        <div className="logo-icon">
          <Bus size={20} color="white" />
        </div>
        <span className="logo-text">Project Para</span>
      </div>
      {showRefreshButton && (
        <div className="refresh-icon" onClick={onRefresh}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4V10H7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 20V14H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.49 9.00001C19.9828 7.56329 19.1209 6.28067 17.9845 5.27102C16.8482 4.26137 15.4745 3.56428 14 3.24601C12.5255 2.92774 10.9998 3.00001 9.56 3.45636C8.12022 3.91271 6.82196 4.73765 5.78 5.84001L1 10M23 14L18.22 18.16C17.1781 19.2624 15.8798 20.0873 14.44 20.5436C13.0002 21 11.4745 21.0722 10 20.754C8.52552 20.4357 7.15183 19.7386 6.01547 18.729C4.87911 17.7193 4.01718 16.4367 3.51 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </div>
  );
};

export default Header;