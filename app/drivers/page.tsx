'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Users } from 'lucide-react';
import { getDriverPortrait, getTeamLogo, formatDriverName } from '../utils/images';

interface Driver {
  driverRef: string;
  driver_name: string;
  total_races: number;
  predicted_wins: number;
  current_team: string | null;
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/drivers`);
      if (response.ok) {
        const data = await response.json();
        setDrivers(data.drivers || []);
      }
    } catch (err) {
      console.error('Failed to load drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading drivers...</p>
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
            Driver Profiles
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Comprehensive driver statistics and performance analysis
          </p>
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {drivers.map((driver, index) => (
            <Link
              key={driver.driverRef}
              href={`/drivers/${driver.driverRef}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 hover:border-red-600"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {index + 1}
                </div>
                {driver.predicted_wins > 0 && (
                  <Trophy className="w-5 h-5 text-amber-500" />
                )}
              </div>
              
              {/* Driver Photo */}
              <div className="mb-4 flex justify-center">
                {getDriverPortrait(driver.driverRef) ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-red-500">
                    <Image
                      src={`/drivers/driver_portraits/${getDriverPortrait(driver.driverRef)}`}
                      alt={formatDriverName(driver.driverRef)}
                      fill
                      className="object-cover"
                      sizes="96px"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                {formatDriverName(driver.driverRef)}
              </h3>
              
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Predicted Wins</span>
                  <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                    {driver.predicted_wins}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Races</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {driver.total_races}
                  </span>
                </div>
                {driver.current_team && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Team</span>
                    <div className="flex items-center gap-2">
                      {getTeamLogo(driver.current_team) && (
                        <div className="relative w-6 h-6">
                          <Image
                            src={`/teams/${getTeamLogo(driver.current_team)}`}
                            alt={driver.current_team}
                            fill
                            className="object-contain"
                            sizes="24px"
                            unoptimized
                          />
                        </div>
                      )}
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {driver.current_team}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  View Profile →
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}

