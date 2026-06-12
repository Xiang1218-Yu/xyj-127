import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface VisitedLocation {
  id: string;
  visitedAt: number;
  visitCount: number;
}

interface TravelState {
  visitedLocations: VisitedLocation[];
  addVisitedLocation: (locationId: string) => void;
  getVisitCount: (locationId: string) => number;
  hasVisited: (locationId: string) => boolean;
  totalVisits: number;
  uniqueLocations: number;
}

export const useTravelStore = create<TravelState>()(
  persist(
    (set, get) => ({
      visitedLocations: [],
      
      addVisitedLocation: (locationId: string) => {
        set((state) => {
          const existing = state.visitedLocations.find((v) => v.id === locationId);
          if (existing) {
            return {
              visitedLocations: state.visitedLocations.map((v) =>
                v.id === locationId
                  ? { ...v, visitedAt: Date.now(), visitCount: v.visitCount + 1 }
                  : v
              ),
            };
          }
          return {
            visitedLocations: [
              ...state.visitedLocations,
              { id: locationId, visitedAt: Date.now(), visitCount: 1 },
            ],
          };
        });
      },
      
      getVisitCount: (locationId: string) => {
        const visited = get().visitedLocations.find((v) => v.id === locationId);
        return visited?.visitCount || 0;
      },
      
      hasVisited: (locationId: string) => {
        return get().visitedLocations.some((v) => v.id === locationId);
      },
      
      get totalVisits() {
        return get().visitedLocations.reduce((sum, v) => sum + v.visitCount, 0);
      },
      
      get uniqueLocations() {
        return get().visitedLocations.length;
      },
    }),
    {
      name: 'travel-storage',
    }
  )
);
