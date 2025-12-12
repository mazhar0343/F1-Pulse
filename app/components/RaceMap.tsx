'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';


// Create red circle marker function
function createRedCircleMarker(size: number = 12, isSelected: boolean = false): L.DivIcon {
  const radius = isSelected ? size * 1.5 : size;
  const borderWidth = isSelected ? 4 : 3;
  return L.divIcon({
    className: 'custom-red-marker',
    html: `<div style="
      width: ${radius * 2}px;
      height: ${radius * 2}px;
      border-radius: 50%;
      background-color: #DC2626;
      border: ${borderWidth}px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      cursor: pointer;
      transition: all 0.2s ease;
    "></div>`,
    iconSize: [radius * 2, radius * 2],
    iconAnchor: [radius, radius],
  });
}

interface RaceInfo {
  raceId: number;
  label: string;
  name: string;
  circuit: string;
  location: string;
  country: string;
  round: number;
  date: string;
  year: number;
}

interface RaceMapProps {
  races: RaceInfo[];
  selectedRaceId: number | null;
  onRaceSelect: (raceId: number) => void;
}

// F1 Circuit coordinates mapping (accurate locations)
// Includes multiple name variations for each circuit
const CIRCUIT_COORDINATES: Record<string, [number, number]> = {
  // Bahrain
  'Bahrain International Circuit': [26.0325, 50.510556],
  'Bahrain': [26.0325, 50.510556],
  'Sakhir': [26.0325, 50.510556],
  
  // Saudi Arabia
  'Jeddah Corniche Circuit': [21.6319, 39.1044],
  'Saudi Arabia': [21.6319, 39.1044],
  'Jeddah': [21.6319, 39.1044],
  
  // Australia
  'Albert Park Circuit': [-37.849722, 144.968333],
  'Australia': [-37.849722, 144.968333],
  'Melbourne': [-37.849722, 144.968333],
  
  // China
  'Shanghai International Circuit': [31.3389, 121.2200],
  'China': [31.3389, 121.2200],
  'Shanghai': [31.3389, 121.2200],
  
  // Japan
  'Suzuka International Racing Course': [34.843056, 136.540556],
  'Japan': [34.843056, 136.540556],
  'Suzuka': [34.843056, 136.540556],
  
  // Miami
  'Miami International Autodrome': [25.9581, -80.2389],
  'Miami': [25.9581, -80.2389],
  
  // Imola (Italy)
  'Autodromo Enzo e Dino Ferrari': [44.3439, 11.7167],
  'Imola': [44.3439, 11.7167],
  'Emilia Romagna': [44.3439, 11.7167],
  
  // Monaco
  'Circuit de Monaco': [43.734722, 7.420556],
  'Monaco': [43.734722, 7.420556],
  
  // Spain
  'Circuit de Barcelona-Catalunya': [41.57, 2.261111],
  'Spain': [41.57, 2.261111],
  'Barcelona': [41.57, 2.261111],
  'Catalunya': [41.57, 2.261111],
  
  // Canada
  'Circuit Gilles-Villeneuve': [45.505833, -73.526667],
  'Canada': [45.505833, -73.526667],
  'Montreal': [45.505833, -73.526667],
  
  // Austria
  'Red Bull Ring': [47.2197, 14.7647],
  'Austria': [47.2197, 14.7647],
  'Spielberg': [47.2197, 14.7647],
  
  // United Kingdom
  'Silverstone Circuit': [52.071, -1.016],
  'United Kingdom': [52.071, -1.016],
  'Silverstone': [52.071, -1.016],
  'Great Britain': [52.071, -1.016],
  
  // Hungary
  'Hungaroring': [47.578889, 19.248611],
  'Hungary': [47.578889, 19.248611],
  'Budapest': [47.578889, 19.248611],
  
  // Belgium
  'Circuit de Spa-Francorchamps': [50.437222, 5.971389],
  'Belgium': [50.437222, 5.971389],
  'Spa': [50.437222, 5.971389],
  'Spa-Francorchamps': [50.437222, 5.971389],
  
  // Netherlands
  'Circuit Zandvoort': [52.3888, 4.5409],
  'Netherlands': [52.3888, 4.5409],
  'Zandvoort': [52.3888, 4.5409],
  'Dutch': [52.3888, 4.5409],
  
  // Italy (Monza)
  'Autodromo Nazionale Monza': [45.620556, 9.289444],
  'Monza': [45.620556, 9.289444],
  'Italy (Monza)': [45.620556, 9.289444],
  
  // Azerbaijan
  'Baku City Circuit': [40.3725, 49.8533],
  'Azerbaijan': [40.3725, 49.8533],
  'Baku': [40.3725, 49.8533],
  
  // Singapore
  'Marina Bay Street Circuit': [1.291403, 103.864147],
  'Singapore': [1.291403, 103.864147],
  'Marina Bay': [1.291403, 103.864147],
  
  // United States (COTA - Austin)
  'Circuit of the Americas': [30.1328, -97.6411],
  'COTA': [30.1328, -97.6411],
  'Austin': [30.1328, -97.6411],
  'Texas': [30.1328, -97.6411],
  
  // United States (Las Vegas)
  'Las Vegas Strip Circuit': [36.1017, -115.1605],
  'Las Vegas': [36.1017, -115.1605],
  'Vegas': [36.1017, -115.1605],
  'Nevada': [36.1017, -115.1605],
  
  // Mexico
  'Autódromo Hermanos Rodríguez': [19.4042, -99.0907],
  'Mexico': [19.4042, -99.0907],
  'Mexico City': [19.4042, -99.0907],
  
  // Brazil
  'Autódromo José Carlos Pace': [-23.703611, -46.699722],
  'Brazil': [-23.703611, -46.699722],
  'São Paulo': [-23.703611, -46.699722],
  'Interlagos': [-23.703611, -46.699722],
  
  // Qatar
  'Lusail International Circuit': [25.4901, 51.4542],
  'Qatar': [25.4901, 51.4542],
  'Lusail': [25.4901, 51.4542],
  
  // Abu Dhabi
  'Yas Marina Circuit': [24.467222, 54.603056],
  'Abu Dhabi': [24.467222, 54.603056],
  'Yas Marina': [24.467222, 54.603056],
  'United Arab Emirates': [24.467222, 54.603056],
};

// Fallback coordinates by country (centered on major city or circuit location)
const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  'Bahrain': [26.0325, 50.510556],
  'Saudi Arabia': [21.6319, 39.1044],
  'Australia': [-37.849722, 144.968333],
  'China': [31.3389, 121.2200],
  'Japan': [34.843056, 136.540556],
  'United States': [30.1328, -97.6411], // COTA (Austin) location
  'Italy': [44.3439, 11.7167], // Imola location
  'Monaco': [43.734722, 7.420556],
  'Spain': [41.57, 2.261111],
  'Canada': [45.505833, -73.526667],
  'Austria': [47.2197, 14.7647],
  'United Kingdom': [52.071, -1.016],
  'Hungary': [47.578889, 19.248611],
  'Belgium': [50.437222, 5.971389],
  'Netherlands': [52.3888, 4.5409],
  'Azerbaijan': [40.3725, 49.8533],
  'Singapore': [1.291403, 103.864147],
  'Mexico': [19.4042, -99.0907],
  'Brazil': [-23.703611, -46.699722],
  'Qatar': [25.4901, 51.4542],
  'United Arab Emirates': [24.467222, 54.603056],
};

function getRaceCoordinates(race: RaceInfo): [number, number] {
  // Helper function for case-insensitive lookup
  const findKey = (searchValue: string, mapping: Record<string, [number, number]>): [number, number] | null => {
    if (!searchValue) return null;
    
    // Exact match (case-insensitive)
    const lowerSearch = searchValue.toLowerCase();
    for (const [key, coords] of Object.entries(mapping)) {
      if (key.toLowerCase() === lowerSearch) {
        return coords;
      }
    }
    
    // Partial match (case-insensitive) - check if search value contains key or vice versa
    for (const [key, coords] of Object.entries(mapping)) {
      const lowerKey = key.toLowerCase();
      if (lowerSearch.includes(lowerKey) || lowerKey.includes(lowerSearch)) {
        return coords;
      }
    }
    
    return null;
  };
  
  // Try circuit name first (with variations)
  const circuitMatch = findKey(race.circuit, CIRCUIT_COORDINATES);
  if (circuitMatch) {
    return circuitMatch;
  }
  
  // Try location
  const locationMatch = findKey(race.location, CIRCUIT_COORDINATES);
  if (locationMatch) {
    return locationMatch;
  }
  
  // Try country (exact match first, then fallback)
  if (COUNTRY_COORDINATES[race.country]) {
    return COUNTRY_COORDINATES[race.country];
  }
  
  const countryMatch = findKey(race.country, COUNTRY_COORDINATES);
  if (countryMatch) {
    return countryMatch;
  }
  
  // Default fallback (center of world)
  return [20, 0];
}

function MapController({ selectedRaceId, races, onRaceSelect }: { selectedRaceId: number | null; races: RaceInfo[]; onRaceSelect: (raceId: number) => void }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedRaceId) {
      const race = races.find(r => r.raceId === selectedRaceId);
      if (race) {
        const [lat, lng] = getRaceCoordinates(race);
        map.setView([lat, lng], 6, { animate: true });
      }
    } else if (races.length > 0) {
      // Center on first race or average of all races
      const coords = races.map(r => getRaceCoordinates(r));
      const avgLat = coords.reduce((sum, [lat]) => sum + lat, 0) / coords.length;
      const avgLng = coords.reduce((sum, [, lng]) => sum + lng, 0) / coords.length;
      map.setView([avgLat, avgLng], 2, { animate: true });
    }
  }, [selectedRaceId, races, map]);
  
  return null;
}

export default function RaceMap({ races, selectedRaceId, onRaceSelect }: RaceMapProps) {
  if (typeof window === 'undefined') {
    return (
      <div className="w-full h-[500px] bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
      </div>
    );
  }


  // Calculate initial center
  const initialCoords = races.length > 0 
    ? getRaceCoordinates(races[0])
    : [20, 0] as [number, number];

  return (
    <div className="w-full h-[500px] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <MapContainer
        center={initialCoords}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <MapController selectedRaceId={selectedRaceId} races={races} onRaceSelect={onRaceSelect} />
        {races.map((race) => {
          const [lat, lng] = getRaceCoordinates(race);
          const isSelected = race.raceId === selectedRaceId;
          
          return (
            <Marker
              key={race.raceId}
              position={[lat, lng]}
              icon={createRedCircleMarker(12, isSelected)}
              eventHandlers={{
                click: () => onRaceSelect(race.raceId),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-gray-900 mb-1">{race.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{race.circuit}</p>
                  <p className="text-xs text-gray-500">{race.location}, {race.country}</p>
                  <p className="text-xs text-gray-500 mt-1">Round {race.round} • {new Date(race.date).toLocaleDateString()}</p>
                  <button
                    onClick={() => onRaceSelect(race.raceId)}
                    className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors"
                  >
                    Select Race
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

