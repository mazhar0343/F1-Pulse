"""
Quick test to verify race data is loaded correctly
"""
import sys
from pathlib import Path

# Add backend to path
ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT))

from main import predictor

print("Testing race data loading...")
print(f"Races loaded: {not predictor.races.empty}")
print(f"Circuits loaded: {not predictor.circuits.empty}")
print(f"Metadata built: {not predictor.meta.empty}")

if not predictor.meta.empty:
    print(f"\n✓ Found {len(predictor.meta)} races in metadata")
    print("\nFirst 5 races:")
    for idx, race in predictor.meta.head().iterrows():
        print(f"  - {race.get('label', 'Unknown')}")
    
    # Test get_available_races
    races = predictor.get_available_races(2025)
    print(f"\n✓ get_available_races(2025) returned {len(races)} races")
    if races:
        print(f"  First race: {races[0].get('label', 'Unknown')}")
else:
    print("\n✗ No races found in metadata")
    print("Check backend logs for errors")

