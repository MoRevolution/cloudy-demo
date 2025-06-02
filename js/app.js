/**
 * Main Application
 * Simplified implementation of the Cloudy with a Chance of Cost Overruns app
 */
class CloudyCostApp {
    constructor() {
        this.map = null;
        this.regions = [];
        this.markers = [];
        this.currentRegion = null;
        
        this.init();
    }

    async init() {
        try {
            // Load Azure regions data
            await this.loadRegions();
            
            // Initialize the map
            this.initMap();
            
            // Add region markers with health status colors
            await this.addRegionMarkers();
            
            console.log('🌤️ Cloudy Cost Overruns app initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to initialize the application. Please refresh the page.');
        }
    }

    async loadRegions() {
        try {
            this.regions = await azureRegionsService.getRegions();
            console.log(`✅ Loaded ${this.regions.length} Azure regions`);
        } catch (error) {
            console.error('Error loading regions:', error);
            // Use minimal fallback data if everything fails
            this.regions = this.getFallbackRegions();
        }
    }

    getFallbackRegions() {
        // Ultra-minimal fallback data in case everything fails
        return [
            {
                id: "eastus",
                name: "eastus",
                displayName: "East US",
                coordinates: { latitude: 37.3719, longitude: -78.8964 },
                electricityPrice: 0.12,
                country: "United States"
            },
            {
                id: "westeurope",
                name: "westeurope",
                displayName: "West Europe",
                coordinates: { latitude: 52.3667, longitude: 4.9 },
                electricityPrice: 0.25,
                country: "Netherlands"
            }
        ];
    }    initMap() {
        // Initialize Leaflet map
        this.map = L.map('map').setView([20, 0], 2);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 10,
            minZoom: 2
        }).addTo(this.map);

        // Set map bounds to prevent infinite scrolling
        this.map.setMaxBounds([[-90, -200], [90, 200]]);
        
        // Handle window resize to ensure the map fills the container properly
        window.addEventListener('resize', () => {
            this.map.invalidateSize();
        });
        
        // Ensure map properly renders when container is fully loaded
        setTimeout(() => {
            this.map.invalidateSize();
        }, 300);
    }

    async addRegionMarkers() {
        for (const [index, region] of this.regions.entries()) {
            // Get weather data and calculate health status for initial color
            const weather = await weatherService.getCurrentWeather(
                region.coordinates.latitude,
                region.coordinates.longitude,
                region.name
            );
            const costData = costCalculator.calculate(weather, region);
            const healthColor = this.getHealthScoreColor(costData.healthScore);
            
            const marker = L.circleMarker(
                [region.coordinates.latitude, region.coordinates.longitude],
                {
                    radius: 10,
                    fillColor: healthColor,
                    color: '#ffffff',
                    weight: 3,
                    opacity: 1,
                    fillOpacity: 0.85,
                    className: 'region-marker'
                }
            );

            // Add click event with haptic feedback
            marker.on('click', (e) => {
                // Add ripple effect
                this.createRippleEffect(e.latlng);
                this.onRegionClick(region, marker);
            });            // Improved hover effects to prevent jitter and conflicts
            let isHovered = false;
            let hoverTimer = null;
            
            marker.on('mouseover', () => {
                if (hoverTimer) clearTimeout(hoverTimer);
                
                if (!isHovered) {
                    isHovered = true;
                    marker._path.style.transition = 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
                    marker.setStyle({
                        radius: 13,
                        fillOpacity: 1,
                        weight: 4
                    });
                }
            });

            marker.on('mouseout', () => {
                if (isHovered) {
                    // Add a slight delay before resetting to prevent jitter
                    hoverTimer = setTimeout(() => {
                        isHovered = false;
                        marker.setStyle({
                            radius: 10,
                            fillOpacity: 0.85,
                            weight: 3
                        });
                    }, 50);
                }
            });

            // Add to map with staggered animation
            setTimeout(() => {
                marker.addTo(this.map);
            }, index * 100);
            
            this.markers.push({ marker, region, weather, costData });

            // Enhanced tooltip with health status
            marker.bindTooltip(`${region.displayName} - ${costData.healthScore.toUpperCase()}`, {
                permanent: false,
                direction: 'top',
                className: 'region-tooltip',
                offset: [0, -10]
            });
        }
    }
    
    getHealthScoreColor(healthScore) {
        const colorMap = {
            'excellent': '#10b981',
            'good': '#f59e0b',
            'fair': '#ef4444',
            'poor': '#dc2626'
        };
        return colorMap[healthScore] || '#64748b';
    }

    createRippleEffect(latlng) {
        const ripple = L.circleMarker(latlng, {
            radius: 10,
            fillColor: '#8b5cf6',
            color: '#8b5cf6',
            weight: 2,
            opacity: 0.7,
            fillOpacity: 0.3
        }).addTo(this.map);

        // Animate ripple
        let currentRadius = 10;
        const maxRadius = 30;
        const animation = setInterval(() => {
            currentRadius += 2;
            ripple.setStyle({
                radius: currentRadius,
                opacity: 0.7 * (1 - currentRadius / maxRadius),
                fillOpacity: 0.3 * (1 - currentRadius / maxRadius)
            });

            if (currentRadius >= maxRadius) {
                clearInterval(animation);
                this.map.removeLayer(ripple);
            }
        }, 50);
    }

    async onRegionClick(region, marker) {
        try {
            // Show loading
            this.showLoading();
            
            // Update current region
            this.currentRegion = region;

            // Fetch weather data
            const weather = await weatherService.getCurrentWeather(
                region.coordinates.latitude,
                region.coordinates.longitude,
                region.name
            );

            // Calculate cost metrics
            const costData = costCalculator.calculate(weather, region);

            // Update marker color based on health score
            this.updateMarkerColor(marker, costData.healthScore);

            // Update info panel
            this.updateInfoPanel(region, weather, costData);

            // Hide loading
            this.hideLoading();

        } catch (error) {
            console.error('Error handling region click:', error);
            this.hideLoading();
            this.showError('Failed to fetch weather data for this region.');
        }
    }

    updateMarkerColor(marker, healthScore) {
        const healthColor = this.getHealthScoreColor(healthScore);
        marker.setStyle({
            fillColor: healthColor
        });
    }

    updateInfoPanel(region, weather, costData) {
        const panel = document.getElementById('info-panel');
        const emoji = weatherService.getWeatherEmoji(weather.condition);
        const healthEmoji = costCalculator.getHealthScoreEmoji(costData.healthScore);
        
        // Get temperature trend indicator
        const tempIndicator = weather.temperature > 25 ? '🔥' : weather.temperature < 10 ? '🧊' : '🌡️';
        const humidityIndicator = weather.humidity > 70 ? '💧' : weather.humidity < 40 ? '🏜️' : '💨';
        
        panel.innerHTML = `
            <div class="info-content">
                <h2>📍 ${region.displayName}</h2>
                
                <div class="weather-info">
                    <h3>${emoji} Current Weather</h3>
                    <div class="weather-details">
                        <div class="weather-detail">
                            <span>${tempIndicator} Temperature</span>
                            <strong>${weather.temperature}°C</strong>
                        </div>
                        <div class="weather-detail">
                            <span>${humidityIndicator} Humidity</span>
                            <strong>${weather.humidity}%</strong>
                        </div>
                        <div class="weather-detail">
                            <span>🌤️ Condition</span>
                            <strong>${weather.condition}</strong>
                        </div>
                        <div class="weather-detail">
                            <span>💨 Wind Speed</span>
                            <strong>${weather.windSpeed} m/s</strong>
                        </div>
                        <div class="weather-detail">
                            <span>👁️ Visibility</span>
                            <strong>${weather.visibility} km</strong>
                        </div>
                        <div class="weather-detail">
                            <span>📊 Pressure</span>
                            <strong>${weather.pressure} hPa</strong>
                        </div>
                    </div>
                </div>

                <div class="cost-info">
                    <h3>💰 Data Center Cost Impact</h3>
                    
                    <div class="cost-index" style="background: linear-gradient(135deg, ${this.getGradientColors(costData.healthScore)}); color: white;">
                        ${healthEmoji} ${costData.finalIndex}x Cost Multiplier
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                        <div style="text-align: center;">
                            <div style="font-size: 0.9rem; color: #64748b;">Health Score</div>
                            <div style="font-size: 1.2rem; font-weight: 600; text-transform: capitalize;">${costData.healthScore}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 0.9rem; color: #64748b;">Est. Monthly Cost</div>
                            <div style="font-size: 1.2rem; font-weight: 600;">$${costData.estimatedMonthlyCost}</div>
                        </div>
                    </div>
                    
                    <div class="cost-factors">
                        <div class="cost-factor">
                            <span>🌡️ Temperature Impact</span>
                            <strong style="color: ${costData.temperatureFactor > 1.1 ? '#ef4444' : '#10b981'}">${costData.temperatureFactor}x</strong>
                        </div>
                        <div class="cost-factor">
                            <span>💧 Humidity Impact</span>
                            <strong style="color: ${costData.humidityFactor > 1.1 ? '#ef4444' : '#10b981'}">${costData.humidityFactor}x</strong>
                        </div>
                        <div class="cost-factor">
                            <span>⚡ Electricity Cost</span>
                            <strong style="color: ${costData.electricityFactor > 1.1 ? '#ef4444' : '#10b981'}">${costData.electricityFactor}x</strong>
                        </div>
                        <div class="cost-factor">
                            <span>💨 Wind Cooling</span>
                            <strong style="color: ${costData.windFactor < 1 ? '#10b981' : '#64748b'}">${costData.windFactor}x</strong>
                        </div>
                    </div>
                    
                    <div class="explanation">
                        💡 ${costCalculator.getSimpleExplanation(costData.finalIndex)}
                    </div>
                </div>

                ${costData.factors.length > 0 ? `
                    <div class="factors-explanation">
                        <h4>🔍 Key Insights</h4>
                        <ul>
                            ${costData.factors.map(factor =>
                                `<li><strong>${factor.factor}:</strong> ${factor.description}</li>`
                            ).join('')}
                        </ul>
                    </div>
                ` : ''}

                <div class="region-info">
                    <h4>🏢 Region Details</h4>
                    <div class="cost-factor">
                        <span>⚡ Electricity Rate</span>
                        <strong>$${region.electricityPrice}/kWh</strong>
                    </div>
                    <div class="cost-factor">
                        <span>🕐 Timezone</span>
                        <strong>${region.timezone || 'N/A'}</strong>
                    </div>
                    <div class="cost-factor">
                        <span>🌍 Country</span>
                        <strong>${region.country || 'N/A'}</strong>
                    </div>
                </div>
            </div>
        `;
        
        // Add entrance animation
        panel.style.animation = 'slideUp 0.5s ease-out';
    }

    getGradientColors(healthScore) {
        const gradients = {
            'excellent': '#10b981, #059669',
            'good': '#f59e0b, #d97706',
            'fair': '#ef4444, #dc2626',
            'poor': '#dc2626, #b91c1c'
        };
        return gradients[healthScore] || '#64748b, #475569';
    }

    showLoading() {
        const overlay = document.getElementById('loading-overlay');
        overlay.classList.add('show');
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        overlay.classList.remove('show');
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        errorDiv.querySelector('p').textContent = message;
        errorDiv.classList.add('show');
    }
}

// Global function to hide error (called from HTML)
function hideError() {
    const errorDiv = document.getElementById('error-message');
    errorDiv.classList.remove('show');
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Cloudy with a Chance of Cost Overruns...');
    new CloudyCostApp();
});

// Handle API key configuration hint
document.addEventListener('DOMContentLoaded', () => {
    const subscriptionKey = weatherService.getSubscriptionKey();
    if (!subscriptionKey) {
        console.log(`
🔑 Azure Maps Configuration:
1. Sign up for Azure Maps at: https://portal.azure.com
2. Create an Azure Maps Account resource
3. Get your subscription key from Authentication > Primary Key
4. Set the key in js/weather-service.js (line ~19)
   
For now, the app will use realistic mock data for demonstration.
        `);
    }
});