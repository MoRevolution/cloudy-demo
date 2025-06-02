# 🚀 Deployment Guide
## Cloudy with a Chance of Cost Overruns

This guide provides step-by-step instructions for deploying the application to Azure Static Web Apps.

---

## 📋 Prerequisites

### Required Accounts & Tools
- **Azure Account** with active subscription
- **GitHub Account** for source code hosting
- **Azure Maps Account** for weather API access
- **Azure CLI** (optional but recommended)

### Development Environment
- **Git** for version control
- **VS Code** (recommended) with Azure extensions
- **Node.js** (optional, for local testing)

---

## 🔧 Initial Setup

### 1. Get Azure Maps Subscription Key

1. Sign in to [Azure Portal](https://portal.azure.com)
2. Create a new **Azure Maps Account** resource
3. Configure the resource:
   - **Subscription**: Your Azure subscription
   - **Resource Group**: Create new or use existing
   - **Name**: `azure-maps-cloudy-cost-overruns`
   - **Pricing Tier**: S0 (Gen1) or S1 (Gen2)
4. Navigate to **Authentication** → **Primary Key**
5. Copy your subscription key (keep this secure!)

**Pricing tiers:**
- **S0**: 1,000 QPS, pay-per-transaction pricing
- **S1**: Unlimited QPS, pay-per-transaction pricing
- Perfect for development and production usage

### 2. Fork/Clone Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/cloudy-cost-overruns.git
cd cloudy-cost-overruns

# Or fork on GitHub and clone your fork
```

### 3. Local Testing (Optional)

```bash
# Simple HTTP server
python -m http.server 8000

# Or with Node.js
npx live-server

# Or with VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Visit `http://localhost:8000` to test locally.

---

## ☁️ Azure Deployment

### Method 1: Azure Portal (Recommended for Beginners)

#### Step 1: Create Static Web App

1. Login to [Azure Portal](https://portal.azure.com)
2. Click **Create a resource**
3. Search for **Static Web App**
4. Click **Create**

#### Step 2: Configure Basic Settings

```
Subscription: [Your subscription]
Resource Group: [Create new] rg-cloudy-cost-overruns
Name: cloudy-cost-overruns
Plan Type: Free
Region: East US 2 (or closest to your users)
```

#### Step 3: Configure GitHub Integration

```
Source: GitHub
GitHub Account: [Your GitHub account]
Organization: [Your username/organization]
Repository: cloudy-cost-overruns
Branch: main
```

#### Step 4: Build Configuration

```
Build Presets: Custom
App location: /
Api location: [leave empty]
Output location: /
```

#### Step 5: Review and Create

- Review all settings
- Click **Create**
- Wait for deployment to complete (5-10 minutes)

### Method 2: Azure CLI (Recommended for Advanced Users)

```bash
# Login to Azure
az login

# Create resource group
az group create \
  --name rg-cloudy-cost-overruns \
  --location eastus2

# Create Static Web App
az staticwebapp create \
  --name cloudy-cost-overruns \
  --resource-group rg-cloudy-cost-overruns \
  --source https://github.com/yourusername/cloudy-cost-overruns \
  --location eastus2 \
  --branch main \
  --app-location "/" \
  --api-location "" \
  --output-location "/"

# Get deployment URL
az staticwebapp show \
  --name cloudy-cost-overruns \
  --resource-group rg-cloudy-cost-overruns \
  --query "defaultHostname" \
  --output tsv
```

---

## 🔐 Environment Configuration

### Configure API Keys in Azure Portal

1. Navigate to your Static Web App in Azure Portal
2. Go to **Configuration** in the left menu
3. Click **Application settings**
4. Add the following environment variables:

| Name | Value | Description |
|------|-------|-------------|
| `AZURE_MAPS_SUBSCRIPTION_KEY` | `your_azure_maps_subscription_key` | Your Azure Maps subscription key |
| `AZURE_MAPS_WEATHER_URL` | `https://atlas.microsoft.com/weather` | Azure Maps Weather API base URL |

### Configure via Azure CLI

```bash
# Set environment variables
az staticwebapp appsettings set \
  --name cloudy-cost-overruns \
  --resource-group rg-cloudy-cost-overruns \
  --setting-names \
    AZURE_MAPS_SUBSCRIPTION_KEY=your_azure_maps_subscription_key \
    AZURE_MAPS_WEATHER_URL=https://atlas.microsoft.com/weather
```

---

## 📁 File Structure for Deployment

Ensure your repository has this structure:

```
cloudy-cost-overruns/
├── index.html                    # Entry point
├── css/
│   ├── main.css
│   ├── map.css
│   └── components.css
├── js/
│   ├── app.js
│   ├── weather-service.js
│   ├── cost-calculator.js
│   ├── map-handler.js
│   └── ui-components.js
├── data/
│   ├── azure-regions.json
│   ├── electricity-pricing.json
│   └── cost-formulas.json
├── assets/
│   └── icons/
├── staticwebapp.config.json      # Azure Static Web Apps config
└── README.md
```

### Azure Static Web Apps Configuration

Create [`staticwebapp.config.json`](../staticwebapp.config.json):

```json
{
  "routes": [
    {
      "route": "/data/*",
      "headers": {
        "Cache-Control": "public, max-age=3600"
      }
    },
    {
      "route": "/assets/*",
      "headers": {
        "Cache-Control": "public, max-age=86400"
      }
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/**", "/data/**", "*.{css,scss,sass,js,ts,json,ico,png,jpg,jpeg,gif,svg}"]
  },
  "mimeTypes": {
    ".json": "application/json"
  },
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block"
  }
}
```

---

## 🌐 Custom Domain Setup (Optional)

### Via Azure Portal

1. Navigate to your Static Web App
2. Go to **Custom domains**
3. Click **Add**
4. Enter your domain name
5. Follow DNS verification steps

### Via Azure CLI

```bash
# Add custom domain
az staticwebapp hostname set \
  --name cloudy-cost-overruns \
  --resource-group rg-cloudy-cost-overruns \
  --hostname yourdomain.com

# Verify domain
az staticwebapp hostname show \
  --name cloudy-cost-overruns \
  --resource-group rg-cloudy-cost-overruns \
  --hostname yourdomain.com
```

### DNS Configuration

Add these DNS records to your domain:

```
Type: CNAME
Name: www (or your subdomain)
Value: [your-static-web-app].azurestaticapps.net

Type: TXT
Name: asuid.yourdomain.com
Value: [verification-id-from-azure]
```

---

## 📊 Monitoring & Analytics

### Application Insights Integration

```bash
# Create Application Insights resource
az monitor app-insights component create \
  --app cloudy-cost-overruns \
  --location eastus2 \
  --resource-group rg-cloudy-cost-overruns \
  --application-type web

# Get instrumentation key
az monitor app-insights component show \
  --app cloudy-cost-overruns \
  --resource-group rg-cloudy-cost-overruns \
  --query "instrumentationKey" \
  --output tsv
```

Add to your HTML:

```html
<!-- Application Insights -->
<script type="text/javascript">
var appInsights=window.appInsights||function(a){
  function b(a){c[a]=function(){var b=arguments;c.queue.push(function(){c[a].apply(c,b)})}}var c={config:a},d=document,e=window;setTimeout(function(){var b=d.createElement("script");b.src=a.url||"https://az416426.vo.msecnd.net/scripts/a/ai.0.js",d.getElementsByTagName("script")[0].parentNode.appendChild(b)});try{c.cookie=d.cookie}catch(a){}c.queue=[];for(var f=["Event","Exception","Metric","PageView","Trace","Dependency"];f.length;)b("track"+f.pop());if(b("setAuthenticatedUserContext"),b("clearAuthenticatedUserContext"),b("startTrackEvent"),b("stopTrackEvent"),b("startTrackPage"),b("stopTrackPage"),b("flush"),!a.disableExceptionTracking){f="onerror",b("_"+f);var g=e[f];e[f]=function(a,b,d,e,h){var i=g&&g(a,b,d,e,h);return!0!==i&&c["_"+f](a,b,d,e,h),i}}return c
}({
    instrumentationKey: "YOUR_INSTRUMENTATION_KEY"
});
window.appInsights=appInsights,appInsights.queue&&0===appInsights.queue.length&&appInsights.trackPageView();
</script>
```

---

## 🔄 CI/CD Pipeline

Azure Static Web Apps automatically creates a GitHub Actions workflow:

### Generated Workflow (`.github/workflows/azure-static-web-apps-*.yml`)

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: "/"

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

---

## 🧪 Testing Deployment

### Health Check Checklist

After deployment, verify these items:

- [ ] **Site loads**: Visit your Azure Static Web Apps URL
- [ ] **Map displays**: Interactive map with region markers
- [ ] **Weather data**: Click regions to fetch weather
- [ ] **Cost calculations**: Verify cost estimates display
- [ ] **Responsive design**: Test on mobile devices
- [ ] **Environment variables**: Check API integration works
- [ ] **Custom domain**: If configured, verify domain works
- [ ] **HTTPS**: Ensure site loads over HTTPS

### Manual Testing Script

```bash
#!/bin/bash
# test-deployment.sh

SITE_URL="https://your-site.azurestaticapps.net"

echo "Testing deployment at $SITE_URL"

# Test site accessibility
curl -I $SITE_URL
if [ $? -eq 0 ]; then
    echo "✅ Site is accessible"
else
    echo "❌ Site is not accessible"
fi

# Test static assets
curl -I $SITE_URL/css/main.css
curl -I $SITE_URL/js/app.js
curl -I $SITE_URL/data/azure-regions.json

echo "Manual testing required:"
echo "1. Open $SITE_URL in browser"
echo "2. Click on region markers"
echo "3. Verify weather data loads"
echo "4. Check cost calculations display"
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Weather API Not Working

**Symptoms**: No weather data loads, console errors about API calls

**Solutions**:
```bash
# Check environment variables
az staticwebapp appsettings list \
  --name cloudy-cost-overruns \
  --resource-group rg-cloudy-cost-overruns

# Verify API key is valid
curl "https://api.openweathermap.org/data/2.5/weather?lat=37.3719&lon=-78.8964&appid=YOUR_API_KEY"
```

#### 2. Site Not Loading

**Symptoms**: 404 errors, blank page

**Solutions**:
- Check `staticwebapp.config.json` syntax
- Verify `index.html` exists in root directory
- Check GitHub Actions workflow status

#### 3. Custom Domain Issues

**Symptoms**: Domain not resolving, certificate errors

**Solutions**:
```bash
# Check DNS propagation
nslookup yourdomain.com

# Verify TXT record
dig TXT asuid.yourdomain.com

# Check SSL certificate
openssl s_client -connect yourdomain.com:443
```

### Debugging Commands

```bash
# Check deployment status
az staticwebapp show \
  --name cloudy-cost-overruns \
  --resource-group rg-cloudy-cost-overruns

# View deployment logs
az staticwebapp functions show \
  --name cloudy-cost-overruns \
  --resource-group rg-cloudy-cost-overruns

# Reset deployment token
az staticwebapp secrets reset-api-key \
  --name cloudy-cost-overruns \
  --resource-group rg-cloudy-cost-overruns
```

---

## 💰 Cost Management

### Azure Static Web Apps Pricing

- **Free Tier**: 
  - 100 GB bandwidth/month
  - 0.5 GB storage
  - Perfect for this project

- **Standard Tier** ($9/month):
  - 100 GB bandwidth + $0.20/GB overage
  - 0.5 GB storage + $0.40/GB overage
  - Custom authentication

### Cost Optimization Tips

1. **Optimize Assets**: Minify CSS/JS files
2. **Use CDN**: Configure Azure CDN for global distribution
3. **Monitor Usage**: Set up billing alerts
4. **Clean Up**: Delete unused resources

```bash
# Set up billing alert
az consumption budget create \
  --account-id /subscriptions/YOUR_SUBSCRIPTION_ID \
  --budget-name cloudy-cost-overruns-budget \
  --amount 10 \
  --category Cost \
  --time-grain Monthly \
  --start-date 2025-01-01 \
  --end-date 2025-12-31
```

---

## 📚 Additional Resources

### Azure Documentation
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure CLI Reference](https://docs.microsoft.com/en-us/cli/azure/staticwebapp)
- [GitHub Actions for Azure](https://docs.microsoft.com/en-us/azure/developer/github/github-actions)

### Weather API Documentation
- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [API Error Codes](https://openweathermap.org/faq#error401)

### Monitoring & Analytics
- [Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
- [Azure Monitor](https://docs.microsoft.com/en-us/azure/azure-monitor/)

This deployment guide provides comprehensive instructions for getting your Cloudy with a Chance of Cost Overruns application running on Azure Static Web Apps.