'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Trophy, Users, Target, Award, Zap, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { getTeamLogo, formatDriverName } from '../utils/images';

interface Statistics {
  total_races: number;
  total_predictions: number;
  average_confidence: number;
  top_drivers: Array<{ driver: string; predicted_wins: number }>;
  top_teams: Array<{ team: string; predicted_wins: number }>;
}

const COLORS = ['#DC2626', '#2563EB', '#16A34A', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export default function Dashboard() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/statistics`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Failed to load statistics');
      }
    } catch (err) {
      setError('Failed to load statistics. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <p className="text-red-800 dark:text-red-200">{error || 'No statistics available'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-white mb-3">
            F1 Prediction Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Comprehensive statistics and insights
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 border-l-4 border-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Races</p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-2">{stats.total_races}</p>
              </div>
              <Trophy className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Predictions</p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-2">{stats.total_predictions}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Confidence</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {Math.round(stats.average_confidence * 100)}%
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Drivers</p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-2">{stats.top_drivers.length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Top Drivers Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Top Predicted Winners (Drivers)
            </h2>
            {stats.top_drivers.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <p className="text-lg mb-2">No prediction data available</p>
                  <p className="text-sm">Generate predictions to see top drivers</p>
                </div>
              </div>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.top_drivers.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="driver" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="predicted_wins" fill="#DC2626" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            )}
          </div>

          {/* Top Teams Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Top Predicted Winners (Teams)
            </h2>
            {stats.top_teams.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <p className="text-lg mb-2">No prediction data available</p>
                  <p className="text-sm">Generate predictions to see top teams</p>
                </div>
              </div>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.top_teams.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="team" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="predicted_wins" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/drivers"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 hover:border-red-600"
          >
            <Users className="w-8 h-8 mb-3 text-red-600" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Driver Profiles</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Explore comprehensive driver statistics and performance analysis</p>
            <div className="flex items-center text-red-600 dark:text-red-400">
              <span className="font-medium text-sm">View All Drivers</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </Link>

          <Link
            href="/standings"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 hover:border-blue-600"
          >
            <Trophy className="w-8 h-8 mb-3 text-blue-600" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Championship Standings</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">View predicted driver and team championship standings</p>
            <div className="flex items-center text-blue-600 dark:text-blue-400">
              <span className="font-medium text-sm">View Standings</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </Link>

          <Link
            href="/"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 hover:border-green-600"
          >
            <Target className="w-8 h-8 mb-3 text-green-600" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Race Predictor</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Get AI-powered predictions for any race</p>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="font-medium text-sm">Make Prediction</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </Link>
        </div>

        {/* Top Drivers List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top 10 Predicted Race Winners
            </h2>
            <Link
              href="/drivers"
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold flex items-center"
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          {stats.top_drivers.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-lg mb-2">No prediction data available</p>
              <p className="text-sm">Generate predictions to see top drivers</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.top_drivers.slice(0, 10).map((driver, index) => (
              <Link
                key={index}
                href={`/drivers/${driver.driver}`}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 border-2 border-transparent hover:border-red-500 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-gray-400">#{index + 1}</span>
                  <Trophy className="w-4 h-4 text-amber-500" />
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                  {formatDriverName(driver.driver)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {driver.predicted_wins} predicted {driver.predicted_wins === 1 ? 'win' : 'wins'}
                </p>
              </Link>
            ))}
          </div>
          )}
        </div>

        {/* Top Teams List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Top 10 Predicted Team Winners
          </h2>
          {stats.top_teams.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-lg mb-2">No prediction data available</p>
              <p className="text-sm">Generate predictions to see top teams</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.top_teams.slice(0, 10).map((team, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 border-2 border-transparent hover:border-blue-500 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-gray-400">#{index + 1}</span>
                  <Award className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex items-center justify-center mb-2">
                  {getTeamLogo(team.team) ? (
                    <div className="relative w-16 h-16">
                      <Image
                        src={`/teams/${getTeamLogo(team.team)}`}
                        alt={team.team}
                        fill
                        className="object-contain"
                        sizes="64px"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <Users className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1 text-center">
                  {team.team}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {team.predicted_wins} predicted {team.predicted_wins === 1 ? 'win' : 'wins'}
                </p>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

