# ☁️ Cloudy with a Chance of Cost Overruns

An interactive web application that visualizes how weather conditions impact Azure data center operational costs across regions.

## 🌟 What It Does

- **Interactive Map**: Click Azure region markers to see weather conditions and cost analysis
- **Health Status Colors**: Regions display green (optimal), orange (good), or red (high cost) based on current conditions
- **Real-time Calculations**: Weather data drives cost multiplier calculations considering temperature, humidity, electricity prices, and wind
- **Modern UI**: Glassmorphism design with smooth animations and responsive layout

## 🎯 Key Features

### **Enhanced Visual Experience**
- **Color-coded region markers** show health status at a glance
- **Modern glassmorphism design** with backdrop blur effects
- **Smooth animations** including ripple effects on region clicks
- **Responsive layout** that works on all devices
- **Fixed hover jitter** for smooth marker interactions

### **Azure Integration**
- **Real Azure subscription data** (ID: 52302246-2865-4ad9-855a-92f8f8565e14)
- **Azure Maps Weather API** integration with mock data fallback
- **15+ Azure regions** with real coordinates and electricity pricing
- **Environment variable configuration** for secure credential management

### **Intelligent Cost Analysis**
- **Temperature factor**: 5% cost increase per degree from optimal 20°C
- **Humidity penalty**: 20% efficiency loss above 60% humidity
- **Electricity pricing**: Real regional variations ($0.08-$0.32/kWh)
- **Wind cooling bonus**: 5% cost reduction for high wind speeds

## 🧮 Cost Calculation Formulas

### **Master Formula**
```
Final Cost Index = Temperature Factor × Humidity Factor × Electricity Factor × Wind Factor
```

### **Individual Factor Calculations**

#### **1. Temperature Factor**
```
Temperature Delta = |Current Temperature - Ideal Temperature|
Temperature Factor = 1 + (Temperature Delta × 0.05)

Where:
- Ideal Temperature = 20°C
- Sensitivity = 0.05 (5% per degree)

Example:
- Singapore: |32°C - 20°C| = 12°C
- Temperature Factor = 1 + (12 × 0.05) = 1.60x
```

#### **2. Humidity Factor**
```
If Humidity > 60%:
    Humidity Factor = 1.2
Else:
    Humidity Factor = 1.0

Example:
- Mumbai: 90% humidity → 1.2x (20% penalty)
- Phoenix: 35% humidity → 1.0x (no penalty)
```

#### **3. Electricity Factor**
```
Electricity Factor = Regional Price / Baseline Price

Where:
- Baseline Price = $0.10/kWh
- Regional Price = actual regional electricity cost

Example:
- Sweden: $0.32/kWh → 0.32/0.10 = 3.2x
- India: $0.08/kWh → 0.08/0.10 = 0.8x
```

#### **4. Wind Factor**
```
If Wind Speed > 10 m/s:
    Wind Factor = 0.95
Else:
    Wind Factor = 1.0

Example:
- Coastal region: 12 m/s wind → 0.95x (5% cooling benefit)
- Inland region: 3 m/s wind → 1.0x (no benefit)
```

### **Health Score Classification**
```
If Final Cost Index < 1.2:  Health Score = "excellent"
If Final Cost Index < 1.5:  Health Score = "good"
If Final Cost Index < 1.8:  Health Score = "fair"
Else:                       Health Score = "poor"
```

### **Monthly Cost Estimation**
```
Estimated Monthly Cost = Base Server Cost × Final Cost Index

Where:
- Base Server Cost = $100/month (baseline)

Example:
- Singapore: $100 × 1.8 = $180/month
- Dublin: $100 × 1.1 = $110/month
```

### **Real-World Calculation Examples**

#### **Singapore (Southeast Asia)**
```
Temperature: 32°C → |32-20| × 0.05 = 0.60 → 1.60x
Humidity: 85% → > 60% → 1.20x
Electricity: $0.15/kWh → 0.15/0.10 = 1.50x
Wind: 8 m/s → < 10 m/s → 1.00x

Final Index = 1.60 × 1.20 × 1.50 × 1.00 = 2.88x
Health Score = "poor" (> 1.8)
Monthly Cost = $100 × 2.88 = $288
```

#### **Dublin (North Europe)**
```
Temperature: 15°C → |15-20| × 0.05 = 0.25 → 1.25x
Humidity: 75% → > 60% → 1.20x
Electricity: $0.22/kWh → 0.22/0.10 = 2.20x
Wind: 12 m/s → > 10 m/s → 0.95x

Final Index = 1.25 × 1.20 × 2.20 × 0.95 = 3.12x
Health Score = "poor" (> 1.8)
Monthly Cost = $100 × 3.12 = $312
```

#### **Virginia (East US)**
```
Temperature: 22°C → |22-20| × 0.05 = 0.10 → 1.10x
Humidity: 65% → > 60% → 1.20x
Electricity: $0.12/kWh → 0.12/0.10 = 1.20x
Wind: 6 m/s → < 10 m/s → 1.00x

Final Index = 1.10 × 1.20 × 1.20 × 1.00 = 1.58x
Health Score = "fair" (1.5-1.8)
Monthly Cost = $100 × 1.58 = $158
```

## 🔧 Technical Stack

- **Frontend**: Vanilla JavaScript ES6+, Modern CSS with custom properties
- **Mapping**: Leaflet.js with OpenStreetMap tiles
- **Weather**: Azure Maps Weather Service + realistic mock data
- **Deployment**: Azure Static Web Apps ready
- **Security**: Environment variables with .gitignore protection

## 📁 Project Structure

```
cloudy-cost-overruns/
├── 📄 index.html                    # Main application
├── 📄 test.html                     # Quick functionality test
├── 📄 .env                          # Environment variables (Azure subscription)
├── 📄 .gitignore                    # Security for credentials
│
├── 📁 css/
│   └── 🎨 main.css                  # Modern glassmorphism styling
│
├── 📁 js/
│   ├── 🌤️ weather-service.js        # Azure Maps weather integration
│   ├── 🏢 azure-regions-service.js  # Azure Management API integration
│   ├── 💰 cost-calculator.js        # Cost calculation engine
│   └── 🎮 app.js                    # Main application logic
│
├── 📁 data/
│   ├── 🌍 azure-regions.json        # Legacy region data
│   └── 🔧 az.json                   # Azure Management API format data
│
└── 📁 docs/
    ├── 📋 api-specs.md              # API documentation
    └── 🚀 deployment-guide.md       # Azure deployment steps
```

## 🎨 Visual Features

### **Health Score Color System**
- 🟢 **Green (#10b981)**: Excellent conditions (1.0-1.2x cost)
- 🟡 **Orange (#f59e0b)**: Good conditions (1.2-1.5x cost)
- 🔴 **Red (#ef4444)**: Fair conditions (1.5-1.8x cost)
- 🔴 **Dark Red (#dc2626)**: Poor conditions (1.8x+ cost)

### **Modern UI Elements**
- **Backdrop blur effects** for glassmorphism panels
- **Gradient backgrounds** and smooth transitions
- **Interactive hover states** with scale transforms
- **Ripple animations** on region clicks
- **Staggered loading** with marker animations

## 🚀 Quick Start

### **Local Development**
```bash
# Start local server
python -m http.server 8000

# Open browser
http://localhost:8000
```

### **Azure Deployment**
1. Fork repository on GitHub
2. Create Azure Static Web App
3. Connect to GitHub repository
4. Automatic deployment via GitHub Actions

## 🔧 Configuration

### **Environment Variables (.env)**
```bash
AZURE_SUBSCRIPTION_ID=52302246-2865-4ad9-855a-92f8f8565e14
AZURE_MAPS_SUBSCRIPTION_KEY=your-key-here  # Optional for live weather
```

### **Azure Management API Integration**
The app can fetch live region data from:
```
GET https://management.azure.com/subscriptions/{subscriptionId}/locations?api-version=2022-12-01
```

## 📊 Sample Data Points

### **Regional Cost Variations**
- **South India**: $0.08/kWh electricity, 35°C temperature → High cooling costs
- **North Europe**: $0.22/kWh electricity, 15°C temperature → Lower cooling costs
- **West US**: $0.18/kWh electricity, 25°C temperature → Moderate costs

### **Weather Impact Examples**
- **Singapore**: High humidity (85%) + heat (32°C) = 1.8x cost multiplier
- **Dublin**: Moderate conditions (15°C, 75% humidity) = 1.1x cost multiplier
- **Virginia**: Optimal conditions (22°C, 65% humidity) = 1.0x cost multiplier

## 🎯 Use Cases

- **Azure region selection** for new deployments
- **Cost optimization** analysis for existing workloads
- **Educational tool** for cloud architecture concepts
- **Research platform** for weather-infrastructure relationships

## 🛠️ Development Features

- **Error resilience** with multiple fallback levels
- **Performance optimization** with 15-minute weather caching
- **TypeScript-ready** modern JavaScript patterns
- **Accessibility features** with proper focus states
- **Mobile optimization** with responsive breakpoints

---

*An Azure Bootcamp capstone project demonstrating modern web development, cloud integration, and data visualization techniques.*