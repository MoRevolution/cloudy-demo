/**
 * Azure Regions Service
 * Handles fetching Azure regions from Management API or fallback to static data
 */
class AzureRegionsService {
    constructor() {
        this.subscriptionId = this.getSubscriptionId();
        this.accessToken = this.getAccessToken();
        this.cache = new Map();
        this.cacheTimeout = 60 * 60 * 1000; // 1 hour
        
        // Electricity pricing data for regions (approximate values in USD/kWh)
        this.electricityPricing = {
            'eastus': 0.12,
            'eastus2': 0.12,
            'westus': 0.18,
            'westus2': 0.16,
            'westus3': 0.16,
            'centralus': 0.11,
            'southcentralus': 0.10,
            'northcentralus': 0.11,
            'northeurope': 0.22,    
            'westeurope': 0.25,
            'uksouth': 0.26,
            'ukwest': 0.26,
            'francecentral': 0.24,
            'germanywestcentral': 0.28,
            'norwayeast': 0.30,
            'swedencentral': 0.32,
            'eastasia': 0.14,
            'southeastasia': 0.15,
            'japaneast': 0.24,
            'japanwest': 0.24,
            'australiaeast': 0.28,
            'australiasoutheast': 0.28,
            'australiacentral': 0.28,
            'koreacentral': 0.19,
            'koreasouth': 0.19,
            'canadacentral': 0.11,
            'canadaeast': 0.11,
            'brazilsouth': 0.16,
            'southindia': 0.08,
            'centralindia': 0.08,
            'westindia': 0.08,
            'southafricanorth': 0.14,
            'uaenorth': 0.20
        };
    }

    getSubscriptionId() {
        // Try to get from environment variables or fallback
        if (typeof process !== 'undefined' && process.env) {
            return process.env.AZURE_SUBSCRIPTION_ID;
        }
        
        // For browser environments, try to get from a global config
        if (typeof window !== 'undefined' && window.azureConfig) {
            return window.azureConfig.subscriptionId;
        }
        
        // Fallback to the subscription ID from .env
        return '52302246-2865-4ad9-855a-92f8f8565e14';
    }

    getAccessToken() {
        // In a real application, this would come from Azure authentication
        // For demo purposes, we'll simulate this
        if (typeof process !== 'undefined' && process.env) {
            return process.env.AZURE_ACCESS_TOKEN;
        }
        
        console.log('ℹ️ Azure access token not configured. Using static region data.');
        return null;
    }

    async getRegions() {
        const cacheKey = 'azure_regions';
        const cached = this.cache.get(cacheKey);
        
        // Return cached data if available and not expired
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            console.log('📋 Using cached Azure regions data');
            return cached.data;
        }

        // Try to fetch from Azure Management API if credentials are available
        if (this.subscriptionId && this.accessToken) {
            try {
                const liveRegions = await this.fetchLiveRegions();
                const processedRegions = this.processLiveRegions(liveRegions);
                
                this.cache.set(cacheKey, {
                    data: processedRegions,
                    timestamp: Date.now()
                });
                
                console.log(`✅ Loaded ${processedRegions.length} regions from Azure Management API`);
                return processedRegions;
            } catch (error) {
                console.error('Failed to fetch from Azure Management API:', error);
                console.log('📁 Falling back to static region data');
            }
        }

        // Fallback to static data from az.json
        try {
            const staticRegions = await this.loadStaticRegions();
            console.log(`📁 Loaded ${staticRegions.length} regions from static data`);
            return staticRegions;
        } catch (error) {
            console.error('Failed to load static regions:', error);
            return this.getMinimalFallbackRegions();
        }
    }

    async fetchLiveRegions() {
        const url = `https://management.azure.com/subscriptions/${this.subscriptionId}/locations?api-version=2022-12-01`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }

    processLiveRegions(apiResponse) {
        return apiResponse.value
            .filter(region => region.metadata && region.metadata.regionType === 'Physical')
            .map(region => ({
                id: region.name,
                name: region.name,
                displayName: region.displayName,
                regionalDisplayName: region.regionalDisplayName || region.displayName,
                coordinates: {
                    latitude: parseFloat(region.metadata.latitude),
                    longitude: parseFloat(region.metadata.longitude)
                },
                physicalLocation: region.metadata.physicalLocation,
                geography: region.metadata.geography,
                electricityPrice: this.electricityPricing[region.name] || 0.15,
                timezone: this.getTimezoneForRegion(region.name),
                country: this.getCountryForRegion(region.metadata.geography)
            }))
            .filter(region => !isNaN(region.coordinates.latitude) && !isNaN(region.coordinates.longitude));
    }

    async loadStaticRegions() {
        const response = await fetch('data/az.json');
        if (!response.ok) {
            throw new Error(`Failed to load static regions: ${response.status}`);
        }
        
        const data = await response.json();
        return this.processLiveRegions(data); // Same processing logic
    }

    getMinimalFallbackRegions() {
        // Ultra-minimal fallback if everything else fails
        return [
            {
                id: "eastus",
                name: "eastus",
                displayName: "East US",
                regionalDisplayName: "(US) East US",
                coordinates: { latitude: 37.3719, longitude: -78.8964 },
                physicalLocation: "Virginia",
                geography: "United States",
                electricityPrice: 0.12,
                timezone: "America/New_York",
                country: "United States"
            },
            {
                id: "westeurope",
                name: "westeurope",
                displayName: "West Europe",
                regionalDisplayName: "(Europe) West Europe",
                coordinates: { latitude: 52.3667, longitude: 4.9 },
                physicalLocation: "Netherlands",
                geography: "Europe",
                electricityPrice: 0.25,
                timezone: "Europe/Amsterdam",
                country: "Netherlands"
            },
            {
                id: "southeastasia",
                name: "southeastasia",
                displayName: "Southeast Asia",
                regionalDisplayName: "(Asia Pacific) Southeast Asia",
                coordinates: { latitude: 1.283, longitude: 103.833 },
                physicalLocation: "Singapore",
                geography: "Asia Pacific",
                electricityPrice: 0.15,
                timezone: "Asia/Singapore",
                country: "Singapore"
            }
        ];
    }

    getTimezoneForRegion(regionName) {
        const timezoneMap = {
            'eastus': 'America/New_York',
            'eastus2': 'America/New_York',
            'westus': 'America/Los_Angeles',
            'westus2': 'America/Los_Angeles',
            'westus3': 'America/Los_Angeles',
            'centralus': 'America/Chicago',
            'southcentralus': 'America/Chicago',
            'northcentralus': 'America/Chicago',
            'canadacentral': 'America/Toronto',
            'canadaeast': 'America/Halifax',
            'brazilsouth': 'America/Sao_Paulo',
            'northeurope': 'Europe/Dublin',
            'westeurope': 'Europe/Amsterdam',
            'uksouth': 'Europe/London',
            'ukwest': 'Europe/London',
            'francecentral': 'Europe/Paris',
            'germanywestcentral': 'Europe/Berlin',
            'norwayeast': 'Europe/Oslo',
            'swedencentral': 'Europe/Stockholm',
            'eastasia': 'Asia/Hong_Kong',
            'southeastasia': 'Asia/Singapore',
            'japaneast': 'Asia/Tokyo',
            'japanwest': 'Asia/Tokyo',
            'australiaeast': 'Australia/Sydney',
            'australiasoutheast': 'Australia/Melbourne',
            'australiacentral': 'Australia/Sydney',
            'southindia': 'Asia/Kolkata',
            'centralindia': 'Asia/Kolkata',
            'westindia': 'Asia/Kolkata',
            'koreacentral': 'Asia/Seoul',
            'koreasouth': 'Asia/Seoul',
            'southafricanorth': 'Africa/Johannesburg',
            'uaenorth': 'Asia/Dubai'
        };
        return timezoneMap[regionName] || 'UTC';
    }

    getCountryForRegion(geography) {
        const countryMap = {
            'United States': 'United States',
            'Canada': 'Canada',
            'Brazil': 'Brazil',
            'Europe': 'Europe',
            'United Kingdom': 'United Kingdom',
            'France': 'France',
            'Germany': 'Germany',
            'Norway': 'Norway',
            'Sweden': 'Sweden',
            'Asia Pacific': 'Asia Pacific',
            'Japan': 'Japan',
            'Australia': 'Australia',
            'India': 'India',
            'Korea': 'South Korea',
            'South Africa': 'South Africa',
            'UAE': 'United Arab Emirates'
        };
        return countryMap[geography] || geography;
    }
}

// Global Azure regions service instance
const azureRegionsService = new AzureRegionsService();