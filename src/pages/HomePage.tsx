import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import DirectionSelector from '../components/DirectionSelector';
import BusItem from '../components/BusItem';
import EmptyState from '../components/EmptyState';
import LoadingIndicator from '../components/LoadingIndicator';
import { Bus } from '../types';
import { generateBusData } from '../utils/busUtils';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentDirection, setCurrentDirection] = useState<'southbound' | 'northbound'>('southbound');
  
  const fetchBusData = () => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const newBuses = generateBusData(currentDirection);
      setBuses(newBuses);
      setIsLoading(false);
    }, 1000);
  };
  
  useEffect(() => {
    fetchBusData();
  }, [currentDirection]);
  
  const handleDirectionChange = (direction: 'southbound' | 'northbound') => {
    if (direction !== currentDirection) {
      setCurrentDirection(direction);
    }
  };
  
  const handleBusClick = (busId: string) => {
    navigate(`/bus-details/${busId}?direction=${currentDirection}`);
  };
  
  const handleMapClick = () => {
    navigate('/bus-table');
  };
  
  return (
    <div className="app-container w-full">
      <Header onRefresh={fetchBusData} />
      
      <div className="content">
        <DirectionSelector 
          currentDirection={currentDirection} 
          onDirectionChange={handleDirectionChange} 
        />
        
        <h2 className="section-title">Available Buses</h2>
        
        {buses.length > 0 ? (
          <div className="bus-list">
            {buses.map((bus) => (
              <BusItem key={bus.id} bus={bus} onClick={handleBusClick} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
      
      <div className="button-container">
        <button className="map-btn" onClick={handleMapClick}>View Map</button>
      </div>
      
      <LoadingIndicator isLoading={isLoading} />
    </div>
  );
};

export default HomePage;