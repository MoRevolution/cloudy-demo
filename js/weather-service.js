/**
 * Azure Maps Weather Service
 * Simplified implementation for fetching weather data
 */
class WeatherService {
    constructor() {
        // In a real app, this would come from environment variables
        // For demo purposes, we'll use a placeholder
        this.subscriptionKey = this.getSubscriptionKey();
        this.baseUrl = 'https://atlas.microsoft.com/weather';
        this.cache = new Map();
        this.cacheTimeout = 15 * 60 * 1000; // 15 minutes
    }

    getSubscriptionKey() {
        // Try to get from various sources
        if (typeof process !== 'undefined' && process.env) {
            return process.env.AZURE_MAPS_SUBSCRIPTION_KEY;
        }
        
        // For demo/development, you can set it here temporarily
        // DO NOT commit real keys to version control!
        const demoKey = 'your-azure-maps-key-here';
        
        if (demoKey === 'your-azure-maps-key-here') {
            console.warn('⚠️ Azure Maps subscription key not configured. Using mock data.');
            return null;
        }
        
        return demoKey;
    }

    async getCurrentWeather(latitude, longitude, regionName) {
        const cacheKey = `${latitude},${longitude}`;
        const cached = this.cache.get(cacheKey);
        
        // Return cached data if available and not expired
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        // If no subscription key, return mock data
        if (!this.subscriptionKey) {
            return this.getMockWeatherData(regionName);
        }

        try {
            const url = `${this.baseUrl}/currentConditions/json?api-version=1.0&query=${latitude},${longitude}&subscription-key=${this.subscriptionKey}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            const weatherData = this.transformAzureMapsData(data);
            
            // Cache the result
            this.cache.set(cacheKey, {
                data: weatherData,
                timestamp: Date.now()
            });
            
            return weatherData;
            
        } catch (error) {
            console.error('Failed to fetch weather data:', error);
            
            // Try to return cached data if available
            if (cached) {
                console.log('Using cached weather data due to API error');
                return cached.data;
            }
            
            // Fall back to mock data
            console.log('Using mock weather data due to API error');
            return this.getMockWeatherData(regionName);
        }
    }

    transformAzureMapsData(apiData) {
        const result = apiData.results[0];
        
        return {
            temperature: Math.round(result.temperature.value),
            humidity: result.relativeHumidity,
            condition: this.mapConditionFromIcon(result.iconCode),
            description: result.phrase,
            windSpeed: Math.round(result.wind.speed.value * 0.277778), // Convert km/h to m/s
            visibility: Math.round(result.visibility.value), // km
            pressure: Math.round(result.pressure.value),
            timestamp: result.dateTime,
            iconCode: result.iconCode,
            uvIndex: result.uvIndex || 0,
            cloudCover: result.cloudCover || 0
        };
    }

    mapConditionFromIcon(iconCode) {
        const iconMap = {
            1: 'Clear', 2: 'Partly Cloudy', 3: 'Partly Cloudy', 4: 'Cloudy',
            5: 'Haze', 6: 'Mostly Cloudy', 7: 'Cloudy', 8: 'Overcast',
            11: 'Fog', 12: 'Rain', 13: 'Light Rain', 14: 'Heavy Rain',
            15: 'Thunderstorm', 16: 'Thunderstorm', 17: 'Thunderstorm',
            18: 'Rain', 19: 'Snow', 20: 'Light Snow', 21: 'Heavy Snow',
            22: 'Snow', 23: 'Mixed', 24: 'Freezing Rain', 25: 'Sleet',
            26: 'Freezing Rain'
        };
        return iconMap[iconCode] || 'Unknown';
    }

    getMockWeatherData(regionName) {
        // Generate realistic mock data based on region
        const mockData = {
            'East US': { temp: 22, humidity: 65, condition: 'Partly Cloudy' },
            'West US': { temp: 25, humidity: 55, condition: 'Clear' },
            'North Europe': { temp: 15, humidity: 75, condition: 'Cloudy' },
            'West Europe': { temp: 18, humidity: 70, condition: 'Rain' },
            'Southeast Asia': { temp: 32, humidity: 85, condition: 'Thunderstorm' },
            'East Asia': { temp: 28, humidity: 80, condition: 'Haze' },
            'Australia East': { temp: 20, humidity: 60, condition: 'Clear' },
            'Japan East': { temp: 16, humidity: 68, condition: 'Partly Cloudy' },
            'UK South': { temp: 12, humidity: 82, condition: 'Rain' },
            'Canada Central': { temp: 8, humidity: 58, condition: 'Snow' },
            'Brazil South': { temp: 26, humidity: 72, condition: 'Thunderstorm' },
            'South India': { temp: 35, humidity: 90, condition: 'Clear' }
        };

        const baseData = mockData[regionName] || { temp: 20, humidity: 60, condition: 'Clear' };
        
        // Add some randomness to make it feel more realistic
        const tempVariation = (Math.random() - 0.5) * 6; // ±3°C variation
        const humidityVariation = (Math.random() - 0.5) * 20; // ±10% variation
        
        return {
            temperature: Math.round(baseData.temp + tempVariation),
            humidity: Math.max(0, Math.min(100, Math.round(baseData.humidity + humidityVariation))),
            condition: baseData.condition,
            description: baseData.condition.toLowerCase(),
            windSpeed: Math.round(Math.random() * 15), // 0-15 m/s
            visibility: Math.round(5 + Math.random() * 15), // 5-20 km
            pressure: Math.round(1000 + Math.random() * 40), // 1000-1040 hPa
            timestamp: new Date().toISOString(),
            iconCode: this.getIconCodeFromCondition(baseData.condition),
            uvIndex: Math.round(Math.random() * 11), // 0-11
            cloudCover: Math.round(Math.random() * 100) // 0-100%
        };
    }

    getIconCodeFromCondition(condition) {
        const conditionMap = {
            'Clear': 1,
            'Partly Cloudy': 3,
            'Cloudy': 7,
            'Rain': 12,
            'Thunderstorm': 15,
            'Snow': 19,
            'Haze': 5,
            'Fog': 11
        };
        return conditionMap[condition] || 1;
    }

    getWeatherEmoji(condition) {
        const emojiMap = {
            'Clear': '☀️',
            'Partly Cloudy': '⛅',
            'Cloudy': '☁️',
            'Rain': '🌧️',
            'Light Rain': '🌦️',
            'Heavy Rain': '🌧️',
            'Thunderstorm': '⛈️',
            'Snow': '❄️',
            'Light Snow': '🌨️',
            'Heavy Snow': '❄️',
            'Haze': '🌫️',
            'Fog': '🌫️',
            'Overcast': '☁️'
        };
        return emojiMap[condition] || '🌤️';
    }
}

// Global weather service instance
const weatherService = new WeatherService();