'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { getDriverPortrait, getTeamLogo, formatDriverName } from './utils/images';

// Dynamically import RaceMap to avoid SSR issues with Leaflet
const RaceMap = dynamic(() => import('./components/RaceMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
      <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
    </div>
  )
});

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

interface Driver {
  driverRef: string;
  driver_name: string;
  total_races: number;
  predicted_wins: number;
  current_team: string | null;
}

interface CustomDriver {
  driverRef: string;
  driver_abbreviation: string;
  team: string;
  grid_position: number;
  recent_form?: number;
}

interface DriverPrediction {
  driverRef: string;
  driver_name: string;
  team: string;
  predicted_position: number;
  grid_position?: number;
}

interface PredictionResult {
  race_name: string;
  race_id: number;
  predicted_winner: string;
  predicted_winner_team: string;
  top_3: Array<{ driver: string; team: string; position: string | number }>;
  full_predictions: DriverPrediction[];
  confidence: number;
  race_date?: string;
  circuit_name?: string;
  round?: number;
  location?: string;
  country?: string;
}

// Driver abbreviations mapping (3-letter codes)
const DRIVER_ABBREVIATIONS: Record<string, string> = {
  'max_verstappen': 'VER',
  'lewis_hamilton': 'HAM',
  'charles_leclerc': 'LEC',
  'carlos_sainz': 'SAI',
  'lando_norris': 'NOR',
  'george_russell': 'RUS',
  'alexander_albon': 'ALB',
  'esteban_ocon': 'OCO',
  'fernando_alonso': 'ALO',
  'lance_stroll': 'STR',
  'pierre_gasly': 'GAS',
  'yuki_tsunoda': 'TSU',
  'nico_hulkenberg': 'HUL',
  'oscar_piastri': 'PIA',
  'valtteri_bottas': 'BOT',
  'guanyu_zhou': 'ZHO',
  'kevin_magnussen': 'MAG',
  'daniel_ricciardo': 'RIC',
  'liam_lawson': 'LAW',
  'oliver_bearman': 'BEA',
  'kimi_antonelli': 'ANT',
  'jack_doohan': 'DOO',
  'isack_hadjar': 'HAD',
  'gabriel_bortoleto': 'BOR',
  'franco_colapinto': 'COL',
};

export default function Home() {
  const [raceName, setRaceName] = useState('');
  const [circuitName, setCircuitName] = useState('');
  const [raceDate, setRaceDate] = useState('');
  const [selectedRaceId, setSelectedRaceId] = useState<number | null>(null);
  const [availableRaces, setAvailableRaces] = useState<RaceInfo[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingRaces, setLoadingRaces] = useState(false);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<'select' | 'custom'>('select');
  
  // Custom scenario state
  const [customDrivers, setCustomDrivers] = useState<CustomDriver[]>([]);
  const [scenarioRaceId, setScenarioRaceId] = useState<number | null>(null);

  // Load available races and drivers on mount
  useEffect(() => {
    loadAvailableRaces();
    loadDrivers();
  }, []);

  const loadAvailableRaces = async () => {
    setLoadingRaces(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/races?year=2025`);
      if (response.ok) {
        const data = await response.json();
        setAvailableRaces(data.races || []);
      }
    } catch (err) {
      console.error('Failed to load races:', err);
    } finally {
      setLoadingRaces(false);
    }
  };

  const loadDrivers = async () => {
    setLoadingDrivers(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/drivers`);
      if (response.ok) {
        const data = await response.json();
        setDrivers(data.drivers || []);
        
        // Initialize custom drivers with all available drivers
        const initialDrivers: CustomDriver[] = (data.drivers || []).slice(0, 20).map((d: Driver, index: number) => ({
          driverRef: d.driverRef,
          driver_abbreviation: DRIVER_ABBREVIATIONS[d.driverRef] || d.driverRef.substring(0, 3).toUpperCase(),
          team: d.current_team || 'Unknown',
          grid_position: index + 1,
        }));
        setCustomDrivers(initialDrivers);
      }
    } catch (err) {
      console.error('Failed to load drivers:', err);
    } finally {
      setLoadingDrivers(false);
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      let response;
      if (searchMode === 'select' && selectedRaceId) {
        // Use race ID endpoint
        response = await fetch(`${apiUrl}/predict/${selectedRaceId}`);
      } else if (searchMode === 'custom') {
        // Use custom scenario endpoint
        if (customDrivers.length === 0) {
          setError('Please add at least one driver');
          setLoading(false);
          return;
        }

        const gridPositions = customDrivers.map(d => d.grid_position);
        if (new Set(gridPositions).size !== gridPositions.length) {
          setError('Grid positions must be unique for each driver');
          setLoading(false);
          return;
        }

        const selectedRace = availableRaces.find(r => r.raceId === scenarioRaceId);
        
        response = await fetch(`${apiUrl}/predict/custom`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            race_name: selectedRace?.name || undefined,
            circuit_name: selectedRace?.circuit || undefined,
            race_date: selectedRace?.date || undefined,
            drivers: customDrivers.map(d => ({
              driverRef: d.driverRef,
              driver_abbreviation: d.driver_abbreviation,
              team: d.team,
              grid_position: d.grid_position,
              recent_form: d.recent_form || undefined,
            })),
          }),
        });
      } else {
        setError('Please select a mode');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to get prediction' }));
        throw new Error(errorData.detail || `Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get prediction. Make sure the FastAPI server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleRaceSelect = (raceId: number) => {
    setSelectedRaceId(raceId);
    const race = availableRaces.find(r => r.raceId === raceId);
    if (race) {
      setRaceName(race.name);
      setCircuitName(race.circuit);
      setRaceDate(race.date);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-3">
            F1 Race Predictor
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-1">
            AI-powered Formula 1 race result predictions
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Select a race from the 2025 season or create a custom scenario
          </p>
          <div className="mt-6 inline-flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
            <span className="text-gray-700 dark:text-gray-300 text-sm">
              Predictions generated using machine learning models
            </span>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          {/* Mode Toggle */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSearchMode('select')}
              className={`flex-1 px-4 py-2.5 rounded-md font-medium transition-all text-sm ${
                searchMode === 'select'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Select from List
            </button>
            <button
              onClick={() => setSearchMode('custom')}
              className={`flex-1 px-4 py-2.5 rounded-md font-medium transition-all text-sm ${
                searchMode === 'custom'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Create Custom Scenario
            </button>
          </div>

          <div className="space-y-6">
            {searchMode === 'select' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select Race <span className="text-red-500">*</span>
                </label>
                {loadingRaces ? (
                  <div className="w-full h-[500px] bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    <div className="text-gray-500 dark:text-gray-400">Loading races...</div>
                  </div>
                ) : (
                  <RaceMap
                    races={availableRaces}
                    selectedRaceId={selectedRaceId}
                    onRaceSelect={handleRaceSelect}
                  />
                )}
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Click on a marker to select a race, or use the dropdown below
                </p>
                {!loadingRaces && availableRaces.length > 0 && (
                  <select
                    value={selectedRaceId || ''}
                    onChange={(e) => handleRaceSelect(Number(e.target.value))}
                    className="mt-3 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                    disabled={loading}
                  >
                    <option value="">-- Or select from dropdown --</option>
                    {availableRaces.map((race) => (
                      <option key={race.raceId} value={race.raceId}>
                        {race.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ) : (
              <>
                {/* Optional Race Selection for Custom Scenario */}
                <div className="mb-6">
                  <label htmlFor="scenarioRace" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Race Context (Optional)
                  </label>
                  <select
                    id="scenarioRace"
                    value={scenarioRaceId || ''}
                    onChange={(e) => setScenarioRaceId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    disabled={loading}
                  >
                    <option value="">-- Select a race for context (optional) --</option>
                    {availableRaces.map((race) => (
                      <option key={race.raceId} value={race.raceId}>
                        {race.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Choose a race to provide context (circuit, date) for your custom scenario
                  </p>
                </div>

                {/* Driver Configuration */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Driver Lineup <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const existingRefs = new Set(customDrivers.map(d => d.driverRef));
                        const availableDriver = drivers.find(d => !existingRefs.has(d.driverRef));
                        if (availableDriver) {
                          setCustomDrivers(prev => [...prev, {
                            driverRef: availableDriver.driverRef,
                            driver_abbreviation: DRIVER_ABBREVIATIONS[availableDriver.driverRef] || availableDriver.driverRef.substring(0, 3).toUpperCase(),
                            team: availableDriver.current_team || 'Unknown',
                            grid_position: prev.length + 1,
                          }]);
                        }
                      }}
                      className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                      disabled={loading || loadingDrivers}
                    >
                      + Add Driver
                    </button>
                  </div>

                  {loadingDrivers ? (
                    <div className="text-center py-4 text-gray-500">Loading drivers...</div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {customDrivers.map((driver, index) => (
                        <div
                          key={`${driver.driverRef}-${index}`}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Driver
                              </label>
                              <select
                                value={driver.driverRef}
                                onChange={(e) => {
                                  const selectedDriver = drivers.find(d => d.driverRef === e.target.value);
                                  if (selectedDriver) {
                                    setCustomDrivers(prev => prev.map((d, i) => 
                                      i === index ? {
                                        ...d,
                                        driverRef: selectedDriver.driverRef,
                                        driver_abbreviation: DRIVER_ABBREVIATIONS[selectedDriver.driverRef] || selectedDriver.driverRef.substring(0, 3).toUpperCase(),
                                        team: selectedDriver.current_team || 'Unknown',
                                      } : d
                                    ));
                                  }
                                }}
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                disabled={loading}
                              >
                                {drivers.map(d => (
                                  <option key={d.driverRef} value={d.driverRef}>
                                    {d.driver_name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Team
                              </label>
                              <input
                                type="text"
                                value={driver.team}
                                onChange={(e) => {
                                  setCustomDrivers(prev => prev.map((d, i) => 
                                    i === index ? { ...d, team: e.target.value } : d
                                  ));
                                }}
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                disabled={loading}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Grid Position
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="20"
                                value={driver.grid_position}
                                onChange={(e) => {
                                  const pos = Math.max(1, Math.min(20, parseInt(e.target.value) || 1));
                                  setCustomDrivers(prev => prev.map((d, i) => 
                                    i === index ? { ...d, grid_position: pos } : d
                                  ));
                                }}
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                disabled={loading}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Recent Form (Optional)
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="20"
                                step="0.1"
                                value={driver.recent_form || ''}
                                onChange={(e) => {
                                  setCustomDrivers(prev => prev.map((d, i) => 
                                    i === index ? { ...d, recent_form: e.target.value ? parseFloat(e.target.value) : undefined } : d
                                  ));
                                }}
                                placeholder="Avg pos"
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                disabled={loading}
                              />
                            </div>
                            <div>
                              <button
                                type="button"
                                onClick={() => {
                                  setCustomDrivers(prev => prev.filter((_, i) => i !== index));
                                }}
                                className="w-full px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                                disabled={loading}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            <button
              onClick={handlePredict}
              disabled={loading || (searchMode === 'select' && !selectedRaceId) || (searchMode === 'custom' && customDrivers.length === 0)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating prediction...
                </span>
              ) : (
                'Generate Prediction'
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-red-800 dark:text-red-200 font-semibold mb-1">Prediction Error</p>
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                {error.includes('qualifying') || error.includes('Qualifying') ? (
                  <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                    <p className="text-yellow-800 dark:text-yellow-200 text-xs">
                      <strong>Note:</strong> The ML model needs qualifying data to make predictions. 
                      For future races, predictions will be available after qualifying sessions are completed.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Results Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Prediction Results
              </h2>

              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Predicted Winner</p>
                    <div className="flex items-center gap-4">
                      {getDriverPortrait(result.predicted_winner) && (
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-red-600 flex-shrink-0">
                          <Image
                            src={`/drivers/driver_portraits/${getDriverPortrait(result.predicted_winner)}`}
                            alt={formatDriverName(result.predicted_winner)}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {formatDriverName(result.predicted_winner)}
                          </p>
                          {getTeamLogo(result.predicted_winner_team) && (
                            <div className="relative w-8 h-8">
                              <Image
                                src={`/teams/${getTeamLogo(result.predicted_winner_team)}`}
                                alt={result.predicted_winner_team}
                                fill
                                className="object-contain"
                                unoptimized
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{result.predicted_winner_team}</p>
                      </div>
                    </div>
                  </div>
                  {result.confidence && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Confidence</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{Math.round(result.confidence * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${result.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {result.top_3 && result.top_3.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Top 3 Finishers</h3>
                    <div className="space-y-3">
                      {result.top_3?.map((driver, index) => {
                        const driverRef = driver.driver;
                        const driverPortrait = getDriverPortrait(driverRef);
                        const teamLogo = getTeamLogo(driver.team);
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-md p-4 border border-gray-200 dark:border-gray-700"
                          >
                            <span className="w-10 h-10 flex items-center justify-center bg-red-600 text-white rounded-full text-base font-semibold flex-shrink-0">
                              {index + 1}
                            </span>
                            {driverPortrait && (
                              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 flex-shrink-0">
                                <Image
                                  src={`/drivers/driver_portraits/${driverPortrait}`}
                                  alt={formatDriverName(driverRef)}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-base font-semibold text-gray-900 dark:text-white">
                                  {formatDriverName(driverRef)}
                                </span>
                                {teamLogo && (
                                  <div className="relative w-6 h-6 flex-shrink-0">
                                    <Image
                                      src={`/teams/${teamLogo}`}
                                      alt={driver.team}
                                      fill
                                      className="object-contain"
                                      unoptimized
                                    />
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{driver.team}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {result.race_name && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Race:</span> {result.race_name}
                          {result.round && ` (Round ${result.round})`}
                        </p>
                        {result.circuit_name && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <span className="font-medium">Circuit:</span> {result.circuit_name}
                            {result.location && `, ${result.location}`}
                            {result.country && `, ${result.country}`}
                          </p>
                        )}
                        {result.race_date && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <span className="font-medium">Date:</span> {new Date(result.race_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {/* Only show compare button for real races (race_id > 0) */}
                      {result.race_id > 0 && (
                        <a
                          href={`/compare/${result.race_id}`}
                          className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                        >
                          Compare with Actual Results
                        </a>
                      )}
                      {result.race_id === 0 && (
                        <div className="inline-flex items-center justify-center px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium rounded-md text-sm">
                          Custom Scenario (No actual results available)
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Full Predictions Table */}
            {result.full_predictions && result.full_predictions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Full Race Predictions
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Position</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Driver</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Team</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Grid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.full_predictions?.map((pred, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {pred.predicted_position}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {getDriverPortrait(pred.driverRef) && (
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 flex-shrink-0">
                                  <Image
                                    src={`/drivers/driver_portraits/${getDriverPortrait(pred.driverRef)}`}
                                    alt={pred.driver_name}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                </div>
                              )}
                              <span className="text-gray-900 dark:text-white font-medium">
                                {formatDriverName(pred.driverRef)}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {getTeamLogo(pred.team) && (
                                <div className="relative w-5 h-5 flex-shrink-0">
                                  <Image
                                    src={`/teams/${getTeamLogo(pred.team)}`}
                                    alt={pred.team}
                                    fill
                                    className="object-contain"
                                    unoptimized
                                  />
                                </div>
                              )}
                              <span className="text-gray-600 dark:text-gray-400">{pred.team}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {pred.grid_position !== null && pred.grid_position !== undefined
                              ? pred.grid_position
                              : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 mb-8">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              New to Formula 1?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Learn about the world's premier racing championship, its history, teams, and cutting-edge technology.
            </p>
            <Link
              href="/what-is-f1"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Learn About F1 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
