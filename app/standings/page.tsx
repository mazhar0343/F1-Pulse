'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Award, Users } from 'lucide-react';
import { getDriverPortrait, getTeamLogo, formatDriverName } from '../utils/images';

interface DriverStanding {
  driver: string;
  points: number;
  wins: number;
  podiums: number;
  races: number;
}

interface TeamStanding {
  team: string;
  points: number;
  wins: number;
  podiums: number;
}

interface SeasonStandings {
  year: number;
  driver_standings: DriverStanding[];
  team_standings: TeamStanding[];
  total_races: number;
  completed_races: number;
}

export default function StandingsPage() {
  const [standings, setStandings] = useState<SeasonStandings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'drivers' | 'teams'>('drivers');
  const [year, setYear] = useState(2025);

  useEffect(() => {
    loadStandings();
  }, [year]);

  const loadStandings = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/standings/${year}`);
      if (response.ok) {
        const data = await response.json();
        setStandings(data);
      }
    } catch (err) {
      console.error('Failed to load standings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading standings...</p>
        </div>
      </div>
    );
  }

  if (!standings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-red-800 dark:text-red-200">No standings data available</p>
        </div>
      </div>
    );
  }

  const driverChartData = (standings.driver_standings || []).slice(0, 10).map((d, i) => ({
    name: d.driver.replace('_', ' ').substring(0, 10),
    points: d.points,
    wins: d.wins,
    position: i + 1
  }));

  const teamChartData = (standings.team_standings || []).slice(0, 10).map((t, i) => ({
    name: t.team.substring(0, 15),
    points: t.points,
    wins: t.wins,
    position: i + 1
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-white mb-3">
            Predicted Championship Standings
          </h1>
          <div className="mt-3 mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <span className="text-red-800 dark:text-red-200 text-sm font-medium">
                Powered by ML predictions
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            >
              <option value={2025}>2025 Season</option>
            </select>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {standings.completed_races} / {standings.total_races} Races
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'drivers'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Driver Standings
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'teams'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Team Standings
          </button>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Points Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {activeTab === 'drivers' ? 'Predicted Driver Points' : 'Predicted Team Points'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Based on ML model predictions</p>
            <ResponsiveContainer width="100%" height={400}>
              {activeTab === 'drivers' ? (
                <BarChart data={driverChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                  <Bar dataKey="points" fill="#DC2626" radius={[8, 8, 0, 0]} name="Points" />
                </BarChart>
              ) : (
                <BarChart data={teamChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                  <Bar dataKey="points" fill="#2563EB" radius={[8, 8, 0, 0]} name="Points" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Wins Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {activeTab === 'drivers' ? 'Predicted Driver Wins' : 'Predicted Team Wins'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Based on ML model predictions</p>
            <ResponsiveContainer width="100%" height={400}>
              {activeTab === 'drivers' ? (
                <BarChart data={driverChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                  <Bar dataKey="wins" fill="#F59E0B" radius={[8, 8, 0, 0]} name="Wins" />
                </BarChart>
              ) : (
                <BarChart data={teamChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                  <Bar dataKey="wins" fill="#F59E0B" radius={[8, 8, 0, 0]} name="Wins" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Standings Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Predicted {activeTab === 'drivers' ? 'Driver' : 'Team'} Standings
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Based on ML model predictions</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Pos</th>
                  {activeTab === 'drivers' ? (
                    <>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Driver</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Predicted Points</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Predicted Wins</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Predicted Podiums</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Races</th>
                    </>
                  ) : (
                    <>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Team</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Predicted Points</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Predicted Wins</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Predicted Podiums</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {((activeTab === 'drivers' ? standings.driver_standings : standings.team_standings) || []).map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      index < 3 ? 'bg-gradient-to-r from-yellow-50/50 to-transparent dark:from-yellow-900/10' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        {index === 0 && <Trophy className="w-5 h-5 text-yellow-500 mr-2" />}
                        {index === 1 && <Award className="w-5 h-5 text-gray-400 mr-2" />}
                        {index === 2 && <Award className="w-5 h-5 text-orange-400 mr-2" />}
                        <span className="font-semibold text-gray-900 dark:text-white">{index + 1}</span>
                      </div>
                    </td>
                    {activeTab === 'drivers' ? (
                      <>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {getDriverPortrait((item as DriverStanding).driver) ? (
                              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-red-500 flex-shrink-0">
                                <Image
                                  src={`/drivers/driver_portraits/${getDriverPortrait((item as DriverStanding).driver)}`}
                                  alt={formatDriverName((item as DriverStanding).driver)}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                                <Users className="w-6 h-6 text-white" />
                              </div>
                            )}
                            <span className="text-gray-900 dark:text-white font-semibold">
                              {formatDriverName((item as DriverStanding).driver)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-semibold text-red-600 dark:text-red-400">
                            {(item as DriverStanding).points}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center text-gray-900 dark:text-white">
                          {(item as DriverStanding).wins}
                        </td>
                        <td className="py-4 px-4 text-center text-gray-900 dark:text-white">
                          {(item as DriverStanding).podiums}
                        </td>
                        <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">
                          {(item as DriverStanding).races}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {getTeamLogo((item as TeamStanding).team) ? (
                              <div className="relative w-10 h-10 flex-shrink-0">
                                <Image
                                  src={`/teams/${getTeamLogo((item as TeamStanding).team)}`}
                                  alt={(item as TeamStanding).team}
                                  fill
                                  className="object-contain"
                                  sizes="40px"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Users className="w-6 h-6 text-white" />
                              </div>
                            )}
                            <span className="text-gray-900 dark:text-white font-semibold">
                              {(item as TeamStanding).team}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {(item as TeamStanding).points}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center text-gray-900 dark:text-white">
                          {(item as TeamStanding).wins}
                        </td>
                        <td className="py-4 px-4 text-center text-gray-900 dark:text-white">
                          {(item as TeamStanding).podiums}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

