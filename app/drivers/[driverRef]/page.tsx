'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Trophy, TrendingUp, Award, Users, MapPin, Calendar, ArrowLeft, Target, Zap, BarChart3 } from 'lucide-react';
import { getDriverPortrait, getTeamLogo, formatDriverName } from '../../utils/images';

interface DriverProfile {
  driverRef: string;
  driver_name: string;
  total_races: number;
  predicted_wins: number;
  predicted_podiums: number;
  predicted_top_5: number;
  predicted_top_10: number;
  average_predicted_position: number;
  best_predicted_position: number;
  worst_predicted_position: number;
  current_team: string | null;
  races_by_team: Record<string, number>;
  performance_by_circuit: Array<{ circuit: string; avg_position: number; best_position: number; races: number }>;
  position_distribution: Record<number, number>;
  recent_form: Array<{ race_id: number; position: number; team: string }>;
}

const COLORS = ['#DC2626', '#2563EB', '#16A34A', '#F59E0B', '#8B5CF6', '#EC4899'];

export default function DriverProfilePage() {
  const params = useParams();
  const driverRef = params?.driverRef as string;
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (driverRef) {
      loadProfile();
    }
  }, [driverRef]);

  const loadProfile = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/drivers/${driverRef}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        setError('Driver not found');
      }
    } catch (err) {
      setError('Failed to load driver profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading driver profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <p className="text-red-800 dark:text-red-200">{error || 'Driver not found'}</p>
          <Link href="/drivers" className="text-red-600 hover:text-red-700 underline mt-4 inline-block">
            ← Back to Drivers
          </Link>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const positionDistData = Object.entries(profile.position_distribution || {})
    .map(([pos, count]) => ({ position: `P${pos}`, count }))
    .sort((a, b) => parseInt(a.position.slice(1)) - parseInt(b.position.slice(1)));

  const circuitData = (profile.performance_by_circuit || []).slice(0, 10).map(c => ({
    circuit: c.circuit.length > 15 ? c.circuit.substring(0, 15) + '...' : c.circuit,
    avg_position: c.avg_position,
    races: c.races
  }));

  const recentFormData = (profile.recent_form || []).map(f => ({
    race: `R${f.race_id}`,
    position: f.position
  }));

  const portraitFilename = getDriverPortrait(profile.driverRef);
  const portraitPath = portraitFilename ? `/drivers/driver_portraits/${portraitFilename}` : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <Link href="/drivers" className="inline-flex items-center text-red-600 hover:text-red-700 dark:text-red-400 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Drivers
          </Link>

        {/* Hero Section with Portrait */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-800 dark:to-red-900 rounded-3xl shadow-2xl mb-8 overflow-hidden">
          <div className="grid md:grid-cols-3 gap-8 p-8 md:p-12">
            {/* Portrait */}
            <div className="md:col-span-1 flex items-center justify-center">
              {portraitPath ? (
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl bg-white/10 backdrop-blur-sm">
                  <Image
                    src={portraitPath}
                    alt={profile.driver_name}
                    fill
                    className="object-cover"
                    priority
                    sizes="200px"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white/10 backdrop-blur-sm border-4 border-white/20 flex items-center justify-center">
                  <div className="text-6xl font-bold text-white/50">
                    {profile.driver_name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
              )}
            </div>

            {/* Driver Info */}
            <div className="md:col-span-2 flex flex-col justify-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-3 drop-shadow-lg">
            {profile.driver_name}
          </h1>
          {profile.current_team && (
                <div className="flex items-center mb-6">
                  <MapPin className="w-5 h-5 mr-2 opacity-90" />
                  <p className="text-xl md:text-2xl opacity-90 font-medium">
              {profile.current_team}
            </p>
                </div>
          )}
              
              {/* Quick Stats in Hero */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center mb-2">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-300" />
                    <p className="text-sm opacity-90">Wins</p>
                  </div>
                  <p className="text-3xl font-bold">{profile.predicted_wins}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center mb-2">
                    <Award className="w-5 h-5 mr-2 text-gray-300" />
                    <p className="text-sm opacity-90">Podiums</p>
                  </div>
                  <p className="text-3xl font-bold">{profile.predicted_podiums}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center mb-2">
                    <Target className="w-5 h-5 mr-2 text-blue-300" />
                    <p className="text-sm opacity-90">Avg Pos</p>
                  </div>
                  <p className="text-3xl font-bold">{profile.average_predicted_position.toFixed(1)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-3">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg mr-3">
                <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Wins</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{profile.predicted_wins}</p>
            <p className="text-xs text-gray-500 mt-1">Predicted victories</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border-l-4 border-gray-400 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-3">
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mr-3">
                <Award className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Podiums</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{profile.predicted_podiums}</p>
            <p className="text-xs text-gray-500 mt-1">Top 3 finishes</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Top 5</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{profile.predicted_top_5}</p>
            <p className="text-xs text-gray-500 mt-1">Top 5 finishes</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-3">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-3">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Top 10</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{profile.predicted_top_10}</p>
            <p className="text-xs text-gray-500 mt-1">Points finishes</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border-l-4 border-red-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-3">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg mr-3">
                <Target className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Pos</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {profile.average_predicted_position.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Average position</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-3">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg mr-3">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Races</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{profile.total_races}</p>
            <p className="text-xs text-gray-500 mt-1">Total races</p>
          </div>
        </div>

        {/* Additional Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl shadow-lg p-5 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Best Position</p>
              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-4xl font-bold text-blue-700 dark:text-blue-300">P{profile.best_predicted_position}</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl shadow-lg p-5 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Worst Position</p>
              <BarChart3 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-4xl font-bold text-orange-700 dark:text-orange-300">P{profile.worst_predicted_position}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl shadow-lg p-5 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Podium Rate</p>
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-4xl font-bold text-green-700 dark:text-green-300">
              {((profile.predicted_podiums / profile.total_races) * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Position Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg mr-3">
                <BarChart3 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Position Distribution
            </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={positionDistData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis 
                  dataKey="position" 
                  tick={{ fill: '#6b7280', fontSize: 12 }} 
                  className="dark:text-gray-400"
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }} 
                  className="dark:text-gray-400"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151', 
                    borderRadius: '8px',
                    color: '#f3f4f6'
                  }} 
                />
                <Bar dataKey="count" fill="#DC2626" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Circuit Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
                <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Performance by Circuit
            </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={circuitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis 
                  dataKey="circuit" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100} 
                  tick={{ fill: '#6b7280', fontSize: 10 }} 
                  className="dark:text-gray-400"
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }} 
                  className="dark:text-gray-400"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151', 
                    borderRadius: '8px',
                    color: '#f3f4f6'
                  }} 
                />
                <Bar dataKey="avg_position" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-3">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recent Form
          </h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={recentFormData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="race" 
                tick={{ fill: '#6b7280' }} 
                className="dark:text-gray-400"
              />
              <YAxis 
                reversed 
                tick={{ fill: '#6b7280' }} 
                className="dark:text-gray-400"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151', 
                  borderRadius: '8px',
                  color: '#f3f4f6'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="position" 
                stroke="#DC2626" 
                strokeWidth={3} 
                dot={{ fill: '#DC2626', r: 6 }} 
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Team History */}
        {Object.keys(profile.races_by_team).length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg mr-3">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Team History
            </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(profile.races_by_team).map(([team, races]) => (
                <div 
                  key={team} 
                  className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-5 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow"
                >
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Team</p>
                  <div className="flex items-center gap-2 mb-3">
                    {getTeamLogo(team) && (
                      <div className="relative w-8 h-8 flex-shrink-0">
                        <Image
                          src={`/teams/${getTeamLogo(team)}`}
                          alt={team}
                          fill
                          className="object-contain"
                          sizes="32px"
                          unoptimized
                        />
                      </div>
                    )}
                    <p className="font-bold text-lg text-gray-900 dark:text-white">{team}</p>
                  </div>
                  <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400 mr-2">{races}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">races</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {((races / profile.total_races) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

