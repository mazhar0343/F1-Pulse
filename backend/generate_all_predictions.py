"""
Generate predictions for all races and save to CSV
This populates the dashboard with prediction data
"""
import sys
from pathlib import Path
import pandas as pd

ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT))

from main import predictor

def generate_all_predictions():
    """Generate predictions for all available races"""
    print("\n" + "="*60)
    print("Generating Predictions for All Races")
    print("="*60 + "\n")
    
    if predictor.meta.empty:
        print("❌ No races available in metadata")
        return False
    
    all_predictions = []
    total_races = len(predictor.meta)
    
    print(f"Found {total_races} races to process\n")
    
    for idx, race_row in predictor.meta.iterrows():
        race_id = int(race_row.get("raceId", 0))
        race_name = race_row.get("name_race", "Unknown")
        round_num = int(race_row.get("round", 0))
        
        if race_id == 0:
            continue
        
        print(f"[{idx+1}/{total_races}] Processing: {race_name} (Round {round_num})...", end=" ", flush=True)
        
        try:
            # Get predictions for this race
            pred_result = predictor.predict(race_id=race_id)
            
            if pred_result and "full_predictions" in pred_result:
                predictions = pred_result["full_predictions"]
                
                # Add to list
                for pred in predictions:
                    all_predictions.append({
                        'raceId': race_id,
                        'driverRef': pred.driverRef,
                        'team': pred.team,
                        'pred_pos': pred.predicted_position,
                        'grid': pred.grid_position if pred.grid_position is not None else None
                    })
                
                print(f"✓ ({len(predictions)} drivers)")
            else:
                print("⚠️  No predictions")
                
        except Exception as e:
            print(f"❌ Error: {str(e)[:50]}")
            continue
    
    if not all_predictions:
        print("\n❌ No predictions generated!")
        return False
    
    # Create DataFrame
    predictions_df = pd.DataFrame(all_predictions)
    
    # Save to CSV
    output_file = ROOT / "data" / "predictions_2025_flat.csv"
    output_file.parent.mkdir(exist_ok=True)
    predictions_df.to_csv(output_file, index=False)
    
    print(f"\n{'='*60}")
    print(f"✓ Generated {len(predictions_df)} predictions")
    print(f"✓ Covers {predictions_df['raceId'].nunique()} races")
    print(f"✓ Saved to {output_file}")
    print(f"{'='*60}\n")
    
    # Reload the predictor to pick up new data
    predictor._load_data()
    
    print("✓ Predictions loaded into predictor")
    print("\n💡 Restart your backend to see updated statistics!\n")
    
    return True

if __name__ == "__main__":
    success = generate_all_predictions()
    sys.exit(0 if success else 1)

