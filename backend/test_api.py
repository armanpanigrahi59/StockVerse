#!/usr/bin/env python3
"""
Simple test script to verify the API is working correctly
"""
import requests
import json
import time

def test_api():
    base_url = "http://localhost:8000"
    
    print("Testing API endpoints...")
    
    try:
        # Test current_data endpoint
        print("\n1. Testing /current_data endpoint:")
        response = requests.get(f"{base_url}/current_data")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: {json.dumps(data, indent=2)}")
        else:
            print(f"❌ Error: {response.status_code}")
            
        # Test next_data endpoint multiple times
        print("\n2. Testing /next_data endpoint (5 times):")
        for i in range(5):
            response = requests.get(f"{base_url}/next_data")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Request {i+1}: {json.dumps(data, indent=2)}")
            else:
                print(f"❌ Request {i+1} Error: {response.status_code}")
            time.sleep(1)  # Wait 1 second between requests
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Make sure the server is running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    test_api()
