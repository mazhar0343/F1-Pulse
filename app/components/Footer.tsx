import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🏎️</span>
              <span className="text-xl font-bold text-white">F1 Pulse</span>
            </div>
            <p className="text-sm text-gray-400">
              AI-powered Formula 1 race predictions. Bringing cutting-edge technology to motorsport enthusiasts.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-red-400 transition-colors">
                  Race Predictor
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-red-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/what-is-f1" className="hover:text-red-400 transition-colors">
                  What is F1?
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>AI-Powered Predictions</li>
              <li>Race Comparisons</li>
              <li>Statistics Dashboard</li>
              <li>Performance Analytics</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Technology</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Next.js & React</li>
              <li>FastAPI Backend</li>
              <li>AI/ML Models</li>
              <li>TypeScript</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} F1 Pulse. Built with ❤️ for F1 fans and AI enthusiasts.
          </p>
          <p className="mt-2">
            This is a demonstration project. F1 and Formula 1 are trademarks of Formula One World Championship Limited.
          </p>
        </div>
      </div>
    </footer>
  );
}
