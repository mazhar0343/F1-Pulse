"""
Script to train the F1 prediction model
Run this script to train and save the model before using it in the API
"""

import sys
import importlib.util
from pathlib import Path

# Add backend directory to path
ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT))

# Try to import the model
module_file = ROOT / "F1_predict_md.py"

if not module_file.exists():
    print(f"Error: F1_predict_md.py not found at {module_file}")
    print(f"Current directory: {ROOT}")
    sys.exit(1)

# Try to import - this will show the actual error if dependencies are missing
try:
    from F1_predict_md import F1Predictor
    print("✓ Successfully imported F1Predictor")
except ImportError as e:
    error_msg = str(e)
    print(f"\n{'='*60}")
    print("Error: Could not import F1Predictor")
    print(f"{'='*60}")
    print(f"\nDetailed error: {error_msg}\n")
    
    # Check for common missing dependencies
    if "fastf1" in error_msg.lower():
        print("Missing dependency: fastf1")
        print("Solution: pip install fastf1")
    elif "catboost" in error_msg.lower():
        print("Missing dependency: catboost")
        print("Solution: pip install catboost")
    elif "sklearn" in error_msg.lower() or "scikit-learn" in error_msg.lower():
        print("Missing dependency: scikit-learn")
        print("Solution: pip install scikit-learn")
    else:
        print("This might be a missing dependency or syntax error in F1_predict_md.py")
    
    print(f"\nPlease install all dependencies:")
    print(f"  pip install -r requirements.txt")
    print(f"\nOr install individually:")
    print(f"  pip install catboost fastf1 scikit-learn")
    print(f"{'='*60}\n")
    sys.exit(1)
except Exception as e:
    print(f"\n{'='*60}")
    print(f"Unexpected error importing F1_predict_md: {e}")
    print(f"{'='*60}\n")
    import traceback
    traceback.print_exc()
    sys.exit(1)

from catboost import CatBoostRegressor

MODEL_DIR = ROOT / "models"
MODEL_DIR.mkdir(exist_ok=True)
MODEL_FILE = MODEL_DIR / "f1_model.cbm"


def train_model(year: int = 2025):
    """
    Train the F1 prediction model
    
    Args:
        year: Year to train the model on (uses previous year + current year data)
    """
    print(f"\n{'='*60}")
    print(f"Training F1 Prediction Model for Year {year}")
    print(f"{'='*60}\n")
    
    # Initialize predictor
    predictor = F1Predictor()
    
    # Train the model
    try:
        predictor.train(year)
        
        # Save the model
        predictor.model.save_model(str(MODEL_FILE))
        print(f"\n{'='*60}")
        print(f"✓ Model trained successfully!")
        print(f"✓ Model saved to: {MODEL_FILE}")
        print(f"{'='*60}\n")
        
        return True
    except Exception as e:
        print(f"\n{'='*60}")
        print(f"✗ Training failed: {e}")
        print(f"{'='*60}\n")
        return False


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Train F1 prediction model")
    parser.add_argument(
        "--year",
        type=int,
        default=2025,
        help="Year to train the model on (default: 2025)"
    )
    
    args = parser.parse_args()
    
    if not (2023 <= args.year <= 2025):
        print("Error: Year must be between 2023 and 2025")
        sys.exit(1)
    
    success = train_model(args.year)
    sys.exit(0 if success else 1)

