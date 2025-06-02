# 🚀 Quick Setup Guide
## Cloudy with a Chance of Cost Overruns

This guide will get you up and running with the modernized, minimal, and fun-to-use version of the app in just a few minutes!

### ✨ What's New in the Modern UI
- **Beautiful glassmorphism design** with backdrop blur effects
- **Smooth animations** and interactive ripple effects when clicking regions
- **Modern typography** using Inter font
- **Enhanced visual indicators** with emojis and color-coded health scores
- **Responsive grid layout** that works perfectly on all devices
- **Gradient backgrounds** and subtle hover effects for a premium feel

## 📋 What You'll Need

1. **Azure account** (free tier works fine)
2. **Web browser** 
3. **Local web server** (optional for testing)

## 🏃‍♂️ Quick Start (2 minutes)

### Option 1: Test Locally (Recommended)

1. **Clone or download** this repository
2. **Open a terminal** in the project folder
3. **Start a local server**:

```bash
# Python (most common)
python -m http.server 8000

# Or if you have Node.js
npx live-server

# Or if you use VS Code
# Right-click index.html → "Open with Live Server"
```

4. **Open your browser** to `http://localhost:8000`
5. **Click on any region marker** to see weather data and cost estimates!

> **Note**: The app now uses real Azure subscription data from the .env file and realistic mock weather data. To use live Azure Maps weather data, see the "Real Weather Data" section below.

### Option 2: Deploy to Azure (5 minutes)

1. **Fork this repository** on GitHub
2. **Sign in to Azure Portal**: https://portal.azure.com
3. **Create a Static Web App**:
   - Search for "Static Web App" 
   - Click "Create"
   - Connect to your GitHub repository
   - Set build settings:
     - App location: `/`
     - API location: *(leave empty)*
     - Output location: `/`
4. **Wait for deployment** (3-5 minutes)
5. **Visit your deployed app** using the provided URL

## 🌤️ Enable Real Weather Data (Optional)

To use live Azure Maps weather data instead of mock data:

1. **Create Azure Maps Account**:
   - In Azure Portal, create "Azure Maps Account" resource
   - Choose S0 pricing tier (pay-per-use)
   - Go to Authentication → copy Primary Key

2. **Configure the key**:
   - **For local testing**: Edit `js/weather-service.js` line 19
   - **For Azure deployment**: Add environment variable `AZURE_MAPS_SUBSCRIPTION_KEY`

3. **Set environment variable in Azure**:
   - Go to your Static Web App in Azure Portal
   - Click "Configuration" → "Application settings"
   - Add: `AZURE_MAPS_SUBSCRIPTION_KEY` = `your_key_here`

## 🎯 Features You Can Try

- **🗺️ Interactive Map**: Click different Azure regions
- **🌡️ Weather Data**: See current conditions
- **💰 Cost Analysis**: Understand weather impact on data center costs
- **📱 Responsive Design**: Works on mobile and desktop
- **🎨 Visual Indicators**: Color-coded health scores

## 🧪 Sample Regions to Try

- **East US (Virginia)**: Moderate costs, temperate climate
- **West Europe (Netherlands)**: Higher electricity costs
- **Southeast Asia (Singapore)**: High humidity challenges
- **Australia East (Sydney)**: Variable conditions
- **South India (Chennai)**: Hot climate, lower electricity costs

## 📊 Understanding the Cost Calculation

The app calculates a simple "cost index" based on:

- **Temperature**: Deviation from ideal 20°C increases cooling costs
- **Humidity**: High humidity (>60%) reduces cooling efficiency  
- **Electricity Price**: Regional power costs affect operations
- **Wind Speed**: High wind can help with natural cooling

**Health Scores**:
- 🟢 **Excellent** (< 1.2x): Optimal conditions
- 🟡 **Good** (1.2-1.5x): Minor cost impact
- 🟠 **Fair** (1.5-1.8x): Moderate cost impact  
- 🔴 **Poor** (> 1.8x): Significant cost impact

## 🐛 Troubleshooting

**Map not loading?**
- Check console for JavaScript errors
- Ensure you have internet connection for map tiles

**No weather data?**
- Normal! App uses mock data by default
- Configure Azure Maps key for real data

**Styling looks wrong?**
- Clear browser cache
- Check that CSS files are loading

**Deployment issues?**
- Verify GitHub integration in Azure
- Check GitHub Actions workflow status

## 🔧 Customization Ideas

**Easy modifications**:
- Add more Azure regions in `data/azure-regions.json`
- Adjust cost formulas in `js/cost-calculator.js`
- Modify colors/styling in `css/main.css`
- Change mock weather data in `js/weather-service.js`

**Advanced features** (for later):
- Historical weather trends
- Carbon footprint calculations
- Integration with Azure pricing APIs
- User preferences and favorites

## 📚 Next Steps

1. **Explore the documentation** in the `docs/` folder
2. **Read the architecture** in `architecture.md`
3. **Check deployment guide** in `docs/deployment-guide.md`
4. **Review API specs** in `docs/api-specs.md`

## 🎉 You're Ready!

The app emphasizes simplicity and educational value. It's designed to be a fun way to learn about:

- Cloud infrastructure considerations
- Weather impact on data centers
- Azure regions and their characteristics
- Basic web development with APIs

Have fun exploring the relationship between weather and cloud costs! ☁️💰

---

*Questions? Check the main README.md or the docs/ folder for detailed information.*