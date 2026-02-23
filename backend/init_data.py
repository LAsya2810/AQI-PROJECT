"""
Data Initialization Script
Run this script to populate the database with sample AQI data for all cities
"""

import requests
import json
from datetime import datetime, timedelta
import random

BASE_URL = 'http://localhost:5000/api'

def init_cities():
    """Initialize city profiles"""
    print("Initializing cities...")
    response = requests.post(f'{BASE_URL}/admin/init-cities')
    if response.status_code == 201:
        print("✅ Cities initialized successfully")
        return True
    else:
        print(f"❌ Failed to initialize cities: {response.text}")
        return False

def add_sample_data():
    """Add sample AQI data for the past 7 days"""
    print("\nAdding sample AQI data...")
    
    cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad']
    base_aqi = {
        'Delhi': 187,
        'Mumbai': 112,
        'Bangalore': 78,
        'Chennai': 95,
        'Kolkata': 145,
        'Hyderabad': 102
    }
    
    count = 0
    for city in cities:
        # Add readings for past 7 days (4 readings per day)
        for day in range(7):
            for hour in [0, 6, 12, 18]:  # 6-hour intervals
                # Generate realistic variation
                hour_variation = (
                    100 * (abs(hour - 9) ** -1.5) +  # Morning peak
                    100 * (abs(hour - 18) ** -1.5) -  # Evening peak
                    30 if (hour >= 1 and hour <= 5) else 0  # Night dip
                )
                aqi_value = max(20, int(base_aqi[city] + hour_variation + random.randint(-20, 20)))
                
                # Create reading with pollutant breakdown
                reading = {
                    'city': city,
                    'aqi': aqi_value,
                    'pm25': aqi_value * 0.35 + random.uniform(0, 10),
                    'pm10': aqi_value * 0.65 + random.uniform(0, 15),
                    'no2': min(150, aqi_value * 0.2 + random.uniform(0, 5)),
                    'o3': min(100, aqi_value * 0.15 + random.uniform(0, 3)),
                    'co': round(aqi_value * 0.008 + random.uniform(0, 0.5), 2),
                    'so2': min(100, aqi_value * 0.1 + random.uniform(0, 3))
                }
                
                response = requests.post(f'{BASE_URL}/admin/add-reading', json=reading)
                if response.status_code == 201:
                    count += 1
                else:
                    print(f"❌ Failed to add reading for {city}: {response.text}")
    
    print(f"✅ Added {count} sample readings")
    return count > 0

def test_endpoints():
    """Test all major endpoints"""
    print("\nTesting endpoints...")
    
    # Test health check
    try:
        response = requests.get(f'{BASE_URL}/health')
        if response.status_code == 200:
            print("✅ Health check: OK")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")
    
    # Test cities
    try:
        response = requests.get(f'{BASE_URL}/cities')
        cities = response.json()
        if len(cities) > 0:
            print(f"✅ Cities endpoint: {len(cities)} cities found")
            for city in cities:
                print(f"   - {city['name']}: AQI {city['aqi']} ({city['category']})")
        else:
            print("❌ No cities found")
    except Exception as e:
        print(f"❌ Cities endpoint error: {e}")
    
    # Test current AQI
    try:
        response = requests.get(f'{BASE_URL}/current/Delhi')
        data = response.json()
        if 'aqi' in data:
            print(f"✅ Current AQI (Delhi): {data['aqi']} ({data['category']})")
        else:
            print(f"❌ Failed to get current AQI: {data}")
    except Exception as e:
        print(f"❌ Current AQI error: {e}")
    
    # Test forecast
    try:
        response = requests.get(f'{BASE_URL}/forecast/Delhi')
        data = response.json()
        if 'forecast' in data:
            print(f"✅ Forecast (Delhi): {len(data['forecast'])} hours available")
        else:
            print(f"❌ Failed to get forecast: {data}")
    except Exception as e:
        print(f"❌ Forecast error: {e}")
    
    # Test 7-day trend
    try:
        response = requests.get(f'{BASE_URL}/trend/Delhi')
        data = response.json()
        if 'trend' in data:
            print(f"✅ Trend (Delhi): {len(data['trend'])} days available")
        else:
            print(f"❌ Failed to get trend: {data}")
    except Exception as e:
        print(f"❌ Trend error: {e}")
    
    # Test exposure calculation
    try:
        exposure_data = {
            'aqi': 200,
            'user_type': 'Child',
            'activity': 'Running',
            'duration': 2
        }
        response = requests.post(f'{BASE_URL}/exposure', json=exposure_data)
        data = response.json()
        if 'exposure_score' in data:
            print(f"✅ Exposure Calculator: Score {data['exposure_score']}")
            print(f"   Max safe time: {data['max_safe_time']} hours")
            print(f"   N95 mask needed: {data['n95_needed']}")
        else:
            print(f"❌ Failed to calculate exposure: {data}")
    except Exception as e:
        print(f"❌ Exposure calculator error: {e}")
    
    # Test factor analysis
    try:
        response = requests.get(f'{BASE_URL}/factor-analysis/Delhi')
        data = response.json()
        if 'factors' in data:
            print(f"✅ Factor Analysis (Delhi): {len(data['factors'])} factors")
            for factor in data['factors']:
                print(f"   - {factor['name']}: {factor['value']}%")
        else:
            print(f"❌ Failed to get factors: {data}")
    except Exception as e:
        print(f"❌ Factor analysis error: {e}")
    
    # Test institution alerts
    try:
        response = requests.get(f'{BASE_URL}/institution-alert/Delhi/School')
        data = response.json()
        if 'threshold' in data:
            status = "ALERT" if data['alert_triggered'] else "OK"
            print(f"✅ Institution Alert (School): {status} (Threshold: {data['threshold']})")
        else:
            print(f"❌ Failed to get institution alert: {data}")
    except Exception as e:
        print(f"❌ Institution alert error: {e}")

def main():
    """Run initialization"""
    print("=" * 60)
    print("AQI BACKEND - DATA INITIALIZATION")
    print("=" * 60)
    
    # Make sure server is running
    try:
        requests.get(f'{BASE_URL}/health', timeout=2)
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: Backend server is not running!")
        print("   Please start the server first: python app.py")
        return
    
    # Initialize data
    if not init_cities():
        print("Failed to initialize cities. Aborting.")
        return
    
    add_sample_data()
    
    # Test all endpoints
    test_endpoints()
    
    print("\n" + "=" * 60)
    print("✅ Initialization complete!")
    print("=" * 60)
    print("\nYour backend is ready to use!")
    print(f"📍 API Base URL: {BASE_URL}")
    print("📖 See README.md for complete API documentation")

if __name__ == '__main__':
    main()
