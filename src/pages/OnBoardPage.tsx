import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Plus, Minus } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Need to import these to fix Leaflet icon issues
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon issue
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const OnBoardPage: React.FC = () => {
  const navigate = useNavigate();
  const { busId } = useParams<{ busId: string }>();
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [reminderTime, setReminderTime] = useState(5);
  const [customTime, setCustomTime] = useState(5);
  const [journeyStats, setJourneyStats] = useState({
    eta: 15,
    distance: 3.2
  });
  const [notification, setNotification] = useState<string | null>(null);
  const [showArrivalNotification, setShowArrivalNotification] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const busMarker = useRef<L.Marker | null>(null);
  const destinationMarker = useRef<L.Marker | null>(null);
  const busRoute = useRef<L.Polyline | null>(null);
  const busMovementInterval = useRef<number | null>(null);
  const journeyUpdateInterval = useRef<number | null>(null);
  
  // Define the bus route coordinates
  const routeCoordinates: [number, number][] = [
    [40.7128, -74.0060], // Start point (current location)
    [40.7180, -74.0030],
    [40.7230, -73.9980],
    [40.7280, -73.9930],
    [40.7328, -73.9860]  // Destination
  ];
  
  // Current waypoint index
  const currentWaypoint = useRef<number>(0);
  
  useEffect(() => {
    // Initialize map
    if (mapRef.current && !leafletMap.current) {
      initializeMap();
    }
    
    // Start journey updates
    startJourneyUpdates();
    
    return () => {
      // Clean up map and intervals when component unmounts
      if (busMovementInterval.current) {
        window.clearInterval(busMovementInterval.current);
      }
      
      if (journeyUpdateInterval.current) {
        window.clearInterval(journeyUpdateInterval.current);
      }
      
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);
  
  const initializeMap = () => {
    if (!mapRef.current) return;
    
    // Create map with dark mode styling
    leafletMap.current = L.map(mapRef.current).setView(routeCoordinates[0], 14);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(leafletMap.current);
    
    // Apply dark mode filter to map tiles
    const mapContainer = mapRef.current.querySelector('.leaflet-tile-pane') as HTMLElement;
    if (mapContainer) {
      mapContainer.style.filter = 'brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7)';
    }
    
    // Set map background color
    const mapElement = mapRef.current.querySelector('.leaflet-container') as HTMLElement;
    if (mapElement) {
      mapElement.style.backgroundColor = '#303035';
    }
    
    // Custom bus icon
    const busIcon = L.divIcon({
      html: `<div style="background-color: #00BFA5; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="3" width="16" height="16" rx="2" fill="#00BFA5"/>
                    <path d="M16 17H8V18C8 18.5523 8.44772 19 9 19H15C15.5523 19 16 18.5523 16 18V17Z" fill="#00BFA5"/>
                    <path d="M4 11H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 3H8C5.79086 3 4 4.79086 4 7V17H20V7C20 4.79086 18.2091 3 16 3Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="7" cy="14" r="1" fill="white"/>
                    <circle cx="17" cy="14" r="1" fill="white"/>
                </svg>
             </div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    
    // Define the destination icon
    const destinationIcon = L.divIcon({
      html: `<div style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" fill="#e53935" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="10" r="3" fill="white" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
             </div>`,
      className: '',
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });
    
    // Create a polyline for the bus route
    busRoute.current = L.polyline(routeCoordinates, {
      color: '#39c2ff',
      weight: 5,
      opacity: 0.7
    }).addTo(leafletMap.current);
    
    // Add markers for current position and destination
    busMarker.current = L.marker(routeCoordinates[0], { icon: busIcon }).addTo(leafletMap.current);
    busMarker.current.bindPopup(`<b>You are here</b><br>Bus #${busId?.replace('bus-', '')}`);
    
    // Add destination marker
    destinationMarker.current = L.marker(routeCoordinates[routeCoordinates.length - 1], { icon: destinationIcon }).addTo(leafletMap.current);
    destinationMarker.current.bindPopup(`<b>Destination</b><br>ETA: ${journeyStats.eta} mins`);
    
    // Fit map bounds to show the route
    leafletMap.current.fitBounds(busRoute.current.getBounds(), { padding: [30, 30] });
    
    // Start bus movement simulation
    busMovementInterval.current = window.setInterval(() => {
      moveBusTowardsWaypoint();
    }, 3000);
  };
  
  const moveBusTowardsWaypoint = () => {
    if (!busMarker.current || !leafletMap.current) return;
    
    // Get the next waypoint
    if (currentWaypoint.current < routeCoordinates.length - 1) {
      currentWaypoint.current++;
      const target = routeCoordinates[currentWaypoint.current];
      
      // Move the bus marker to the next position
      busMarker.current.setLatLng(target);
      
      // Update bus info based on position
      updateJourneyInfo();
    }
  };
  
  const startJourneyUpdates = () => {
    journeyUpdateInterval.current = window.setInterval(() => {
      updateJourneyInfo();
    }, 3000);
  };
  
  const updateJourneyInfo = () => {
    // Update journey stats
    setJourneyStats(prev => {
      const newEta = prev.eta > 1 ? prev.eta - 1 : 0;
      const newDistance = prev.distance > 0.1 ? parseFloat((prev.distance - 0.1).toFixed(1)) : 0;
      
      // Update destination marker popup
      if (destinationMarker.current) {
        destinationMarker.current.bindPopup(`<b>Destination</b><br>ETA: ${newEta} mins`);
      }
      
      // Check if arrived at destination
      if (newEta <= 1 && newDistance <= 0.1) {
        if (busMovementInterval.current) {
          window.clearInterval(busMovementInterval.current);
        }
        
        if (journeyUpdateInterval.current) {
          window.clearInterval(journeyUpdateInterval.current);
        }
        
        setShowArrivalNotification(true);
      }
      
      return { eta: newEta, distance: newDistance };
    });
  };
  
  const handleRefresh = () => {
    updateJourneyInfo();
    showNotification('Journey information updated');
  };
  
  const handleMapControl = () => {
    if (leafletMap.current && busMarker.current) {
      const currentPosition = busMarker.current.getLatLng();
      leafletMap.current.setView(currentPosition, 15);
    }
  };
  
  const handleEndJourney = () => {
    if (window.confirm('Are you sure you want to end your journey?')) {
      navigate('/');
    }
  };
  
  const openTimerModal = () => {
    setIsTimerModalOpen(true);
    setCustomTime(reminderTime);
  };
  
  const closeTimerModal = () => {
    setIsTimerModalOpen(false);
  };
  
  const saveReminderTime = () => {
    setReminderTime(customTime);
    showNotification(`Reminder set for ${customTime} minutes before arrival`);
    closeTimerModal();
  };
  
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  const handleTimerOptionClick = (time: number) => {
    setCustomTime(time);
  };
  
  const decreaseTime = () => {
    if (customTime > 1) {
      setCustomTime(customTime - 1);
    }
  };
  
  const increaseTime = () => {
    if (customTime < 60) {
      setCustomTime(customTime + 1);
    }
  };
  
  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      if (value < 1) {
        setCustomTime(1);
      } else if (value > 60) {
        setCustomTime(60);
      } else {
        setCustomTime(value);
      }
    }
  };
  
  return (
    <div className="app-container w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-4 flex justify-between items-center w-full">
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <ArrowLeft size={20} color="white" className="mr-2" />
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
      <div className="h-60 relative">
        <div ref={mapRef} className="w-full h-full"></div>
        
        {/* Map Controls */}
        <div 
          className="absolute bottom-4 right-4 bg-white bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
          onClick={handleMapControl}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8L12 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 12L16 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      {/* Journey Info */}
      <div className="bg-gradient-to-b from-[#2D2D5C] to-[#1e2130] p-5 flex-1">
        {/* Route Bar */}
        <div className="flex justify-between items-center mb-5">
          <div className="text-lg font-semibold">Bus #{busId?.replace('bus-', '')}</div>
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">On Board</div>
        </div>
        
        {/* Journey Stats */}
        <div className="flex justify-between mb-5">
          <div className="flex flex-col">
            <div className="text-sm text-gray-400 mb-1">ETA</div>
            <div className="text-lg font-semibold">{journeyStats.eta} mins</div>
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-gray-400 mb-1">Distance</div>
            <div className="text-lg font-semibold">{journeyStats.distance} km</div>
          </div>
        </div>
        
        {/* Reminder Container */}
        <div 
          className="flex justify-between items-center p-4 bg-white bg-opacity-10 rounded-xl mb-5 cursor-pointer"
          onClick={openTimerModal}
        >
          <div className="flex items-center">
            <div className="mr-3">
              <Clock size={24} color="white" />
            </div>
            <div className="text-base">Reminder</div>
          </div>
          <div className="flex items-center">
            <span className="mr-2">{reminderTime} min</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        {/* End Journey Button */}
        <button 
          className="w-full py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
          onClick={handleEndJourney}
        >
          End Journey
        </button>
      </div>
      
      {/* Timer Modal */}
      {isTimerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1e2130] rounded-xl w-[90%] max-w-[340px] p-6">
            <div className="text-lg font-semibold mb-5 text-center">Set Reminder</div>
            
            {/* Timer Options */}
            <div className="flex flex-wrap gap-3 mb-6 justify-center">
              {[2, 5, 10, 15].map(time => (
                <div 
                  key={time}
                  className={`px-4 py-2 rounded-full text-base cursor-pointer ${
                    customTime === time ? 'bg-teal-600 text-white' : 'bg-white bg-opacity-10'
                  }`}
                  onClick={() => handleTimerOptionClick(time)}
                >
                  {time} min
                </div>
              ))}
            </div>
            
            {/* Custom Timer */}
            <div className="flex items-center justify-center mb-6">
              <button 
                className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center"
                onClick={decreaseTime}
              >
                <Minus size={20} color="white" />
              </button>
              <input 
                type="number" 
                value={customTime}
                onChange={handleCustomTimeChange}
                className="w-20 bg-white bg-opacity-10 border-none text-white text-2xl font-semibold py-2 px-3 mx-3 rounded-lg text-center"
                min="1"
                max="60"
              />
              <button 
                className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center"
                onClick={increaseTime}
              >
                <Plus size={20} color="white" />
              </button>
            </div>
            
            {/* Timer Buttons */}
            <div className="flex justify-between">
              <button 
                className="flex-1 py-3 border border-white border-opacity-30 text-white font-semibold rounded-xl mr-3"
                onClick={closeTimerModal}
              >
                Cancel
              </button>
              <button 
                className="flex-1 py-3 bg-teal-600 text-white font-semibold rounded-xl"
                onClick={saveReminderTime}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification */}
      {notification && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-teal-600 bg-opacity-90 text-white py-3 px-5 rounded-full z-50">
          {notification}
        </div>
      )}
      
      {/* Arrival Notification */}
      {showArrivalNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-teal-600 bg-opacity-95 rounded-xl p-5 text-center w-[80%] max-w-[300px]">
            <h3 className="text-xl font-bold mb-2">Arriving at Destination</h3>
            <p className="mb-5">You've reached your destination. Would you like to end your journey?</p>
            <button 
              className="bg-red-600 text-white border-none py-3 px-5 rounded-lg cursor-pointer"
              onClick={() => navigate('/')}
            >
              End Journey
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnBoardPage;