export interface Bus {
  id: string;
  icon: string;
  number: string;
  route: string;
  distance: string;
  eta: string;
}

export interface RouteData {
  origin: string;
  destination: string;
  via: string | null;
}

export interface RouteDataMap {
  southbound: RouteData[];
  northbound: RouteData[];
}