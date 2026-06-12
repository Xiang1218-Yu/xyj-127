export interface Location {
  id: string;
  name: string;
  nameEn: string;
  country: string;
  countryCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  panoramaUrl: string;
  thumbnailUrl: string;
  description: string;
  category: 'city' | 'nature' | 'landmark' | 'beach' | 'mountain';
}

export interface PanoramaState {
  currentLocation: Location | null;
  isTransitioning: boolean;
  cameraFov: number;
}

export type CategoryType = Location['category'];
