import { Bus, RouteData } from '../types';
import { routeData } from '../data/routeData';

export const generateBusData = (direction: 'southbound' | 'northbound'): Bus[] => {
  // Get the routes for the current direction
  const routes = routeData[direction];
  
  // Generate 10 random buses
  const buses: Bus[] = [];
  
  for (let i = 0; i < 10; i++) {
    // Get a random route
    const randomRouteIndex = Math.floor(Math.random() * routes.length);
    const route = routes[randomRouteIndex];
    
    // Generate random bus ID, distance, and ETA
    const busId = Math.floor(Math.random() * 9000) + 1000;
    const distance = ((Math.random() * 5) + 0.5).toFixed(1);
    const eta = Math.floor(parseFloat(distance) * 5) + 5;
    
    // Generate bus data
    buses.push({
      id: `bus-${busId}`, // Ensure unique IDs by adding a prefix
      icon: `B${i + 1}`,
      number: `Bus #${busId}`,
      route: route.via ? 
        `${route.origin} → ${route.destination} <span class="via-badge">${route.via}</span>` : 
        `${route.origin} → ${route.destination}`,
      distance: `${distance} km`,
      eta: `${eta} mins`
    });
  }
  
  // Sort buses from nearest to farthest
  return buses.sort((a, b) => {
    const distanceA = parseFloat(a.distance);
    const distanceB = parseFloat(b.distance);
    return distanceA - distanceB;
  });
};

export const getBusById = (busId: string, direction: 'southbound' | 'northbound'): Bus | null => {
  // In a real app, this would fetch from an API
  // For now, we'll generate random data and find the matching bus
  const buses = generateBusData(direction);
  const foundBus = buses.find(bus => bus.id === busId);
  
  if (foundBus) {
    return foundBus;
  }
  
  // If not found in the random data, create a placeholder
  const routes = routeData[direction];
  const randomRouteIndex = Math.floor(Math.random() * routes.length);
  const route = routes[randomRouteIndex];
  
  return {
    id: busId,
    icon: `B${Math.floor(Math.random() * 10) + 1}`,
    number: `Bus #${busId.replace('bus-', '')}`,
    route: route.via ? 
      `${route.origin} → ${route.destination} <span class="via-badge">${route.via}</span>` : 
      `${route.origin} → ${route.destination}`,
    distance: `${(Math.random() * 5 + 0.5).toFixed(1)} km`,
    eta: `${Math.floor(Math.random() * 15) + 2} mins`
  };
};