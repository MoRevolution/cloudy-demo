/**
 * Cost Calculator
 * Simplified implementation for calculating data center cost estimates
 */
class CostCalculator {
    constructor() {
        // Simple configuration - can be made more complex later
        this.config = {
            idealTemperature: 20, // Celsius - optimal data center temperature
            temperatureSensitivity: 0.05, // Cost increase per degree deviation
            humidityThreshold: 60, // Percentage
            humidityPenalty: 1.2, // Multiplier for high humidity
            baseElectricityPrice: 0.10, // USD per kWh baseline
            healthScoreThresholds: {
                excellent: 1.2,
                good: 1.5,
                fair: 1.8
            }
        };
    }

    /**
     * Calculate cost index and health score for a region
     * @param {Object} weather - Weather data object
     * @param {Object} region - Azure region data object
     * @returns {Object} Cost calculation results
     */
    calculate(weather, region) {
        // Temperature factor: linear increase for deviation from ideal
        const tempDelta = Math.abs(weather.temperature - this.config.idealTemperature);
        const temperatureFactor = 1 + (tempDelta * this.config.temperatureSensitivity);

        // Humidity factor: penalty for high humidity (cooling is less efficient)
        const humidityFactor = weather.humidity > this.config.humidityThreshold 
            ? this.config.humidityPenalty 
            : 1.0;

        // Electricity pricing factor: normalized to baseline
        const electricityFactor = region.electricityPrice / this.config.baseElectricityPrice;

        // Optional: Wind cooling factor (high wind can help with cooling)
        const windFactor = weather.windSpeed > 10 ? 0.95 : 1.0;

        // Calculate final cost index
        const finalIndex = temperatureFactor * humidityFactor * electricityFactor * windFactor;

        // Determine health score
        const healthScore = this.getHealthScore(finalIndex);

        // Calculate estimated monthly cost impact
        const estimatedMonthlyCost = this.estimateMonthlyCost(finalIndex);

        return {
            baseIndex: 1.0,
            temperatureFactor: Math.round(temperatureFactor * 100) / 100,
            humidityFactor: Math.round(humidityFactor * 100) / 100,
            electricityFactor: Math.round(electricityFactor * 100) / 100,
            windFactor: Math.round(windFactor * 100) / 100,
            finalIndex: Math.round(finalIndex * 100) / 100,
            healthScore: healthScore,
            estimatedMonthlyCost: estimatedMonthlyCost,
            factors: this.getFactorExplanations(weather, region, {
                temperatureFactor,
                humidityFactor,
                electricityFactor,
                windFactor
            })
        };
    }

    /**
     * Determine health score based on cost index
     * @param {number} costIndex - Calculated cost index
     * @returns {string} Health score category
     */
    getHealthScore(costIndex) {
        const thresholds = this.config.healthScoreThresholds;
        
        if (costIndex < thresholds.excellent) return 'excellent';
        if (costIndex < thresholds.good) return 'good';
        if (costIndex < thresholds.fair) return 'fair';
        return 'poor';
    }

    /**
     * Estimate monthly cost impact
     * @param {number} costIndex - Calculated cost index
     * @returns {number} Estimated monthly cost in USD
     */
    estimateMonthlyCost(costIndex) {
        const baseServerCost = 100; // USD per month baseline for a standard server
        return Math.round(baseServerCost * costIndex);
    }

    /**
     * Get explanations for each factor
     * @param {Object} weather - Weather data
     * @param {Object} region - Region data
     * @param {Object} factors - Calculated factors
     * @returns {Array} Array of factor explanations
     */
    getFactorExplanations(weather, region, factors) {
        const explanations = [];

        // Temperature explanation
        const tempDelta = Math.abs(weather.temperature - this.config.idealTemperature);
        if (tempDelta > 5) {
            const direction = weather.temperature > this.config.idealTemperature ? 'higher' : 'lower';
            explanations.push({
                factor: 'Temperature',
                impact: factors.temperatureFactor > 1 ? 'increases' : 'neutral',
                description: `${weather.temperature}°C is ${Math.round(tempDelta)}°C ${direction} than ideal (${this.config.idealTemperature}°C)`
            });
        }

        // Humidity explanation
        if (weather.humidity > this.config.humidityThreshold) {
            explanations.push({
                factor: 'Humidity',
                impact: 'increases',
                description: `High humidity (${weather.humidity}%) reduces cooling efficiency`
            });
        }

        // Electricity pricing explanation
        if (factors.electricityFactor !== 1.0) {
            const comparison = factors.electricityFactor > 1 ? 'higher' : 'lower';
            explanations.push({
                factor: 'Electricity Cost',
                impact: factors.electricityFactor > 1 ? 'increases' : 'decreases',
                description: `Regional electricity cost ($${region.electricityPrice}/kWh) is ${comparison} than baseline`
            });
        }

        // Wind factor explanation
        if (factors.windFactor < 1.0) {
            explanations.push({
                factor: 'Wind',
                impact: 'decreases',
                description: `High wind speed (${weather.windSpeed} m/s) helps with natural cooling`
            });
        }

        return explanations;
    }

    /**
     * Get a simple explanation of the cost index
     * @param {number} costIndex - Calculated cost index
     * @returns {string} Simple explanation
     */
    getSimpleExplanation(costIndex) {
        if (costIndex < 1.1) {
            return "Great conditions! This region has optimal weather for data center operations.";
        } else if (costIndex < 1.3) {
            return "Good conditions with minor cost impacts from weather.";
        } else if (costIndex < 1.6) {
            return "Fair conditions. Weather factors moderately increase operating costs.";
        } else {
            return "Challenging conditions. Weather significantly impacts data center efficiency.";
        }
    }

    /**
     * Get health score color for UI
     * @param {string} healthScore - Health score category
     * @returns {string} CSS class name
     */
    getHealthScoreColor(healthScore) {
        const colorMap = {
            'excellent': '#27ae60',
            'good': '#f39c12',
            'fair': '#e67e22',
            'poor': '#e74c3c'
        };
        return colorMap[healthScore] || '#95a5a6';
    }

    /**
     * Get health score emoji
     * @param {string} healthScore - Health score category
     * @returns {string} Emoji representation
     */
    getHealthScoreEmoji(healthScore) {
        const emojiMap = {
            'excellent': '🟢',
            'good': '🟡',
            'fair': '🟠',
            'poor': '🔴'
        };
        return emojiMap[healthScore] || '⚪';
    }
}

// Global cost calculator instance
const costCalculator = new CostCalculator();