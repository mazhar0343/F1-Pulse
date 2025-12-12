"""
Generate predictions for all 2025 races using the ML model
This creates predictions_2025_flat.csv that other endpoints need
"""
import sys
from pathlib import Path
import pandas as pd

ROOT = Path(__file__).parent
DATA_DIR = ROOT / "data"
DATA_DIR.mkdir(exist_ok=True)

try:
    from F1_predict_md import F1Predictor
    import fastf1
except ImportError as e:
    print(f"Error: {e}")
    print("Please install: pip install fastf1")
    sys.exit(1)

def generate_all_predictions(year=2025):
    """Generate predictions for all races in a year"""
    print(f"\n{'='*60}")
    print(f"Generating Predictions for {year} Season")
    print(f"{'='*60}\n")
    
    # Initialize predictor
    print("Initializing ML model...")
    predictor = F1Predictor()
    
    # Train the model (if not already trained)
    print(f"Training model on {year} data...")
    try:
        predictor.train(year)
        print("✓ Model trained\n")
    except Exception as e:
        print(f"⚠️  Training error (may already be trained): {e}\n")
    
    # Get race schedule
    print("Fetching race schedule...")
    try:
        schedule = fastf1.get_event_schedule(year)
        races = schedule[schedule['EventFormat'] != 'testing'].copy()
        print(f"✓ Found {len(races)} races\n")
    except Exception as e:
        print(f"❌ Error fetching schedule: {e}")
        return False
    
    # Load races.csv to get raceIds
    races_file = DATA_DIR / "races.csv"
    if not races_file.exists():
        print(f"❌ races.csv not found. Run generate_race_data.py first!")
        return False
    
    races_df = pd.read_csv(races_file)
    all_predictions = []
    
    print("Generating predictions for each race...")
    print("(This may take a while - fetching FastF1 data for each race)\n")
    
    for idx, race_row in races_df.iterrows():
        round_num = int(race_row['round'])
        race_id = int(race_row['raceId'])
        race_name = race_row['name']
        
        print(f"  [{idx+1}/{len(races_df)}] Round {round_num}: {race_name}...", end=" ", flush=True)
        
        try:
            # Get predictions for this race
            results = predictor.predict_race(year, round_num)
            
            if results:
                # Convert to flat format
                for res in results:
                    all_predictions.append({
                        'raceId': race_id,
                        'driverRef': res['Driver'].lower().replace(' ', '_'),
                        'team': res['Team'],
                        'grid': int(res['Start']) if res.get('Start') else None,
                        'pred_pos': res['Pred_Pos']
                    })
                print(f"✓ ({len(results)} drivers)")
            else:
                print("⚠️  No predictions (qualifying data may not be available)")
                
        except Exception as e:
            print(f"❌ Error: {str(e)[:50]}")
            # For future races, create placeholder predictions
            # You can fill these in later or skip them
            continue
    
    if not all_predictions:
        print("\n❌ No predictions generated!")
        print("This might be because:")
        print("  - Races haven't happened yet (no qualifying data)")
        print("  - FastF1 data not available")
        print("  - Network issues")
        return False
    
    # Create DataFrame
    predictions_df = pd.DataFrame(all_predictions)
    
    # Save to CSV
    output_file = DATA_DIR / "predictions_2025_flat.csv"
    predictions_df.to_csv(output_file, index=False)
    
    print(f"\n{'='*60}")
    print(f"✓ Generated {len(predictions_df)} predictions")
    print(f"✓ Saved to {output_file}")
    print(f"✓ Covers {predictions_df['raceId'].nunique()} races")
    print(f"{'='*60}\n")
    
    return True

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Generate predictions for all races")
    parser.add_argument(
        "--year",
        type=int,
        default=2025,
        help="Year to generate predictions for (default: 2025)"
    )
    
    args = parser.parse_args()
    
    success = generate_all_predictions(args.year)
    sys.exit(0 if success else 1)

