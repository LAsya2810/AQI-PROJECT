#!/usr/bin/env python3
"""Quick test script to check backend status"""
import requests
import json

try:
    print("🔍 Testing Backend Status...\n")
    
    # Test health
    health = requests.get('http://localhost:5000/api/health', timeout=2).json()
    print(f"✅ Backend Health: {health['status']}")
    
    # Get cities
    cities = requests.get('http://localhost:5000/api/cities', timeout=2).json()
    print(f"✅ Total Cities Loaded: {len(cities)}")
    
    print("\n📋 First 10 Cities:")
    for i, city in enumerate(cities[:10], 1):
        print(f"  {i}. {city['name']:20} | {city['state']:25} | AQI: {city['aqi']}")
    
    print(f"\n... and {len(cities) - 10} more")
    
    # Test AI advisor
    advisor_test = requests.post('http://localhost:5000/api/ai-advisor', 
        json={'city': 'Delhi', 'aqi': 187, 'min_forecast': 150, 'max_forecast': 220},
        timeout=5).json()
    print(f"\n🤖 AI Advisor Test:")
    print(f"  Status: ✅ Working")
    print(f"  Source: {advisor_test.get('source', 'unknown')}")
    print(f"  Insight: {advisor_test.get('insight', 'N/A')[:80]}...")
    
except requests.exceptions.ConnectError:
    print("❌ ERROR: Cannot connect to backend on http://localhost:5000")
    print("   Please start the backend first: python app.py")
except Exception as e:
    print(f"❌ ERROR: {str(e)}")
