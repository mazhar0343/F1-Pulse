"""
Test all backend endpoints that the frontend uses
"""
import sys
from pathlib import Path
import requests
import json

BASE_URL = "http://localhost:8000"

def test_endpoint(name, method, url, data=None):
    """Test a single endpoint"""
    print(f"\n{'='*60}")
    print(f"Testing: {name}")
    print(f"URL: {method} {url}")
    print(f"{'='*60}")
    
    try:
        if method == "GET":
            response = requests.get(url, timeout=5)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=5)
        else:
            print(f"❌ Unknown method: {method}")
            return False
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Success!")
            
            # Pretty print result (truncated)
            result_str = json.dumps(result, indent=2)
            if len(result_str) > 500:
                print(result_str[:500] + "...\n(truncated)")
            else:
                print(result_str)
            
            return True
        else:
            print(f"❌ Failed with status {response.status_code}")
            try:
                error = response.json()
                print(f"Error: {error}")
            except:
                print(f"Error: {response.text[:200]}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Connection failed - is backend running on {BASE_URL}?")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("="*60)
    print("FRONTEND ENDPOINTS TEST")
    print("="*60)
    print(f"\nTesting endpoints against: {BASE_URL}")
    print("Make sure backend is running!\n")
    
    results = {}
    
    # Test all endpoints the frontend uses
    endpoints = [
        ("Health Check", "GET", f"{BASE_URL}/health"),
        ("Races List", "GET", f"{BASE_URL}/races?year=2025"),
        ("Drivers List", "GET", f"{BASE_URL}/drivers"),
        ("Statistics", "GET", f"{BASE_URL}/statistics"),
        ("Standings 2025", "GET", f"{BASE_URL}/standings/2025"),
        ("Model Status", "GET", f"{BASE_URL}/model/status"),
    ]
    
    for name, method, url in endpoints:
        results[name] = test_endpoint(name, method, url)
    
    # Test driver profile (need to get a driverRef first)
    print(f"\n{'='*60}")
    print("Testing Driver Profile (need valid driverRef)")
    print(f"{'='*60}")
    try:
        drivers_resp = requests.get(f"{BASE_URL}/drivers", timeout=5)
        if drivers_resp.status_code == 200:
            drivers_data = drivers_resp.json()
            if drivers_data.get("drivers") and len(drivers_data["drivers"]) > 0:
                driver_ref = drivers_data["drivers"][0]["driverRef"]
                results["Driver Profile"] = test_endpoint(
                    f"Driver Profile ({driver_ref})",
                    "GET",
                    f"{BASE_URL}/drivers/{driver_ref}"
                )
            else:
                print("⚠️  No drivers found to test profile")
                results["Driver Profile"] = None
        else:
            print("⚠️  Could not get drivers list")
            results["Driver Profile"] = None
    except Exception as e:
        print(f"⚠️  Error getting drivers: {e}")
        results["Driver Profile"] = None
    
    # Test prediction (need a raceId)
    print(f"\n{'='*60}")
    print("Testing Prediction (need valid raceId)")
    print(f"{'='*60}")
    try:
        races_resp = requests.get(f"{BASE_URL}/races?year=2025", timeout=5)
        if races_resp.status_code == 200:
            races_data = races_resp.json()
            if races_data.get("races") and len(races_data["races"]) > 0:
                race_id = races_data["races"][0]["raceId"]
                results["Prediction"] = test_endpoint(
                    f"Prediction (raceId={race_id})",
                    "GET",
                    f"{BASE_URL}/predict/{race_id}"
                )
            else:
                print("⚠️  No races found to test prediction")
                results["Prediction"] = None
        else:
            print("⚠️  Could not get races list")
            results["Prediction"] = None
    except Exception as e:
        print(f"⚠️  Error getting races: {e}")
        results["Prediction"] = None
    
    # Summary
    print(f"\n{'='*60}")
    print("TEST SUMMARY")
    print(f"{'='*60}")
    
    passed = sum(1 for v in results.values() if v is True)
    failed = sum(1 for v in results.values() if v is False)
    skipped = sum(1 for v in results.values() if v is None)
    
    for name, result in results.items():
        if result is True:
            print(f"✅ {name}")
        elif result is False:
            print(f"❌ {name}")
        else:
            print(f"⚠️  {name} (skipped)")
    
    print(f"\nTotal: {passed} passed, {failed} failed, {skipped} skipped")
    
    if failed > 0:
        print("\n⚠️  Some endpoints failed. Check backend logs and data files.")
    else:
        print("\n✅ All testable endpoints passed!")

if __name__ == "__main__":
    try:
        import requests
    except ImportError:
        print("Error: requests library not installed")
        print("Install with: pip install requests")
        sys.exit(1)
    
    main()

