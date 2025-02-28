import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AlarmPage from './pages/AlarmPage';
import BusDetailsPage from './pages/BusDetailsPage';
import BusTablePage from './pages/BusTablePage';
import OnBoardPage from './pages/OnBoardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/alarm" element={<AlarmPage />} />
      <Route path="/bus-details/:busId" element={<BusDetailsPage />} />
      <Route path="/bus-table" element={<BusTablePage />} />
      <Route path="/onboard/:busId" element={<OnBoardPage />} />
    </Routes>
  );
}

export default App;