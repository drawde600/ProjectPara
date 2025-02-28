import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, X, MapPin, Clock } from 'lucide-react';

const AlarmPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAlertVisible, setIsAlertVisible] = useState(true);
  const [snoozeCount, setSnoozeCount] = useState(0);
  const [nearbyBuses, setNearbyBuses] = useState([
    {
      id: 'bus-12',
      number: '12',
      route: 'Route 12',
      destination: 'Downtown',
      time: '3 min'
    },
    {
      id: 'bus-15',
      number: '15',
      route: 'Route 15',
      destination: 'Shopping District',
      time: '7 min'
    }
  ]);

  // Function to dismiss the alert
  const dismissAlert = () => {
    if (isAlertVisible) {
      setIsAlertVisible(false);
    }
  };

  // Function to show the alert
  const showAlert = () => {
    if (!isAlertVisible) {
      setIsAlertVisible(true);
    }
  };

  // Function to show toast notification
  const showToast = (message: string) => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white py-3 px-5 rounded-full z-50 transition-opacity duration-500';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 3000);
  };

  // Handle snooze button click
  const handleSnooze = () => {
    dismissAlert();
    setSnoozeCount(prev => prev + 1);
    
    // Show snooze message
    showToast('Alert snoozed for 5 minutes');
    
    // Set timer to show alert again after snooze period
    if (snoozeCount < 3) {
      setTimeout(() => {
        showAlert();
      }, 10000); // For demo purposes, we'll use 10 seconds instead of 5 minutes
    }
  };

  // Handle stop alert button click
  const handleStopAlert = () => {
    dismissAlert();
    showToast('Alert stopped');
  };

  // Handle refresh button click
  const handleRefresh = () => {
    showToast('Map data refreshed');
  };

  // Handle bus item click
  const handleBusClick = (busId: string) => {
    navigate(`/bus-details/${busId}`);
  };

  return (
    <div className="app-container w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-4 flex justify-between items-center w-full">
        <div className="flex items-center">
          <div className="mr-2">
            <Bus size={24} color="white" />
          </div>
          <span className="text-lg font-semibold text-white">Project Para</span>
        </div>
        <div 
          className="w-9 h-9 bg-teal-600 rounded-full flex items-center justify-center cursor-pointer"
          onClick={handleRefresh}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4V10H7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 20V14H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.49 9.00001C19.9828 7.56329 19.1209 6.28067 17.9845 5.27102C16.8482 4.26137 15.4745 3.56428 14 3.24601C12.5255 2.92774 10.9998 3.00001 9.56 3.45636C8.12022 3.91271 6.82196 4.73765 5.78 5.84001L1 10M23 14L18.22 18.16C17.1781 19.2624 15.8798 20.0873 14.44 20.5436C13.0002 21 11.4745 21.0722 10 20.754C8.52552 20.4357 7.15183 19.7386 6.01547 18.729C4.87911 17.7193 4.01718 16.4367 3.51 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      {/* Map Container */}
      <div className="flex-1 relative bg-[#0F111A]">
        {/* Stylized Map SVG */}
        <svg className="w-full h-full" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice">
          {/* Dark background */}
          <rect width="100%" height="100%" fill="#0F111A"/>
          
          {/* Water areas */}
          <path d="M250,150 Q300,160 350,120 Q400,80 450,100 L450,0 L180,0 Z" fill="#1E3A5F"/>
          
          {/* City Roads - Main Grid */}
          {/* Vertical Roads */}
          <path d="M50,0 L50,500" stroke="white" strokeWidth="1" strokeOpacity="0.5" fill="none"/>
          <path d="M100,0 L100,500" stroke="white" strokeWidth="1" strokeOpacity="0.5" fill="none"/>
          <path d="M150,0 L150,500" stroke="white" strokeWidth="1" strokeOpacity="0.5" fill="none"/>
          <path d="M200,0 L200,500" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" fill="none"/>
          <path d="M250,0 L250,500" stroke="white" strokeWidth="1" strokeOpacity="0.5" fill="none"/>
          <path d="M300,0 L300,500" stroke="white" strokeWidth="1" strokeOpacity="0.5" fill="none"/>
          <path d="M350,0 L350,500" stroke="white" strokeWidth="1" strokeOpacity="0.5" fill="none"/>
          
          {/* Horizontal Roads */}
          <path d="M0,50 L400,50" stroke="white" strokeWidth="1" strokeOpacity="0.5" fill="none"/>
          <path d="M0,100 L400,100" stroke="white" strokeWidth="1" strokeOpacity="0.5" fill="none"/>
          <path d="M0,150 L400,150" stroke="white" strokeWidth="1" strokeOpacity="0.5" fill="none"/>
          <path d="M0,200 L400,200" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" fill="none"/>
          <path d="M0,250 L400,250" stroke="white" strokeWidth="1" strokeOpacity="0.5" fill="none"/>
          <path d="M0,300 L400,300" stroke="white" strokeWidth="1" strokeOpacity="0.5" fill="none"/>
          <path d="M0,350 L400,350" stroke="white" strokeWidth="1" strokeOpacity="0.5" fill="none"/>
          <path d="M0,400 L400,400" stroke="white" strokeWidth="1" strokeOpacity="0.5" fill="none"/>
          <path d="M0,450 L400,450" stroke="white" strokeWidth="1" strokeOpacity="0.5" fill="none"/>
          
          {/* Diagonal Roads */}
          <path d="M0,0 L150,150" stroke="white" strokeWidth="1" strokeOpacity="0.4" fill="none"/>
          <path d="M400,0 L250,150" stroke="white" strokeWidth="1" strokeOpacity="0.4" fill="none"/>
          <path d="M0,400 L150,250" stroke="white" strokeWidth="1" strokeOpacity="0.4" fill="none"/>
          <path d="M400,400 L250,250" stroke="white" strokeWidth="1" strokeOpacity="0.4" fill="none"/>
          
          {/* Central Circle */}
          <circle cx="200" cy="200" r="5" fill="white" fillOpacity="0.7"/>
          
          {/* Secondary Roads */}
          <path d="M75,25 L75,475" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" fill="none"/>
          <path d="M125,25 L125,475" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" fill="none"/>
          <path d="M175,25 L175,475" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" fill="none"/>
          <path d="M225,25 L225,475" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" fill="none"/>
          <path d="M275,25 L275,475" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" fill="none"/>
          <path d="M325,25 L325,475" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" fill="none"/>
          
          <path d="M25,75 L375,75" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" fill="none"/>
          <path d="M25,125 L375,125" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" fill="none"/>
          <path d="M25,175 L375,175" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" fill="none"/>
          <path d="M25,225 L375,225" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" fill="none"/>
          <path d="M25,275 L375,275" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" fill="none"/>
          <path d="M25,325 L375,325" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" fill="none"/>
          <path d="M25,375 L375,375" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" fill="none"/>
          <path d="M25,425 L375,425" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" fill="none"/>
          
          {/* Current Route Highlight */}
          <path d="M200,0 L200,150 L100,150 L100,250 L200,250 L200,500" 
                stroke="#4ecdc4" strokeWidth="3" strokeOpacity="0.9" fill="none"/>
                
          {/* User Location */}
          <circle cx="200" cy="160" r="6" fill="#4ecdc4"/>
          
          {/* Destination Location */}
          <circle cx="200" cy="140" r="8" stroke="#4ecdc4" strokeWidth="2" fill="none">
            <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
        
        {/* Map Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1e2130] bg-opacity-80 flex items-center justify-center cursor-pointer shadow-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#1e2130] bg-opacity-80 flex items-center justify-center cursor-pointer shadow-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#1e2130] bg-opacity-80 flex items-center justify-center cursor-pointer shadow-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        {/* Alert Popup */}
        {isAlertVisible && (
          <div className="absolute top-[70px] left-0 right-0 flex justify-center pointer-events-none">
            <div className="bg-[#181a26] bg-opacity-95 rounded-xl p-4 w-[90%] max-w-[340px] shadow-lg pointer-events-auto animate-slideDown">
              <div className="flex justify-between items-center mb-2">
                <div className="text-[#4ecdc4] text-lg font-semibold">Approaching Destination</div>
                <div 
                  className="w-6 h-6 bg-white bg-opacity-10 rounded-full flex items-center justify-center cursor-pointer"
                  onClick={dismissAlert}
                >
                  <X size={16} color="white" />
                </div>
              </div>
              <div className="text-base mb-3">Central Station</div>
              <div className="flex gap-4 mb-4">
                <div className="flex items-center">
                  <div className="mr-2 text-[#4ecdc4]">
                    <MapPin size={16} />
                  </div>
                  <div className="text-sm font-semibold">0.5 km</div>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 text-[#4ecdc4]">
                    <Clock size={16} />
                  </div>
                  <div className="text-sm font-semibold">2 min</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  className="flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-md"
                  onClick={handleStopAlert}
                >
                  Stop Alert
                </button>
                <button 
                  className="flex-1 py-2.5 bg-white bg-opacity-10 text-white font-semibold rounded-md"
                  onClick={handleSnooze}
                >
                  Snooze 5min
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Nearby Buses Section */}
      <div className="bg-white bg-opacity-5 p-4">
        <div className="text-gray-400 text-sm mb-4 pl-1">Nearby Buses</div>
        <div className="flex flex-col gap-3">
          {nearbyBuses.map(bus => (
            <div 
              key={bus.id} 
              className="flex items-center cursor-pointer"
              onClick={() => handleBusClick(bus.id)}
            >
              <div className="w-9 h-9 rounded-full bg-[#4ecdc4] flex items-center justify-center font-bold mr-4">
                {bus.number}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{bus.route}</div>
                <div className="text-gray-400 text-xs">{bus.destination}</div>
              </div>
              <div className="text-[#4ecdc4] font-semibold">{bus.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlarmPage;