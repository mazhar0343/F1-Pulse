// Utility functions for driver portraits and team logos

// Driver portrait mapping
export function getDriverPortrait(driverRef: string): string | null {
  const portraitMap: Record<string, string> = {
    'max_verstappen': 'MaxVerstappen1.png',
    'lewis_hamilton': 'LewisHamilton44.png',
    'charles_leclerc': 'CharlesLeclerc16.png',
    'carlos_sainz': 'CarlosSainz55.png',
    'lando_norris': 'LandoNorris4.png',
    'george_russell': 'GeorgeRussel63.png',
    'george_russel': 'GeorgeRussel63.png', // Handle typo variant
    'alexander_albon': 'AlexanderAlbon23.png',
    'esteban_ocon': 'EstebanOcon31.png',
    'fernando_alonso': 'FernandoAlonso14.png',
    'franco_colapinto': 'FrancoColapinto43.png',
    'gabriel_bortoleto': 'GabrielBortoleto5.png',
    'isack_hadjar': 'IsackHadjar6.png',
    'jack_doohan': 'JackDoohan7.png',
    'kimi_antonelli': 'KimiAntonelli12.png',
    'lance_stroll': 'LanceStroll18.png',
    'liam_lawson': 'LiamLawson30.png',
    'nico_hulkenberg': 'NicoHulkenberg27.png',
    'oliver_bearman': 'OliverBearman87.png',
    'oscar_piastri': 'OscarPiastri81.png',
    'pierre_gasly': 'PierreGasly10.png',
    'yuki_tsunoda': 'YukiTsunoda22.png',
  };

  const normalizedRef = driverRef.toLowerCase();
  return portraitMap[normalizedRef] || null;
}

// Team logo mapping
export function getTeamLogo(teamName: string): string | null {
  // Normalize team name and map to logo filename
  const teamMap: Record<string, string> = {
    'red bull racing': '2025redbullracinglogowhite.webp.avif',
    'red bull': '2025redbullracinglogowhite.webp.avif',
    'redbull': '2025redbullracinglogowhite.webp.avif',
    'racing bulls': '2025racingbullslogowhite.webp.avif',
    'rb': '2025racingbullslogowhite.webp.avif',
    'alphatauri': '2025racingbullslogowhite.webp.avif',
    'vcarb': '2025racingbullslogowhite.webp.avif',
    'ferrari': '2025ferrarilogowhite.webp.avif',
    'mercedes': '2025mercedeslogowhite.webp.avif',
    'mclaren': '2025mclarenlogowhite.webp.avif',
    'aston martin': '2025astonmartinlogowhite.webp.avif',
    'aston martin f1': '2025astonmartinlogowhite.webp.avif',
    'alpine': '2025alpinelogowhite.webp.avif',
    'williams': '2025williamslogowhite.webp.avif',
    'haas': '2025haasf1teamlogowhite.webp.avif',
    'haas f1 team': '2025haasf1teamlogowhite.webp.avif',
    'sauber': '2025kicksauberlogowhite.webp.avif',
    'kick sauber': '2025kicksauberlogowhite.webp.avif',
    'stake f1 team': '2025kicksauberlogowhite.webp.avif',
  };

  const normalizedName = teamName.toLowerCase().trim();
  return teamMap[normalizedName] || null;
}

// Format driver name for display
export function formatDriverName(name: string): string {
  return name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

