/**
 * API Client for AQI Backend
 * Handles all HTTP requests to the backend server
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ─────────────────────────────────────────────────────────────────────────────
// CORE API FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Make a GET request to the API
 */
const apiGet = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`GET ${endpoint} failed:`, error);
    throw error;
  }
};

/**
 * Make a POST request to the API
 */
const apiPost = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`POST ${endpoint} failed:`, error);
    throw error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// AQI DATA ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get current AQI data for a specific city
 */
export const getCurrentAQI = (city) => apiGet(`/current/${city}`);

/**
 * Get list of all cities with current AQI
 */
export const getAllCities = () => apiGet('/cities');

/**
 * Get 24-hour forecast for a city
 */
export const getForecast = (city) => apiGet(`/forecast/${city}`);

/**
 * Get 7-day trend for a city
 */
export const getTrend = (city) => apiGet(`/trend/${city}`);

/**
 * Get safe windows for outdoor activities
 */
export const getSafeWindows = (city) => apiGet(`/safe-windows/${city}`);

/**
 * Get factor analysis (pollution drivers)
 */
export const getFactorAnalysis = (city) => apiGet(`/factor-analysis/${city}`);

// ─────────────────────────────────────────────────────────────────────────────
// HEALTH & EXPOSURE ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate personal health exposure
 */
export const calculateExposure = (aqi, userType, activity, duration) => 
  apiPost('/exposure', {
    aqi,
    user_type: userType,
    activity,
    duration,
  });

/**
 * Get institution alert status
 */
export const getInstitutionAlert = (city, institution) =>
  apiGet(`/institution-alert/${city}/${institution}`);

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS FOR FRONTEND COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get current AQI with all city metadata
 */
export const getCityData = async (city) => {
  try {
    const data = await getCurrentAQI(city);
    return {
      city: data.city,
      state: data.state,
      base: data.aqi,  // For compatibility with existing code
      aqi: data.aqi,
      category: data.category,
      color: data.color,
      wind_speed: data.wind_speed,
      humidity: data.humidity,
      temperature: data.temperature,
      pm25: data.pm25,
      pm10: data.pm10,
    };
  } catch (error) {
    console.error('Failed to fetch city data:', error);
    return null;
  }
};

/**
 * Get all city comparison data
 */
export const getCityComparison = async () => {
  try {
    return await getAllCities();
  } catch (error) {
    console.error('Failed to fetch cities:', error);
    return [];
  }
};

/**
 * Check server health
 */
export const checkHealth = () => apiGet('/health');

// ─────────────────────────────────────────────────────────────────────────────
// ERROR HANDLING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Handle API errors gracefully
 */
export const handleAPIError = (error, defaultValue = null) => {
  if (error.message.includes('Failed to fetch')) {
    console.warn('Backend server is not responding. Using fallback data.');
  } else {
    console.error('API Error:', error);
  }
  return defaultValue;
};
