'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus, CheckCircle, XCircle } from 'lucide-react';

interface DriverPrediction {
  driverRef: string;
  driver_name: string;
  team: string;
  predicted_position: number;
  grid_position?: number;
}

interface ActualResult {
  driverRef: string;
  driver_name: string;
  team: string;
  finish_position: number;
  grid_position?: number;
}

interface ComparisonData {
  race_id: number;
  race_name: string;
  predictions: DriverPrediction[];
  actual_results: ActualResult[] | null;
  accuracy: {
    mae: number;
    rmse: number;
    exact_matches: number;
    exact_match_rate: number;
    within_one: number;
    within_one_rate: number;
    within_three: number;
    within_three_rate: number;
    total_drivers: number;
  } | null;
}

export default function ComparePage() {
  const params = useParams();
  const raceId = params?.raceId ? parseInt(params.raceId as string) : null;
  const [data, setData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (raceId) {
      loadComparison(raceId);
    }
  }, [raceId]);

  const loadComparison = async (id: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/compare/${id}`);
      if (response.ok) {
        const result = await response.json();
        // Validate and set data
        if (result && result.predictions) {
        setData(result);
        } else {
          setError('Invalid comparison data received');
        }
      } else {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to load comparison data' }));
        setError(errorData.detail || `Error: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Comparison load error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load comparison. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <p className="text-red-800 dark:text-red-200">{error || 'No comparison data available'}</p>
        </div>
      </div>
    );
  }

  // Prepare scatter plot data
  const scatterData = data.actual_results && data.predictions
    ? data.predictions
        .map((pred) => {
          if (!pred) return null;
          const actual = data.actual_results?.find((a) => a && a.driverRef === pred.driverRef);
        return actual
          ? {
              driver: pred.driverRef,
              predicted: pred.predicted_position,
              actual: actual.finish_position,
              error: Math.abs(pred.predicted_position - actual.finish_position),
            }
          : null;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
    : [];

  // Prepare comparison table data
  const comparisonTable = data.actual_results && data.predictions
    ? data.predictions
        .map((pred) => {
          if (!pred) return null;
          const actual = data.actual_results?.find((a) => a && a.driverRef === pred.driverRef);
        if (!actual) return null;
        const error = pred.predicted_position - actual.finish_position;
        return {
          driver: pred.driverRef,
          team: pred.team,
          predicted: pred.predicted_position,
          actual: actual.finish_position,
          error,
          absError: Math.abs(error),
        };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .sort((a, b) => a.actual - b.actual)
    : [];

  const getErrorColor = (error: number) => {
    if (error === 0) return 'text-green-600 dark:text-green-400';
    if (Math.abs(error) <= 1) return 'text-yellow-600 dark:text-yellow-400';
    if (Math.abs(error) <= 3) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getErrorIcon = (error: number) => {
    if (error === 0) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (error > 0) return <TrendingDown className="w-5 h-5 text-red-600" />;
    return <TrendingUp className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            📊 Prediction vs Actual Results
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">{data.race_name}</p>
          <a
            href="/"
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 underline"
          >
            ← Back to Predictor
          </a>
        </div>

        {/* Accuracy Metrics */}
        {data.accuracy && data.accuracy.total_drivers > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Mean Absolute Error</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {data.accuracy.mae?.toFixed(2) || 'N/A'}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Exact Matches</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {data.accuracy.exact_matches || 0}/{data.accuracy.total_drivers || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {data.accuracy.exact_match_rate ? Math.round(data.accuracy.exact_match_rate * 100) : 0}%
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Within 1 Position</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {data.accuracy.within_one || 0}/{data.accuracy.total_drivers || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {data.accuracy.within_one_rate ? Math.round(data.accuracy.within_one_rate * 100) : 0}%
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Within 3 Positions</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {data.accuracy.within_three || 0}/{data.accuracy.total_drivers || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {data.accuracy.within_three_rate ? Math.round(data.accuracy.within_three_rate * 100) : 0}%
              </p>
            </div>
          </div>
        )}

        {/* Scatter Plot */}
        {scatterData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Predicted vs Actual Positions
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number" 
                  dataKey="predicted" 
                  name="Predicted" 
                  label={{ value: 'Predicted Position', position: 'insideBottom', offset: -5 }}
                  domain={[0, 25]}
                />
                <YAxis 
                  type="number" 
                  dataKey="actual" 
                  name="Actual" 
                  label={{ value: 'Actual Position', angle: -90, position: 'insideLeft' }}
                  domain={[0, 25]}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Scatter name="Drivers" data={scatterData} fill="#DC2626">
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.error === 0 ? '#16A34A' : entry.error <= 1 ? '#F59E0B' : '#DC2626'} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Exact match</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>Within 1 position</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>More than 1 position off</span>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {comparisonTable.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Detailed Driver Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Position</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Driver</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Team</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Predicted</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actual</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, index) => (
                    row && (
                      <tr
                        key={index}
                        className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {row.actual}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          {row.driver.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {row.team}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {row.predicted}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {row.actual}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {getErrorIcon(row.error)}
                            <span className={`font-semibold ${getErrorColor(row.error)}`}>
                              {row.error > 0 ? `+${row.error}` : row.error}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Show predictions even without actual results */}
        {data.predictions && data.predictions.length > 0 && !data.actual_results && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Predictions Only
            </h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
              <p className="text-yellow-800 dark:text-yellow-200">
                ⚠️ Actual results are not yet available for this race. Showing predictions only.
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-2">
                Once the race is completed, you'll be able to compare predictions with actual results.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Position</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Driver</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Team</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Grid</th>
                  </tr>
                </thead>
                <tbody>
                  {data.predictions.map((pred, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {pred.predicted_position}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {pred.driver_name}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {pred.team}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
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

        {!data.predictions || data.predictions.length === 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
            <p className="text-yellow-800 dark:text-yellow-200">
              No prediction data available for this race.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

