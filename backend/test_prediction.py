"""
Quick test to verify prediction endpoint works
"""
import sys
from pathlib import Path

ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT))

from main import predictor

print("="*60)
print("PREDICTION SYSTEM TEST")
print("="*60)

print(f"\nModel Status:")
print(f"  ML Model Available: {predictor.use_ml_model}")
print(f"  Model Loaded: {predictor.model_loaded}")
print(f"  Model File Exists: {ROOT / 'models' / 'f1_model.cbm'}")
print(f"  ML Predictor Object: {predictor.ml_predictor is not None}")

print(f"\nData Status:")
print(f"  Races Loaded: {not predictor.races.empty}")
print(f"  Circuits Loaded: {not predictor.circuits.empty}")
print(f"  Metadata Built: {not predictor.meta.empty}")
print(f"  CSV Predictions: {not predictor.flat.empty}")

if not predictor.meta.empty:
    print(f"\nAvailable Races: {len(predictor.meta)}")
    test_race = predictor.meta.iloc[0]
    print(f"\nTesting with race: {test_race.get('name_race', 'Unknown')} (Round {test_race.get('round', '?')})")
    
    try:
        result = predictor.predict(race_id=int(test_race['raceId']))
        print(f"\n✅ Prediction successful!")
        print(f"  Race: {result['race_name']}")
        print(f"  Winner: {result['predicted_winner']}")
        print(f"  Total predictions: {len(result['full_predictions'])}")
    except Exception as e:
        print(f"\n❌ Prediction failed: {e}")
        import traceback
        traceback.print_exc()
else:
    print("\n❌ No races available to test")

print("\n" + "="*60)

