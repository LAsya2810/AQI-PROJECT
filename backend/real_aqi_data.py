"""
Real AQI Data Integration
Fetches real-time AQI data from WAQI (World Air Quality Index) API
Get free API key from: https://aqicn.org/data-platform/
"""

import requests
from datetime import datetime
import os

# Get your free API key from: https://aqicn.org/data-platform/token/
WAQI_API_KEY = os.environ.get('WAQI_API_KEY', '2736a0915c184cfd192db49bf0d3b2c69991009b')  # Real API key

# All 36 Indian Union Territories (28 States + 8 UTs)
INDIA_CITIES = {
    # States
    "Andhra Pradesh": "Visakhapatnam",
    "Arunachal Pradesh": "Itanagar",
    "Assam": "Guwahati",
    "Bihar": "Patna",
    "Chhattisgarh": "Raipur",
    "Goa": "Panaji",
    "Gujarat": "Ahmedabad",
    "Haryana": "Faridabad",
    "Himachal Pradesh": "Shimla",
    "Jharkhand": "Ranchi",
    "Karnataka": "Bangalore",
    "Kerala": "Kochi",
    "Madhya Pradesh": "Indore",
    "Maharashtra": "Mumbai",
    "Manipur": "Imphal",
    "Meghalaya": "Shillong",
    "Mizoram": "Aizawl",
    "Nagaland": "Kohima",
    "Odisha": "Bhubaneswar",
    "Punjab": "Ludhiana",
    "Rajasthan": "Jaipur",
    "Sikkim": "Gangtok",
    "Tamil Nadu": "Chennai",
    "Telangana": "Hyderabad",
    "Tripura": "Agartala",
    "Uttar Pradesh": "Lucknow",
    "Uttarakhand": "Dehradun",
    "West Bengal": "Kolkata",
    # Union Territories
    "Andaman and Nicobar Islands": "Port Blair",
    "Chandigarh": "Chandigarh",
    "Dadra and Nagar Haveli": "Silvassa",
    "Daman and Diu": "Daman",
    "Delhi": "Delhi",
    "Lakshadweep": "Kavaratti",
    "Puducherry": "Puducherry",
    "Ladakh": "Leh"
}

def fetch_real_aqi_data(city, state):
    """
    Fetch real AQI data from WAQI API
    
    Args:
        city: City name
        state: State name
    
    Returns:
        dict with AQI data or None if API fails
    """
    try:
        # WAQI API endpoint
        url = f'https://api.waqi.info/feed/{city}/?token={WAQI_API_KEY}'
        
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('status') == 'ok':
                aqi_data = data.get('data', {})
                
                return {
                    'aqi': aqi_data.get('aqi', 0),
                    'pm25': aqi_data.get('iaqi', {}).get('pm25', {}).get('v', 0),
                    'pm10': aqi_data.get('iaqi', {}).get('pm10', {}).get('v', 0),
                    'no2': aqi_data.get('iaqi', {}).get('no2', {}).get('v', 0),
                    'o3': aqi_data.get('iaqi', {}).get('o3', {}).get('v', 0),
                    'co': aqi_data.get('iaqi', {}).get('co', {}).get('v', 0),
                    'so2': aqi_data.get('iaqi', {}).get('so2', {}).get('v', 0),
                    'source': aqi_data.get('attribution', [{}])[0].get('name', 'WAQI'),
                    'timestamp': datetime.utcnow().isoformat(),
                    'is_real': True
                }
        
        return None
        
    except Exception as e:
        print(f"Error fetching real AQI data for {city}: {e}")
        return None

def get_aqi_with_fallback(city, state, fallback_aqi=100):
    """
    Get AQI data with fallback to mock data if API fails
    
    Args:
        city: City name
        state: State name
        fallback_aqi: Fallback AQI value if API is unavailable
    
    Returns:
        dict with AQI data (real or mock)
    """
    # Try to fetch real data
    real_data = fetch_real_aqi_data(city, state)
    
    if real_data:
        return real_data
    
    # Fallback to mock data
    return get_mock_aqi_data(city, fallback_aqi)

def get_mock_aqi_data(city, base_aqi=100):
    """
    Generate mock AQI data for development/testing
    """
    from datetime import datetime
    import math
    
    now = datetime.utcnow()
    hour = now.hour
    
    # Add realistic variation based on time of day
    morning_peak = math.exp(-math.pow(hour - 9, 2) / 8) * 50
    evening_peak = math.exp(-math.pow(hour - 18, 2) / 6) * 65
    
    aqi = max(25, int(base_aqi + morning_peak + evening_peak))
    
    return {
        'aqi': aqi,
        'pm25': aqi * 0.35,
        'pm10': aqi * 0.65,
        'no2': aqi * 0.2,
        'o3': aqi * 0.15,
        'co': aqi * 0.008,
        'so2': aqi * 0.1,
        'source': 'Mock Data',
        'timestamp': now.isoformat(),
        'is_real': False
    }

def create_city_profile_data():
    """
    Generate city profile data for all Indian states
    
    Returns:
        list of dicts with city information
    """
    CITY_COORDINATES = {
        'Andaman and Nicobar Islands': {'lat': 11.7401, 'lng': 92.6586, 'base_aqi': 65},
        'Andhra Pradesh': {'lat': 17.3850, 'lng': 78.4867, 'base_aqi': 102},
        'Arunachal Pradesh': {'lat': 28.2180, 'lng': 94.7278, 'base_aqi': 55},
        'Assam': {'lat': 26.1445, 'lng': 91.7362, 'base_aqi': 85},
        'Bihar': {'lat': 25.5941, 'lng': 85.1376, 'base_aqi': 150},
        'Chhattisgarh': {'lat': 21.2787, 'lng': 81.8661, 'base_aqi': 95},
        'Goa': {'lat': 15.2993, 'lng': 73.8243, 'base_aqi': 70},
        'Gujarat': {'lat': 23.0225, 'lng': 72.5714, 'base_aqi': 110},
        'Haryana': {'lat': 27.7575, 'lng': 77.7597, 'base_aqi': 175},
        'Himachal Pradesh': {'lat': 31.1048, 'lng': 77.1734, 'base_aqi': 60},
        'Jharkhand': {'lat': 23.3441, 'lng': 85.3096, 'base_aqi': 120},
        'Karnataka': {'lat': 12.9716, 'lng': 77.5946, 'base_aqi': 78},
        'Kerala': {'lat': 9.9312, 'lng': 76.2673, 'base_aqi': 50},
        'Madhya Pradesh': {'lat': 22.7196, 'lng': 75.8577, 'base_aqi': 105},
        'Maharashtra': {'lat': 19.0760, 'lng': 72.8777, 'base_aqi': 112},
        'Manipur': {'lat': 24.6637, 'lng': 93.9063, 'base_aqi': 65},
        'Meghalaya': {'lat': 25.5788, 'lng': 91.8933, 'base_aqi': 75},
        'Mizoram': {'lat': 23.8103, 'lng': 93.0188, 'base_aqi': 60},
        'Nagaland': {'lat': 25.6751, 'lng': 94.0824, 'base_aqi': 70},
        'Odisha': {'lat': 20.2961, 'lng': 85.8245, 'base_aqi': 100},
        'Punjab': {'lat': 31.5497, 'lng': 74.3436, 'base_aqi': 145},
        'Rajasthan': {'lat': 26.9124, 'lng': 75.7873, 'base_aqi': 130},
        'Sikkim': {'lat': 27.5330, 'lng': 88.5122, 'base_aqi': 55},
        'Tamil Nadu': {'lat': 13.0827, 'lng': 80.2707, 'base_aqi': 95},
        'Telangana': {'lat': 17.3850, 'lng': 78.4867, 'base_aqi': 102},
        'Tripura': {'lat': 23.8103, 'lng': 91.2868, 'base_aqi': 80},
        'Uttar Pradesh': {'lat': 27.1767, 'lng': 78.0081, 'base_aqi': 165},
        'Uttarakhand': {'lat': 30.0668, 'lng': 79.0193, 'base_aqi': 75},
        'West Bengal': {'lat': 22.5726, 'lng': 88.3639, 'base_aqi': 145},
        'Chandigarh': {'lat': 30.7333, 'lng': 76.8277, 'base_aqi': 140},
        'Dadra and Nagar Haveli': {'lat': 20.1809, 'lng': 73.7997, 'base_aqi': 100},
        'Daman and Diu': {'lat': 20.4283, 'lng': 72.8479, 'base_aqi': 85},
        'Delhi': {'lat': 28.7041, 'lng': 77.1025, 'base_aqi': 187},
        'Lakshadweep': {'lat': 10.5667, 'lng': 72.7417, 'base_aqi': 45},
        'Puducherry': {'lat': 12.9716, 'lng': 79.8550, 'base_aqi': 70},
        'Ladakh': {'lat': 34.1526, 'lng': 77.5770, 'base_aqi': 50}
    }
    
    cities = []
    for state, city_name in INDIA_CITIES.items():
        coords = CITY_COORDINATES.get(state, {'lat': 20.0, 'lng': 78.0, 'base_aqi': 100})
        cities.append({
            'city': city_name,
            'state': state,
            'latitude': coords['lat'],
            'longitude': coords['lng'],
            'base_aqi': coords['base_aqi']
        })
    
    return cities

# Test the functions
if __name__ == '__main__':
    # Test WAQI API
    result = get_aqi_with_fallback('Delhi', 'Delhi')
    print(f"Delhi AQI: {result}")
    
    # Show all states
    cities = create_city_profile_data()
    print(f"\nTotal Indian states/UTs: {len(cities)}")
    for city in cities[:5]:
        print(f"  {city['state']}: {city['city']}")
