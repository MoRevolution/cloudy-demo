# 📋 API Specifications
## Cloudy with a Chance of Cost Overruns

### Overview

This document outlines the API specifications and data structures used in the Cloudy with a Chance of Cost Overruns application.

---

## 🌤️ Weather API Integration

### Azure Maps Weather API

**Base URL**: `https://atlas.microsoft.com/weather`

#### Get Current Weather Conditions
```http
GET /currentConditions/json?api-version=1.0&query={lat},{lon}&subscription-key={subscription-key}
```

**Parameters:**
- `api-version` (required): API version (`1.0`)
- `query` (required): Latitude,longitude coordinates (`lat,lon`)
- `subscription-key` (required): Your Azure Maps subscription key
- `language` (optional): Language code (e.g., `en-US`)
- `unit` (optional): Unit system (`metric`, `imperial`)

**Example Request:**
```javascript
const response = await fetch(
  `https://atlas.microsoft.com/weather/currentConditions/json?api-version=1.0&query=37.3719,-78.8964&subscription-key=${AZURE_MAPS_KEY}`
);
```

**Example Response:**
```json
{
  "results": [
    {
      "dateTime": "2025-01-01T12:00:00+00:00",
      "phrase": "Partly cloudy",
      "iconCode": 3,
      "hasPrecipitation": false,
      "isDayTime": true,
      "temperature": {
        "value": 22.5,
        "unit": "C",
        "unitType": 17
      },
      "realFeelTemperature": {
        "value": 23.1,
        "unit": "C",
        "unitType": 17
      },
      "relativeHumidity": 65,
      "dewPoint": {
        "value": 15.8,
        "unit": "C",
        "unitType": 17
      },
      "wind": {
        "direction": {
          "degrees": 180,
          "localizedDescription": "S"
        },
        "speed": {
          "value": 18.7,
          "unit": "km/h",
          "unitType": 7
        }
      },
      "windGust": {
        "speed": {
          "value": 25.9,
          "unit": "km/h",
          "unitType": 7
        }
      },
      "uvIndex": 5,
      "uvIndexPhrase": "Moderate",
      "visibility": {
        "value": 16.1,
        "unit": "km",
        "unitType": 6
      },
      "cloudCover": 30,
      "pressure": {
        "value": 1013.2,
        "unit": "mb",
        "unitType": 14
      },
      "pressureTendency": {
        "localizedDescription": "Steady",
        "code": "S"
      }
    }
  ]
}
```

---

## 📊 Internal Data Structures

### Azure Region Data Model

**File**: [`data/azure-regions.json`](../data/azure-regions.json)

```typescript
interface AzureRegion {
  id: string;                    // Unique identifier (e.g., "eastus")
  name: string;                  // Short name (e.g., "East US")
  displayName: string;           // Full display name (e.g., "East US (Virginia)")
  coordinates: {
    latitude: number;            // Decimal degrees
    longitude: number;           // Decimal degrees
  };
  timezone: string;              // IANA timezone (e.g., "America/New_York")
  electricityPrice: number;      // Price per kWh in USD
  currency: string;              // Currency code (e.g., "USD")
  country: string;               // Country code (e.g., "US")
  continent: string;             // Continent name (e.g., "North America")
}
```

**Example:**
```json
{
  "id": "eastus",
  "name": "East US",
  "displayName": "East US (Virginia)",
  "coordinates": {
    "latitude": 37.3719,
    "longitude": -78.8964
  },
  "timezone": "America/New_York",
  "electricityPrice": 0.12,
  "currency": "USD",
  "country": "US",
  "continent": "North America"
}
```

### Weather Data Model

```typescript
interface WeatherData {
  temperature: number;           // Temperature in Celsius
  humidity: number;              // Humidity percentage (0-100)
  condition: string;             // Weather condition (e.g., "Clear", "Clouds")
  description: string;           // Detailed description (e.g., "clear sky")
  windSpeed: number;             // Wind speed in m/s
  visibility: number;            // Visibility in meters
  pressure: number;              // Atmospheric pressure in hPa
  timestamp: string;             // ISO 8601 timestamp
  icon: string;                  // Weather icon code
}
```

### Cost Calculation Model

```typescript
interface CostCalculation {
  baseIndex: number;             // Base cost index (1.0 = baseline)
  temperatureFactor: number;     // Temperature impact factor
  humidityFactor: number;        // Humidity impact factor
  electricityFactor: number;     // Electricity pricing factor
  finalIndex: number;            // Final calculated cost index
  healthScore: HealthScore;      // Cloud health rating
  estimatedCost: number;         // Estimated monthly cost impact
}

enum HealthScore {
  EXCELLENT = "excellent",       // Green (< 1.2)
  GOOD = "good",                // Yellow (1.2 - 1.5)
  FAIR = "fair",                // Orange (1.5 - 1.8)
  POOR = "poor"                 // Red (>= 1.8)
}
```

---

## 🧮 Cost Calculation Formulas

### Primary Cost Index Formula

```javascript
function calculateCostIndex(weather, region) {
  const IDEAL_TEMP = 20; // Celsius - optimal data center temperature
  const HUMIDITY_THRESHOLD = 60; // Percentage
  const BASE_ELECTRICITY_PRICE = 0.10; // USD per kWh baseline
  
  // Temperature factor: linear increase for deviation from ideal
  const tempDelta = Math.abs(weather.temperature - IDEAL_TEMP);
  const temperatureFactor = 1 + (tempDelta * 0.05);
  
  // Humidity factor: penalty for high humidity
  const humidityFactor = weather.humidity > HUMIDITY_THRESHOLD ? 1.2 : 1.0;
  
  // Electricity pricing factor: normalized to baseline
  const electricityFactor = region.electricityPrice / BASE_ELECTRICITY_PRICE;
  
  // Final calculation
  const costIndex = temperatureFactor * humidityFactor * electricityFactor;
  
  return {
    baseIndex: 1.0,
    temperatureFactor,
    humidityFactor,
    electricityFactor,
    finalIndex: costIndex
  };
}
```

### Cloud Health Score Mapping

```javascript
function getHealthScore(costIndex) {
  if (costIndex < 1.2) return 'excellent';
  if (costIndex < 1.5) return 'good';
  if (costIndex < 1.8) return 'fair';
  return 'poor';
}
```

### Extended Calculation (Optional)

```javascript
function calculateExtendedCost(weather, region) {
  const baseCost = calculateCostIndex(weather, region);
  
  // Optional wind cooling factor
  const windFactor = weather.windSpeed > 10 ? 0.95 : 1.0;
  
  // Optional visibility factor (dust/pollution impact)
  const visibilityFactor = weather.visibility < 5000 ? 1.05 : 1.0;
  
  return {
    ...baseCost,
    windFactor,
    visibilityFactor,
    finalIndex: baseCost.finalIndex * windFactor * visibilityFactor
  };
}
```

---

## 🔧 Configuration Files

### Cost Formula Configuration

**File**: [`data/cost-formulas.json`](../data/cost-formulas.json)

```json
{
  "idealTemperature": 20,
  "temperatureSensitivity": 0.05,
  "humidityThreshold": 60,
  "humidityPenalty": 1.2,
  "baseElectricityPrice": 0.10,
  "healthScoreThresholds": {
    "excellent": 1.2,
    "good": 1.5,
    "fair": 1.8
  },
  "optionalFactors": {
    "windCoolingThreshold": 10,
    "windCoolingBenefit": 0.95,
    "visibilityThreshold": 5000,
    "visibilityPenalty": 1.05
  }
}
```

### Electricity Pricing Data

**File**: [`data/electricity-pricing.json`](../data/electricity-pricing.json)

```json
{
  "regions": {
    "eastus": {
      "price": 0.12,
      "currency": "USD",
      "unit": "kWh",
      "source": "EIA Average",
      "lastUpdated": "2025-01-01"
    },
    "westeurope": {
      "price": 0.25,
      "currency": "EUR",
      "unit": "kWh",
      "source": "Eurostat Average",
      "lastUpdated": "2025-01-01"
    }
  },
  "exchangeRates": {
    "EUR": 0.85,
    "GBP": 0.73,
    "JPY": 110.0
  }
}
```

---

## 🌐 Frontend API Integration

### Weather Service Module

```javascript
class AzureMapsWeatherService {
  constructor(subscriptionKey, baseUrl) {
    this.subscriptionKey = subscriptionKey;
    this.baseUrl = baseUrl || 'https://atlas.microsoft.com/weather';
    this.cache = new Map();
    this.cacheTimeout = 15 * 60 * 1000; // 15 minutes
  }
  
  async getCurrentWeather(latitude, longitude) {
    const cacheKey = `${latitude},${longitude}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    
    try {
      const url = `${this.baseUrl}/currentConditions/json?api-version=1.0&query=${latitude},${longitude}&subscription-key=${this.subscriptionKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Azure Maps Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      const weatherData = this.transformWeatherData(data);
      
      this.cache.set(cacheKey, {
        data: weatherData,
        timestamp: Date.now()
      });
      
      return weatherData;
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      return cached?.data || null;
    }
  }
  
  transformWeatherData(apiData) {
    const result = apiData.results[0];
    
    return {
      temperature: result.temperature.value,
      humidity: result.relativeHumidity,
      condition: this.mapConditionFromIcon(result.iconCode),
      description: result.phrase,
      windSpeed: result.wind.speed.value * 0.277778, // Convert km/h to m/s
      visibility: result.visibility.value * 1000, // Convert km to meters
      pressure: result.pressure.value,
      timestamp: result.dateTime,
      iconCode: result.iconCode,
      uvIndex: result.uvIndex,
      cloudCover: result.cloudCover
    };
  }
  
  mapConditionFromIcon(iconCode) {
    const iconMap = {
      1: 'Clear',
      2: 'Partly Cloudy',
      3: 'Partly Cloudy',
      4: 'Cloudy',
      5: 'Haze',
      6: 'Mostly Cloudy',
      7: 'Cloudy',
      8: 'Overcast',
      11: 'Fog',
      12: 'Rain',
      13: 'Light Rain',
      14: 'Heavy Rain',
      15: 'Thunderstorm',
      16: 'Thunderstorm',
      17: 'Thunderstorm',
      18: 'Rain',
      19: 'Snow',
      20: 'Light Snow',
      21: 'Heavy Snow',
      22: 'Snow',
      23: 'Mixed',
      24: 'Freezing Rain',
      25: 'Sleet',
      26: 'Freezing Rain'
    };
    
    return iconMap[iconCode] || 'Unknown';
  }
}
```

### Cost Calculator Module

```javascript
class CostCalculator {
  constructor(formulas) {
    this.formulas = formulas;
  }
  
  calculate(weather, region) {
    const tempDelta = Math.abs(weather.temperature - this.formulas.idealTemperature);
    const temperatureFactor = 1 + (tempDelta * this.formulas.temperatureSensitivity);
    
    const humidityFactor = weather.humidity > this.formulas.humidityThreshold 
      ? this.formulas.humidityPenalty 
      : 1.0;
    
    const electricityFactor = region.electricityPrice / this.formulas.baseElectricityPrice;
    
    const finalIndex = temperatureFactor * humidityFactor * electricityFactor;
    
    return {
      baseIndex: 1.0,
      temperatureFactor,
      humidityFactor,
      electricityFactor,
      finalIndex,
      healthScore: this.getHealthScore(finalIndex),
      estimatedMonthlyCost: this.estimateMonthlyCost(finalIndex, region)
    };
  }
  
  getHealthScore(costIndex) {
    const thresholds = this.formulas.healthScoreThresholds;
    if (costIndex < thresholds.excellent) return 'excellent';
    if (costIndex < thresholds.good) return 'good';
    if (costIndex < thresholds.fair) return 'fair';
    return 'poor';
  }
  
  estimateMonthlyCost(costIndex, region) {
    const baseServerCost = 100; // USD per month baseline
    return Math.round(baseServerCost * costIndex);
  }
}
```

---

## 🚦 Error Handling

### Azure Maps Weather API Error Responses

```javascript
// Unauthorized (Invalid subscription key)
{
  "error": {
    "code": "401",
    "message": "Access denied due to invalid subscription key. Make sure to provide a valid key for an active subscription."
  }
}

// Forbidden (Quota exceeded)
{
  "error": {
    "code": "403",
    "message": "Out of call volume quota. Quota will be replenished in XX:XX:XX."
  }
}

// Not Found (Invalid location)
{
  "error": {
    "code": "400",
    "message": "Bad request. One or more parameters were incorrectly specified or are mutually exclusive."
  }
}

// Rate Limit Exceeded
{
  "error": {
    "code": "429",
    "message": "Rate limit exceeded. Retry after some time."
  }
}
```

### Error Handling Strategy

```javascript
class AzureMapsErrorHandler {
  static handleWeatherError(error, context) {
    // Handle HTTP status codes
    switch (error.status) {
      case 401:
        return {
          type: 'SUBSCRIPTION_KEY_INVALID',
          message: 'Azure Maps subscription key authentication failed',
          userMessage: 'Unable to load weather data. Please contact support.'
        };
      case 403:
        return {
          type: 'QUOTA_EXCEEDED',
          message: 'Azure Maps API quota exceeded',
          userMessage: 'Weather service quota exceeded. Please try again later.'
        };
      case 400:
        return {
          type: 'INVALID_REQUEST',
          message: `Invalid coordinates for ${context.region}`,
          userMessage: 'Weather data unavailable for this location'
        };
      case 429:
        return {
          type: 'RATE_LIMIT_EXCEEDED',
          message: 'Azure Maps API rate limit exceeded',
          userMessage: 'Too many requests. Please try again in a few minutes.'
        };
      case 500:
        return {
          type: 'SERVER_ERROR',
          message: 'Azure Maps server error',
          userMessage: 'Weather service temporarily unavailable'
        };
      default:
        return {
          type: 'UNKNOWN_ERROR',
          message: error.message,
          userMessage: 'Weather data temporarily unavailable'
        };
    }
  }
  
  static isRetryableError(error) {
    return [429, 500, 502, 503, 504].includes(error.status);
  }
  
  static getRetryDelay(error) {
    if (error.status === 429) {
      // Extract retry-after header if available
      return 60000; // 1 minute default
    }
    return 5000; // 5 seconds for server errors
  }
}
```

---

## 📈 Performance Considerations

### Caching Strategy

1. **Browser Cache**: 15-minute cache for weather data
2. **Local Storage**: Persistent cache for region data
3. **CDN Cache**: Static assets cached at edge locations

### Rate Limiting

- **Azure Maps S0 Tier**: 1,000 QPS (Queries Per Second)
- **Azure Maps S1 Tier**: Unlimited QPS (pay-per-transaction)
- **Request Debouncing**: 500ms delay between rapid clicks
- **Batch Requests**: Group nearby regions when possible

### Optimization Techniques

```javascript
// Debounced weather requests
const debouncedWeatherRequest = debounce(async (region) => {
  return await weatherService.getCurrentWeather(
    region.coordinates.latitude,
    region.coordinates.longitude
  );
}, 500);

// Request batching for nearby regions
class BatchWeatherService {
  async getWeatherForRegions(regions) {
    const batches = this.groupRegionsByProximity(regions, 100); // 100km radius
    const promises = batches.map(batch => this.getBatchWeather(batch));
    return Promise.all(promises);
  }
}
```

---

## 🔒 Security Considerations

### API Key Protection

- Store API keys in environment variables
- Never expose keys in client-side code
- Use Azure Static Web Apps environment configuration
- Implement request origin validation

### CORS Configuration

```json
{
  "cors": {
    "allowedOrigins": [
      "https://yourdomain.com",
      "https://*.azurestaticapps.net"
    ],
    "allowedMethods": ["GET"],
    "allowedHeaders": ["Content-Type"]
  }
}
```

---

This API specification provides comprehensive documentation for all data structures, API integrations, and implementation details needed to build and maintain the Cloudy with a Chance of Cost Overruns application.