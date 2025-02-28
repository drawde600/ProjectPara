import { RouteDataMap } from '../types';

export const routeData: RouteDataMap = {
  southbound: [
    { origin: "Iba", destination: "Olongapo", via: null },
    { origin: "Iba", destination: "Pasay", via: "Express" },
    { origin: "Iba", destination: "Caloocan", via: "Express" },
    { origin: "Iba", destination: "Sampaloc", via: "Express" },
    { origin: "Iba", destination: "Cubao", via: "Express" },
    { origin: "Iba", destination: "Pasay", via: "San Fernando" },
    { origin: "Iba", destination: "Caloocan", via: "San Fernando" },
    { origin: "Iba", destination: "Sampaloc", via: "San Fernando" },
    { origin: "Iba", destination: "Cubao", via: "San Fernando" },
    { origin: "Santa Cruz", destination: "Olongapo", via: null },
    { origin: "Santa Cruz", destination: "Pasay", via: "Express" },
    { origin: "Santa Cruz", destination: "Caloocan", via: "Express" },
    { origin: "Santa Cruz", destination: "Sampaloc", via: "Express" },
    { origin: "Santa Cruz", destination: "Pasay", via: "San Fernando" },
    { origin: "Santa Cruz", destination: "Caloocan", via: "San Fernando" },
    { origin: "Santa Cruz", destination: "Sampaloc", via: "San Fernando" }
  ],
  northbound: [
    { origin: "Olongapo", destination: "Iba", via: null },
    { origin: "Pasay", destination: "Iba", via: "Express" },
    { origin: "Caloocan", destination: "Iba", via: "Express" },
    { origin: "Sampaloc", destination: "Iba", via: "Express" },
    { origin: "Cubao", destination: "Iba", via: "Express" },
    { origin: "Pasay", destination: "Iba", via: "San Fernando" },
    { origin: "Caloocan", destination: "Iba", via: "San Fernando" },
    { origin: "Sampaloc", destination: "Iba", via: "San Fernando" },
    { origin: "Cubao", destination: "Iba", via: "San Fernando" },
    { origin: "Olongapo", destination: "Santa Cruz", via: null },
    { origin: "Pasay", destination: "Santa Cruz", via: "Express" },
    { origin: "Caloocan", destination: "Santa Cruz", via: "Express" },
    { origin: "Sampaloc", destination: "Santa Cruz", via: "Express" },
    { origin: "Pasay", destination: "Santa Cruz", via: "San Fernando" },
    { origin: "Caloocan", destination: "Santa Cruz", via: "San Fernando" },
    { origin: "Sampaloc", destination: "Santa Cruz", via: "San Fernando" }
  ]
};