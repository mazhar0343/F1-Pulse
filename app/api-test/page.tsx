'use client';

import { useState } from 'react';

export default function APITestPage() {
  const [status, setStatus] = useState<string>('Not tested');
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setStatus('Testing...');
    setError(null);
    setDetails(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    try {
      // Test 1: Health endpoint
      const healthResponse = await fetch(`${apiUrl}/health`);
      const healthData = await healthResponse.json();
      
      // Test 2: Races endpoint
      const racesResponse = await fetch(`${apiUrl}/races?year=2025`);
      const racesData = await racesResponse.ok ? await racesResponse.json() : null;
      
      // Test 3: Model status
      const modelResponse = await fetch(`${apiUrl}/model/status`);
      const modelData = await modelResponse.ok ? await modelResponse.json() : null;

      setDetails({
        apiUrl,
        health: {
          status: healthResponse.status,
          data: healthData,
        },
        races: {
          status: racesResponse.status,
          data: racesData,
        },
        model: {
          status: modelResponse.status,
          data: modelData,
        },
      });

      if (healthResponse.ok) {
        setStatus('✅ Connected!');
      } else {
        setStatus('❌ Backend responded with error');
      }
    } catch (err) {
      setStatus('❌ Connection Failed');
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Connection test error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          API Connection Test
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              API URL: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
              </code>
            </p>
          </div>

          <button
            onClick={testConnection}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Test Connection
          </button>

          <div className="mt-6">
            <p className="text-lg font-semibold mb-2">Status: {status}</p>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <p className="text-red-800 dark:text-red-200">Error: {error}</p>
              </div>
            )}
          </div>
        </div>

        {details && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Test Results
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Health Endpoint
                </h3>
                <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(details.health, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Races Endpoint
                </h3>
                <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(details.races, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Model Status
                </h3>
                <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(details.model, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Troubleshooting Steps:
          </h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-300 text-sm">
            <li>Make sure backend is running: <code>cd backend && python main.py</code></li>
            <li>Check backend is on port 8000: <code>curl http://localhost:8000/health</code></li>
            <li>Check browser console for CORS errors</li>
            <li>Verify no firewall is blocking localhost:8000</li>
            <li>Try accessing API directly: <a href="http://localhost:8000/docs" target="_blank" className="underline">http://localhost:8000/docs</a></li>
          </ol>
        </div>
      </div>
    </div>
  );
}

