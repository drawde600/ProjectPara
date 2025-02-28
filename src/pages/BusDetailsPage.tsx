import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { ArrowLeft, Bus } from 'lucide-react';
import { getBusById } from '../utils/busUtils';
import { Bus as BusType } from '../types';
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

interface BusStatus {
  speed: string;
  distance: string;
  eta: string;
  status: 'On Time' | 'Delayed' | 'Arriving';
}

const BusDetailsPage: React.FC = () => {
  const { busId } = useParams<{ busId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const direction = queryParams.get('direction') as 'southbound' | 'northbound' || 'southbound';
  
  const [bus, setBus] = useState<BusType | null>(null);
  const [busStatus, setBusStatus] = useState<BusStatus>({
    speed: '45 km/h',
    distance: '0.5 km',
    eta: '2 mins',
    status: 'On Time'
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const busMarker = useRef<L.Marker | null>(null);
  const busRoute = useRef<L.Polyline | null>(null);
  const busMovementInterval = useRef<number | null>(null);
  
  // Define the bus route coordinates (sample route)
  const routeCoordinates: [number, number][] = [
    [15.4875, 120.7046], // Start point
    [15.4885, 120.7056],
    [15.4895, 120.7066],
    [15.4905, 120.7056],
    [15.4915, 120.7046],
    [15.4905, 120.7036],
    [15.4895, 120.7026],
    [15.4885, 120.7036],
    [15.4875, 120.7046]  // Back to start
  ];
  
  // Bus stops along the route
  const busStops = [
    { coords: [15.4885, 120.7056] as [number, number], name: "Main St & Broadway" },
    { coords: [15.4905, 120.7056] as [number, number], name: "Park Ave & 5th" },
    { coords: [15.4905, 120.7036] as [number, number], name: "Central Square" },
    { coords: [15.4885, 120.7036] as [number, number], name: "Downtown Station" }
  ];
  
  // Current waypoint index
  const currentWaypoint = useRef<number>(0);
  
  useEffect(() => {
    // Fetch bus data
    if (busId) {
      const busData = getBusById(busId, direction);
      setBus(busData);
    }
    
    // Initialize map
    if (mapRef.current && !leafletMap.current) {
      initializeMap();
    }
    
    return () => {
      // Clean up map and intervals when component unmounts
      if (busMovementInterval.current) {
        window.clearInterval(busMovementInterval.current);
      }
      
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [busId, direction]);
  
  const initializeMap = () => {
    if (!mapRef.current) return;
    
    // Create map
    leafletMap.current = L.map(mapRef.current).setView(routeCoordinates[0], 15);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(leafletMap.current);
    
    // Custom bus icon
    const busIcon = L.divIcon({
      html: `<div style="background-color: #e53935; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 16C4 17.1046 4.89543 18 6 18H18C19.1046 18 20 17.1046 20 16V8C20 6.89543 19.1046 6 18 6H6C4.89543 6 4 6.89543 4 8V16Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 6V18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
             </div>`,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    
    // Create a polyline for the bus route
    busRoute.current = L.polyline(routeCoordinates, {
      color: '#e53935',
      weight: 5,
      opacity: 0.8
    }).addTo(leafletMap.current);
    
    // Add bus stop markers
    busStops.forEach(stop => {
      const stopMarker = L.circleMarker(stop.coords, {
        radius: 5,
        fillColor: '#FFF',
        color: '#e53935',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
      }).addTo(leafletMap.current!);
      
      stopMarker.bindPopup(`<b>${stop.name}</b>`);
    });
    
    // Add the bus marker
    busMarker.current = L.marker(routeCoordinates[0], { icon: busIcon }).addTo(leafletMap.current);
    busMarker.current.bindPopup(`<b>Bus ${busId}</b><br>${direction === 'southbound' ? 'Southbound' : 'Northbound'}`);
    
    // Start bus movement
    busMovementInterval.current = window.setInterval(() => {
      moveBusTowardsWaypoint();
    }, 2000);
  };
  
  const moveBusTowardsWaypoint = () => {
    if (!busMarker.current || !leafletMap.current) return;
    
    // Get the next waypoint
    const target = routeCoordinates[currentWaypoint.current];
    
    // Move the bus marker to the next position
    busMarker.current.setLatLng(target);
    
    // Update current waypoint
    currentWaypoint.current = (currentWaypoint.current + 1) % routeCoordinates.length;
    
    // Update bus info based on position
    updateBusInfo();
  };
  
  const updateBusInfo = () => {
    // These would be calculated based on actual bus position and route in a real app
    const etaMinutes = Math.max(1, Math.floor(2 + Math.random()));
    const distanceKm = (0.5 + Math.random() * 0.2).toFixed(1);
    const speed = 40 + Math.floor(Math.random() * 15);
    
    // Occasionally change bus status
    let status: 'On Time' | 'Delayed' | 'Arriving' = 'On Time';
    const randomValue = Math.random();
    if (randomValue > 0.8) {
      status = 'Delayed';
    } else if (randomValue > 0.6) {
      status = 'Arriving';
    }
    
    setBusStatus({
      speed: `${speed} km/h`,
      distance: `${distanceKm} km`,
      eta: `${etaMinutes} mins`,
      status
    });
  };
  
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      updateBusInfo();
      setIsLoading(false);
    }, 1500);
  };
  
  const handleOnBoard = () => {
    navigate(`/onboard/${busId}`);
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Delayed':
        return 'bg-yellow-500';
      case 'Arriving':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  return (
    <div className="app-container w-full">
      <div className="header w-full">
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <ArrowLeft size={20} color="white" className="mr-2" />
          <span className="text-lg font-semibold">Bus Details</span>
        </div>
        <div className="refresh-icon" onClick={handleRefresh}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4V10H7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 20V14H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.49 9.00001C19.9828 7.56329 19.1209 6.28067 17.9845 5.27102C16.8482 4.26137 15.4745 3.56428 14 3.24601C12.5255 2.92774 10.9998 3.00001 9.56 3.45636C8.12022 3.91271 6.82196 4.73765 5.78 5.84001L1 10M23 14L18.22 18.16C17.1781 19.2624 15.8798 20.0873 14.44 20.5436C13.0002 21 11.4745 21.0722 10 20.754C8.52552 20.4357 7.15183 19.7386 6.01547 18.729C4.87911 17.7193 4.01718 16.4367 3.51 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      <div className="relative flex-1 w-full">
        <div ref={mapRef} className="w-full h-full"></div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 rounded-t-xl shadow-md p-4 z-10">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-lg font-semibold text-gray-800">
                {bus ? bus.number : `Bus #${busId?.replace('bus-', '')}`}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusClass(busStatus.status)}`}>
                {busStatus.status}
              </div>
            </div>
            <div className="text-gray-600 text-sm mb-3" dangerouslySetInnerHTML={{ __html: bus?.route || 'Loading route...' }}></div>
            <div className="flex justify-between py-3 border-t border-gray-100">
              <div className="flex flex-col items-center">
                <div className="text-gray-500 text-xs mb-1">Speed</div>
                <div className="text-gray-800 font-semibold">{busStatus.speed}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-gray-500 text-xs mb-1">Distance</div>
                <div className="text-gray-800 font-semibold">{busStatus.distance}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-gray-500 text-xs mb-1">ETA</div>
                <div className="text-gray-800 font-semibold">{busStatus.eta}</div>
              </div>
            </div>
          </div>
          <button 
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
            onClick={handleOnBoard}
          >
            On Board
          </button>
        </div>
      </div>
      
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex flex-col items-center justify-center z-20">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <div className="text-gray-800">Updating map...</div>
        </div>
      )}
    </div>
  );
};

export default BusDetailsPage;