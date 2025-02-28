import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const BusTablePage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="app-container w-full">
      <Header showRefreshButton={false} />
      
      <div className="content">
        <h2 className="section-title">Bus Table</h2>
        <p>This page will be implemented later.</p>
      </div>
      
      <div className="button-container">
        <button className="map-btn" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    </div>
  );
};

export default BusTablePage;