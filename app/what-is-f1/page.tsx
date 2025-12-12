'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WhatIsF1() {
  const [activeTab, setActiveTab] = useState<'overview' | 'basics' | 'history' | 'teams' | 'technology' | 'watching'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: '📋' },
    { id: 'basics' as const, label: 'The Basics', icon: '🎓' },
    { id: 'history' as const, label: 'History', icon: '📜' },
    { id: 'teams' as const, label: 'Teams', icon: '🏁' },
    { id: 'technology' as const, label: 'Technology', icon: '⚙️' },
    { id: 'watching' as const, label: 'Watching F1', icon: '📺' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="text-7xl animate-bounce">🏎️</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            What is Formula 1?
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The pinnacle of motorsport racing, where cutting-edge technology meets human excellence
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 mb-12">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  The World&apos;s Premier Racing Championship
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  Formula 1, often abbreviated as F1, is the highest class of international auto racing for single-seater formula racing cars. 
                  It&apos;s a global phenomenon that combines speed, strategy, technology, and human skill in the most intense racing competition on Earth.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  Founded in 1950, Formula 1 has grown into one of the world&apos;s most-watched sporting events, with over 500 million fans tuning in 
                  to watch 24 races across 5 continents each season. It&apos;s not just a sport—it&apos;s a showcase of human achievement, engineering excellence, 
                  and the relentless pursuit of perfection.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                    <span className="mr-2">🌍</span>
                    Global Reach
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    F1 races across 5 continents, visiting iconic circuits from Monaco to Singapore, 
                    attracting millions of fans worldwide each season.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                    <span className="mr-2">⚡</span>
                    Extreme Speed
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    F1 cars can reach speeds over 200 mph (320 km/h), with acceleration from 0-60 mph 
                    in under 2 seconds, making them among the fastest racing cars in the world.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                    <span className="mr-2">🧠</span>
                    Strategy & Skill
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Every race is a complex puzzle involving tire strategy, fuel management, weather conditions, 
                    and split-second decision making by drivers and teams.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                    <span className="mr-2">🏆</span>
                    Championship Points
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Drivers and teams compete for points throughout the season. The top 10 finishers score points, 
                    with the winner earning 25 points, creating intense competition at every race.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  How a Race Weekend Works
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Practice Sessions (Friday & Saturday)</h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-2">
                        Teams test their cars and gather data on Friday and Saturday morning to optimize performance.
                        There are typically 3 practice sessions: FP1 and FP2 on Friday, FP3 on Saturday morning.
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Purpose:</strong> Test car setup, tire compounds, fuel loads, and gather telemetry data. 
                        Teams experiment with different configurations to find the optimal balance between speed and tire wear.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Qualifying (Saturday Afternoon)</h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-2">
                        Drivers compete for the best starting position on Saturday. The fastest driver starts from &quot;pole position&quot; (first place on the grid).
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Format:</strong> Three-part knockout session (Q1, Q2, Q3). Slowest drivers are eliminated each round. 
                        Q3 determines the top 10 starting positions. Grid position is crucial—starting near the front significantly increases chances of winning.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Race Day (Sunday)</h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-2">
                        The main event! Typically 50-70 laps around the circuit, lasting about 90 minutes. 
                        Strategy, skill, and sometimes luck determine the winner.
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Key Elements:</strong> Pit stops for tire changes, fuel strategy, overtaking opportunities, 
                        weather conditions, and managing tire degradation. Every decision matters in this high-stakes battle.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Why Formula 1 is Special
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🏎️ The Fastest Racing Cars</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      F1 cars are the fastest regulated road-course racing cars in the world, capable of cornering at speeds that would cause most cars to lose control.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🌍 Truly Global Sport</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Races take place across 5 continents, from the streets of Monaco to the deserts of Bahrain, showcasing diverse cultures and iconic locations.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🧬 Innovation Lab</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      F1 drives automotive innovation. Technologies developed here often make their way into road cars, improving safety and efficiency for everyone.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">👥 Human Drama</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Beyond the machines, F1 is about human stories—rivalries, comebacks, triumphs, and heartbreaks that captivate millions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'basics' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Understanding Formula 1: The Essentials
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  New to F1? Here&apos;s everything you need to know to understand and enjoy the sport.
                </p>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  📊 The Points System
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Points are awarded to the top 10 finishers in each race. The driver and team with the most points at the end of the season wins the championship.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { position: '1st', points: 25, emoji: '🥇' },
                    { position: '2nd', points: 18, emoji: '🥈' },
                    { position: '3rd', points: 15, emoji: '🥉' },
                    { position: '4th', points: 12, emoji: '4️⃣' },
                    { position: '5th', points: 10, emoji: '5️⃣' },
                    { position: '6th', points: 8, emoji: '6️⃣' },
                    { position: '7th', points: 6, emoji: '7️⃣' },
                    { position: '8th', points: 4, emoji: '8️⃣' },
                    { position: '9th', points: 2, emoji: '9️⃣' },
                    { position: '10th', points: 1, emoji: '🔟' },
                  ].map((item) => (
                    <div key={item.position} className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-2xl mb-1">{item.emoji}</div>
                      <div className="font-bold text-gray-900 dark:text-white">{item.position}</div>
                      <div className="text-sm text-red-600 dark:text-red-400 font-semibold">{item.points} pts</div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                  <strong>Bonus Points:</strong> 1 point is awarded for the fastest lap if the driver finishes in the top 10.
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  🏁 Key Terms Every Fan Should Know
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Pole Position</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      The first position on the starting grid, awarded to the fastest driver in qualifying. Starting from pole gives a significant advantage.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Pit Stop</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      When a car enters the pit lane to change tires, make adjustments, or fix issues. Modern pit stops take just 2-3 seconds!
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">DNF (Did Not Finish)</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      When a driver fails to complete the race due to mechanical failure, crash, or other issues. No points are awarded.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">DRS (Drag Reduction System)</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      A movable rear wing that opens on designated straight sections to reduce drag and increase speed, making overtaking easier.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Safety Car</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Deployed when track conditions are unsafe. All cars must slow down and follow the safety car, maintaining their positions.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Virtual Safety Car (VSC)</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      A digital safety car that requires drivers to maintain a specific speed limit, used for less severe incidents.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Undercut</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      A strategy where a driver pits earlier than their rival to gain track position by using fresh tires to go faster.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Overcut</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      The opposite of undercut—staying out longer on track to build a gap before pitting, hoping to emerge ahead.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  🛞 Tire Compounds Explained
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  F1 uses three tire compounds, each offering different performance characteristics. Teams must use at least two different compounds during a race.
                </p>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-red-500">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Soft Tires (Red)</h4>
                      <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-1 rounded">Fastest</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Maximum grip and speed, but wear out quickly. Best for qualifying and short stints. Typically lasts 15-25 laps depending on the track.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Medium Tires (Yellow)</h4>
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">Balanced</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Good balance between speed and durability. Most versatile compound. Can last 25-40 laps, making it popular for race strategy.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-white border-opacity-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Hard Tires (White)</h4>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">Most Durable</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Slowest but most durable. Can last 40+ laps. Used for long stints and when teams want to minimize pit stops.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Wet Tires (Blue/Green)</h4>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">Rain</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Special tires for wet conditions. Full wets (blue) for heavy rain, intermediates (green) for light rain or drying tracks.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  🏆 The Championships
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-5">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                      <span className="mr-2">👤</span>
                      Drivers&apos; Championship
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      Individual drivers compete for the World Drivers&apos; Championship. Points earned in each race accumulate throughout the season.
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Current Record:</strong> Lewis Hamilton and Michael Schumacher (7 titles each)
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-5">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                      <span className="mr-2">🏭</span>
                      Constructors&apos; Championship
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      Teams compete for the Constructors&apos; Championship. Points from both drivers are combined to determine the team&apos;s total.
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Current Record:</strong> Ferrari (16 titles)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  ⚠️ Flags and Penalties
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Flags</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-500 rounded"></div>
                        <span className="text-gray-700 dark:text-gray-300"><strong>Green:</strong> Track is clear, racing conditions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-yellow-500 rounded"></div>
                        <span className="text-gray-700 dark:text-gray-300"><strong>Yellow:</strong> Danger ahead, slow down, no overtaking</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-red-500 rounded"></div>
                        <span className="text-gray-700 dark:text-gray-300"><strong>Red:</strong> Race stopped, return to pits</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded"></div>
                        <span className="text-gray-700 dark:text-gray-300"><strong>Blue:</strong> Faster car behind, let them pass</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-black rounded border-2 border-white"></div>
                        <span className="text-gray-700 dark:text-gray-300"><strong>Black:</strong> Driver disqualified</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Common Penalties</h4>
                    <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <p><strong>5-Second Penalty:</strong> Added to race time for minor infractions (e.g., track limits)</p>
                      <p><strong>10-Second Penalty:</strong> For more serious violations (e.g., causing a collision)</p>
                      <p><strong>Drive-Through:</strong> Must drive through pit lane at speed limit (no stopping)</p>
                      <p><strong>Stop-Go:</strong> Must stop in pit box for 10 seconds</p>
                      <p><strong>Grid Penalty:</strong> Start next race from further back on the grid</p>
                      <p><strong>Disqualification:</strong> Removed from race results</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  A Rich Racing Heritage
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Formula 1 has a storied history spanning over 70 years, evolving from simple road cars 
                  to the sophisticated machines we see today. The sport has witnessed incredible technological 
                  advances, legendary drivers, and unforgettable moments that have shaped motorsport history.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  From the first championship race at Silverstone in 1950 to the modern hybrid era, F1 has 
                  continuously pushed the boundaries of what&apos;s possible in automotive engineering and human performance.
                </p>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-red-600 pl-6 py-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">1950s - The Beginning</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    The first official F1 World Championship race was held at Silverstone, UK on May 13, 1950. 
                    Italian driver Giuseppe Farina became the first World Champion, driving for Alfa Romeo.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Key Facts:</strong> Cars were front-engined, used naturally aspirated engines, and races were much longer (some over 3 hours). 
                    Safety was minimal—drivers wore simple helmets and no seatbelts. The sport was dominated by Italian manufacturers (Ferrari, Alfa Romeo, Maserati).
                  </p>
                </div>

                <div className="border-l-4 border-red-600 pl-6 py-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">1960s-1970s - Safety Revolution & Innovation</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Safety improvements became paramount after several tragic accidents. Innovations like seatbelts, fire-resistant suits, 
                    improved circuit safety measures, and better car construction were introduced.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Key Developments:</strong> Rear-engine cars became standard (pioneered by Cooper), wings were introduced for downforce, 
                    and ground-effect aerodynamics emerged. Legendary drivers like Jim Clark, Jackie Stewart, and Niki Lauda competed in this era. 
                    Stewart&apos;s safety advocacy led to significant improvements in driver protection.
                  </p>
                </div>

                <div className="border-l-4 border-red-600 pl-6 py-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">1980s-1990s - Turbo Era & Golden Age</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Turbocharged engines dominated, producing over 1000 horsepower. This era featured some of F1&apos;s greatest drivers 
                    and most intense rivalries, particularly the legendary battles between Ayrton Senna and Alain Prost.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Memorable Moments:</strong> Senna&apos;s incredible qualifying laps, Prost&apos;s strategic brilliance, 
                    the rise of active suspension and semi-automatic gearboxes. Tragically, this era also saw the deaths of Senna and 
                    Roland Ratzenberger in 1994, leading to further safety improvements including the introduction of the safety car.
                  </p>
                </div>

                <div className="border-l-4 border-red-600 pl-6 py-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">2000s - Schumacher Era & Global Expansion</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Michael Schumacher&apos;s unprecedented dominance with Ferrari (5 consecutive championships, 2000-2004) brought F1 to new heights. 
                    The sport expanded globally with new races in Asia, Middle East, and the Americas.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Key Changes:</strong> Introduction of grooved tires to reduce speeds, refueling during races (banned in 2010), 
                    and the rise of new circuits like Shanghai, Bahrain, and Abu Dhabi. The sport became more commercialized with increased 
                    TV coverage and digital presence, making it accessible to millions of new fans worldwide.
                  </p>
                </div>

                <div className="border-l-4 border-red-600 pl-6 py-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">2010s-Present - Hybrid Era & Sustainability</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Introduction of hybrid power units (V6 turbo + energy recovery systems) in 2014 revolutionized the sport. 
                    Focus shifted to sustainability, diversity, and making F1 carbon neutral by 2030.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Modern Developments:</strong> Lewis Hamilton&apos;s record-equaling 7 championships, Max Verstappen&apos;s dominance, 
                    the introduction of sprint races, budget caps to level the playing field, and the Netflix &quot;Drive to Survive&quot; series 
                    that brought millions of new fans to the sport. F1 is now more competitive, sustainable, and accessible than ever.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Legendary Drivers
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  F1 has been graced by some of the greatest drivers in motorsport history:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Lewis Hamilton</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">7 World Championships (2008, 2014-2020)</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Most race wins (103), most pole positions (104). Known for his activism and diversity work.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Michael Schumacher</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">7 World Championships (1994-1995, 2000-2004)</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Dominant with Ferrari, revolutionized fitness and preparation standards in F1.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Ayrton Senna</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">3 World Championships (1988, 1990-1991)</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Considered one of the greatest drivers ever. Known for his qualifying prowess and wet-weather skills.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Max Verstappen</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">3+ World Championships (2021-2023+)</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Youngest F1 driver ever (17), youngest race winner. Currently dominating the sport.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Sebastian Vettel</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">4 World Championships (2010-2013)</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Youngest World Champion (2010). Won 4 consecutive titles with Red Bull.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Alain Prost</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">4 World Championships (1985-1986, 1989, 1993)</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Known as &quot;The Professor&quot; for his strategic approach. Rivalry with Senna is legendary.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'teams' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  The Powerhouses of F1
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  Ten teams compete in Formula 1, each with two drivers. These teams are massive organizations 
                  with hundreds of employees working to achieve racing perfection.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { name: 'Red Bull Racing', country: 'Austria', color: 'from-blue-500 to-red-500', drivers: 'Max Verstappen, Sergio Perez' },
                  { name: 'Mercedes', country: 'Germany', color: 'from-gray-400 to-gray-600', drivers: 'Lewis Hamilton, George Russell' },
                  { name: 'Ferrari', country: 'Italy', color: 'from-red-500 to-red-700', drivers: 'Charles Leclerc, Carlos Sainz' },
                  { name: 'McLaren', country: 'United Kingdom', color: 'from-orange-500 to-blue-500', drivers: 'Lando Norris, Oscar Piastri' },
                  { name: 'Aston Martin', country: 'United Kingdom', color: 'from-green-500 to-green-700', drivers: 'Fernando Alonso, Lance Stroll' },
                  { name: 'Alpine', country: 'France', color: 'from-pink-500 to-blue-500', drivers: 'Pierre Gasly, Esteban Ocon' },
                  { name: 'Williams', country: 'United Kingdom', color: 'from-blue-600 to-blue-800', drivers: 'Alex Albon, Logan Sargeant' },
                  { name: 'Haas', country: 'United States', color: 'from-red-600 to-gray-600', drivers: 'Kevin Magnussen, Nico Hülkenberg' },
                  { name: 'RB (AlphaTauri)', country: 'Italy', color: 'from-blue-400 to-white', drivers: 'Yuki Tsunoda, Daniel Ricciardo' },
                  { name: 'Sauber', country: 'Switzerland', color: 'from-green-400 to-blue-400', drivers: 'Valtteri Bottas, Zhou Guanyu' },
                ].map((team, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-br ${team.color} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{team.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">📍 {team.country}</p>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Drivers:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{team.drivers}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Team Structure & Organization
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Each F1 team is a massive organization with hundreds of employees working in specialized roles. Top teams can have 800-1000+ staff members!
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Track Team (Race Weekend)</h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        <span><strong>Drivers (2):</strong> The stars who race the cars</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        <span><strong>Race Engineers:</strong> Communicate with drivers, analyze data in real-time</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        <span><strong>Pit Crew (20+):</strong> Execute lightning-fast pit stops (often under 2 seconds!)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        <span><strong>Strategy Engineers:</strong> Make real-time decisions during races</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        <span><strong>Mechanics:</strong> Maintain and repair cars at the track</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Factory Team (Headquarters)</h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                        <span><strong>Design Engineers:</strong> Design car components using advanced CAD software</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                        <span><strong>Aerodynamics Team:</strong> Optimize airflow using wind tunnels and CFD</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                        <span><strong>Manufacturing:</strong> Build car parts using carbon fiber and advanced materials</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                        <span><strong>Data Analysts:</strong> Process telemetry data to improve performance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                        <span><strong>Management:</strong> Team principals, technical directors, and executives</span>
                  </li>
                </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  💰 Team Budgets & Competition
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  F1 teams operate on massive budgets, though spending is now capped to create more competitive racing:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Budget Cap (2025)</h4>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">$135M</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Maximum spending per season (excluding driver salaries, top 3 salaries, and marketing)
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Team Sizes</h4>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">800-1000+</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Employees at top teams (Mercedes, Red Bull, Ferrari)
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Car Development</h4>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">24/7</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Continuous development throughout the season to improve performance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'technology' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Cutting-Edge Engineering
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  F1 cars are technological marvels, representing the pinnacle of automotive engineering. 
                  Innovations developed in F1 often find their way into road cars.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                    <span className="mr-2">🔋</span>
                    Hybrid Power Units
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Modern F1 cars use 1.6L V6 turbocharged engines combined with Energy Recovery Systems (ERS) 
                    that capture energy from braking and exhaust gases.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Power Output:</strong> Over 1000 horsepower
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                    <span className="mr-2">💨</span>
                    Aerodynamics
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Every surface is designed to manipulate airflow. Wings, diffusers, and bodywork create 
                    downforce that pushes the car into the track for better grip.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Downforce:</strong> Up to 5 times the car&apos;s weight at high speed
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                    <span className="mr-2">🛞</span>
                    Advanced Tires
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    F1 uses specialized tires for different conditions: soft (fast but wear quickly), 
                    medium (balanced), and hard (durable but slower).
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Tire Strategy:</strong> Critical to race success
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                    <span className="mr-2">📊</span>
                    Data & Telemetry
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Hundreds of sensors monitor every aspect of the car in real-time. Teams analyze 
                    massive amounts of data to optimize performance.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Data Points:</strong> Thousands per second
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Safety Innovations
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Halo Device</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Titanium structure protecting drivers&apos; heads from impacts
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Crash Structures</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Energy-absorbing materials that protect drivers in crashes
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Medical Car</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Always ready to respond within seconds of any incident
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Road Car Technology Transfer
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Many technologies developed for F1 have made their way into everyday cars, improving safety, efficiency, and performance for millions of drivers:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                      <span><strong>Carbon fiber construction:</strong> Lighter, stronger materials now used in high-end and increasingly mainstream cars</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                      <span><strong>Hybrid powertrains:</strong> F1&apos;s energy recovery systems inspired modern hybrid and electric vehicles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                      <span><strong>Advanced aerodynamics:</strong> Better fuel economy through improved airflow management</span>
                    </li>
                  </ul>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">✓</span>
                      <span><strong>Energy recovery systems:</strong> Regenerative braking technology in modern hybrids and EVs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                      <span><strong>Safety innovations:</strong> Improved crash protection, seatbelt technology, and driver safety systems</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                      <span><strong>Telemetry and diagnostics:</strong> Advanced monitoring systems in modern vehicles</span>
                  </li>
                </ul>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  🏎️ F1 Car Specifications (2025)
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Engine</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      1.6L V6 turbocharged hybrid power unit with Energy Recovery Systems (ERS)
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Power Output</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Over 1000 horsepower (combined ICE + ERS)
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Weight</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Minimum 798 kg (including driver, fuel, and all fluids)
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Top Speed</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Over 220 mph (350+ km/h) on certain tracks
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">0-60 mph</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Under 2 seconds (faster than most supercars)
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Downforce</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Up to 5 times the car&apos;s weight at high speed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'watching' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  How to Watch and Enjoy Formula 1
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  New to watching F1? Here&apos;s your complete guide to getting the most out of every race weekend.
                </p>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  📺 Where to Watch
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">F1 TV (Official)</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      The official streaming service offering live races, on-board cameras, team radio, and exclusive content.
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>Features:</strong> Live timing, multiple camera angles, driver tracking, and full race replays
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">TV Broadcasters</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Major networks worldwide broadcast F1 races. Check your local listings for coverage in your region.
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>Popular:</strong> ESPN (USA), Sky Sports (UK), Canal+ (France), RTL (Germany)
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Streaming Services</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Many streaming platforms offer F1 coverage as part of their sports packages.
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>Options:</strong> ESPN+, DAZN, and regional sports streaming services
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Social Media</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Follow F1 on YouTube, Instagram, Twitter, and TikTok for highlights, behind-the-scenes content, and race updates.
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>Best for:</strong> Quick highlights, driver interviews, and staying updated
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  🎯 What to Watch For During a Race
                </h3>
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <span className="mr-2">🏁</span>
                      The Start
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      The first corner is often chaotic! Watch for drivers making bold moves, potential collisions, and who gains or loses positions. 
                      A good start can make or break a race.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <span className="mr-2">🔄</span>
                      Pit Stops
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Teams execute tire changes in 2-3 seconds! Watch for strategy decisions—when teams pit can determine the race outcome. 
                      The &quot;undercut&quot; (pitting early) and &quot;overcut&quot; (pitting late) are key strategic moves.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <span className="mr-2">⚔️</span>
                      Battles & Overtaking
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Watch for wheel-to-wheel racing, especially in DRS zones (designated overtaking areas). Drivers use slipstreaming and 
                      strategic positioning to pass opponents. Some of the best racing happens in the midfield!
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <span className="mr-2">🌧️</span>
                      Weather Changes
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Rain can completely change a race! Watch for teams switching to wet tires, drivers making bold moves in changing conditions, 
                      and how weather affects strategy. Some drivers excel in wet conditions.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <span className="mr-2">📊</span>
                      Tire Strategy
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Pay attention to tire degradation—when tires wear out, lap times slow down. Teams must balance speed vs. durability. 
                      Watch the on-screen graphics showing tire age and compound choices.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  🎓 Getting Started as a New Fan
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mr-3 mt-1 text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Watch &quot;Drive to Survive&quot;</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Netflix&apos;s documentary series is the perfect introduction! It shows the human drama, team dynamics, and behind-the-scenes 
                        action that makes F1 so compelling. Many fans got hooked after watching this series.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mr-3 mt-1 text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Pick a Driver or Team to Follow</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Having a favorite driver or team makes races more exciting! Follow their journey throughout the season. 
                        You&apos;ll naturally learn about other drivers and teams as you watch.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mr-3 mt-1 text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Watch a Full Race Weekend</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Start with one complete weekend: practice sessions, qualifying, and the race. You&apos;ll understand how everything connects 
                        and see the full story unfold from Friday to Sunday.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mr-3 mt-1 text-sm">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Learn the Terminology</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Don&apos;t worry about understanding everything at first! Terms like DRS, undercut, and tire compounds will become second nature 
                        as you watch. Use this guide as a reference.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mr-3 mt-1 text-sm">
                      5
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Follow F1 Social Media</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Follow official F1 accounts, drivers, and teams on social media. You&apos;ll get race updates, highlights, 
                        and insights that enhance your viewing experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  🏆 Iconic Races to Watch (Classics)
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  If you&apos;re looking for legendary races to watch, these are considered some of the greatest in F1 history:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">2011 Canadian Grand Prix</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">The longest race in F1 history (4+ hours due to rain delays)</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Jenson Button won after starting last, making 6 pit stops, and having 5 collisions. An incredible comeback story!
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">2008 Brazilian Grand Prix</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Championship decided on the final corner of the final race</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Lewis Hamilton won his first championship by passing Timo Glock on the last corner of the last lap in changing conditions.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">2021 Abu Dhabi Grand Prix</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">One of the most controversial and dramatic season finales</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Max Verstappen and Lewis Hamilton entered tied on points. The race and championship were decided on the final lap.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">1993 European Grand Prix</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Ayrton Senna&apos;s masterclass in wet conditions</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Senna won by over a minute in torrential rain, demonstrating why he&apos;s considered one of the greatest wet-weather drivers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  💡 Pro Tips for Enjoying F1
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">During the Race</h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li>• Watch the timing screen—it shows gaps, tire compounds, and pit stop strategies</li>
                      <li>• Listen to team radio—hear real-time strategy discussions and driver communications</li>
                      <li>• Follow multiple battles—the midfield often has the best racing action</li>
                      <li>• Pay attention to tire graphics—shows which compound each driver is using</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Between Races</h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li>• Watch qualifying highlights—see who starts where and why it matters</li>
                      <li>• Read post-race analysis—understand the strategy decisions made</li>
                      <li>• Follow driver social media—get insights into their personalities and preparation</li>
                      <li>• Join F1 communities—discuss races with other fans online</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Predict Race Results?
            </h2>
            <p className="text-red-100 mb-6 text-lg">
              Use our AI-powered predictor to see who might win the next race!
            </p>
            <Link
              href="/"
              className="inline-block bg-white text-red-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Try the Predictor →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

