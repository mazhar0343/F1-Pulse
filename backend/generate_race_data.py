"""
Script to generate race data from FastF1 for the backend
This creates the necessary CSV files for races and circuits
"""

import sys
from pathlib import Path

try:
    import fastf1
    import pandas as pd
except ImportError:
    print("Error: fastf1 and pandas are required")
    print("Install with: pip install fastf1 pandas")
    sys.exit(1)

ROOT = Path(__file__).parent
DATA_DIR = ROOT / "data"
DATA_DIR.mkdir(exist_ok=True)

def generate_race_data(year=2025):
    """Generate races.csv and circuits.csv from FastF1"""
    print(f"Fetching {year} F1 schedule from FastF1...")
    
    try:
        # Get schedule
        schedule = fastf1.get_event_schedule(year)
        races = schedule[schedule['EventFormat'] != 'testing'].copy()
        
        if races.empty:
            print(f"No races found for year {year}")
            return False
        
        print(f"Found {len(races)} races")
        
        # Prepare races data
        races_data = []
        circuits_data = []
        circuit_ids_seen = set()
        
        for idx, race in races.iterrows():
            round_num = int(race.get('RoundNumber', 0))
            event_name = race.get('EventName', 'Unknown')
            event_date = race.get('EventDate', '')
            location = race.get('Location', 'Unknown')
            country = race.get('Country', 'Unknown')
            
            # Generate raceId (using round number as ID)
            race_id = round_num
            
            # Get circuit info
            try:
                # Try to get circuit details from the session
                session = fastf1.get_session(year, round_num, 'R')
                circuit_name = session.event.get('Location', location)
                circuit_id = round_num  # Use round as circuit ID for simplicity
            except:
                circuit_name = location
                circuit_id = round_num
            
            # Add race data
            races_data.append({
                'raceId': race_id,
                'year': year,
                'round': round_num,
                'circuitId': circuit_id,
                'name': event_name,
                'date': pd.Timestamp(event_date).strftime('%Y-%m-%d') if pd.notna(event_date) else ''
            })
            
            # Add circuit data (avoid duplicates)
            if circuit_id not in circuit_ids_seen:
                circuits_data.append({
                    'circuitId': circuit_id,
                    'name': circuit_name,
                    'location': location,
                    'country': country
                })
                circuit_ids_seen.add(circuit_id)
        
        # Create DataFrames
        races_df = pd.DataFrame(races_data)
        circuits_df = pd.DataFrame(circuits_data)
        
        # Save to CSV
        races_file = DATA_DIR / "races.csv"
        circuits_file = DATA_DIR / "circuits.csv"
        
        races_df.to_csv(races_file, index=False)
        circuits_df.to_csv(circuits_file, index=False)
        
        print(f"\n✓ Generated {len(races_df)} races")
        print(f"✓ Generated {len(circuits_df)} circuits")
        print(f"✓ Saved to {races_file}")
        print(f"✓ Saved to {circuits_file}")
        
        return True
        
    except Exception as e:
        print(f"Error generating race data: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Generate race data from FastF1")
    parser.add_argument(
        "--year",
        type=int,
        default=2025,
        help="Year to generate data for (default: 2025)"
    )
    
    args = parser.parse_args()
    
    success = generate_race_data(args.year)
    sys.exit(0 if success else 1)

