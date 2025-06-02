# 📁 Project Structure
## Cloudy with a Chance of Cost Overruns

```
cloudy-cost-overruns/
├── 📄 index.html                    # Main application page
├── 📄 test.html                     # Quick functionality test page
├── 📄 SETUP.md                      # Quick start guide
├── 📄 README.md                     # Comprehensive project documentation
├── 📄 PROJECT_STRUCTURE.md          # This file
├── 📄 architecture.md               # System architecture documentation
├── 📄 staticwebapp.config.json      # Azure Static Web Apps configuration
│
├── 📁 css/
│   └── 🎨 main.css                  # All application styles
│
├── 📁 js/
│   ├── 🌤️ weather-service.js        # Azure Maps weather integration
│   ├── 💰 cost-calculator.js        # Cost calculation logic
│   └── 🎮 app.js                    # Main application controller
│
├── 📁 data/
│   └── 🌍 azure-regions.json        # Azure regions metadata
│
└── 📁 docs/
    ├── 🏗️ architecture.md           # Detailed system architecture
    ├── 📋 api-specs.md              # API specifications and examples
    └── 🚀 deployment-guide.md       # Step-by-step deployment guide
```

## 🔧 Core Files Explained

### **🎯 Entry Points**
- **`index.html`** - Main application interface
- **`test.html`** - Quick functionality testing
- **`SETUP.md`** - 2-minute getting started guide

### **🎨 Styling**
- **`css/main.css`** - Complete responsive styling
  - Modern CSS Grid/Flexbox layout
  - Interactive map styling
  - Weather and cost display components
  - Mobile-responsive design
  - Loading and error states

### **⚙️ JavaScript Modules**

#### **`js/weather-service.js`**
- Azure Maps Weather API integration
- Intelligent fallback to mock data
- 15-minute caching for performance
- Weather condition mapping and emojis
- Error handling and retry logic

#### **`js/cost-calculator.js`**
- Data center cost estimation algorithm
- Factors: temperature, humidity, electricity, wind
- Health score classification (excellent → poor)
- Cost factor explanations
- Visual indicators for UI

#### **`js/app.js`**
- Main application orchestration
- Leaflet.js map initialization
- Interactive region markers
- Event handling (clicks, hovers)
- UI updates and information panels
- Loading states and error management

### **📊 Data**

#### **`data/azure-regions.json`**
- 12 major Azure regions with coordinates
- Electricity pricing data
- Timezone and geographic metadata
- Easily extensible for new regions

### **📚 Documentation**

#### **`docs/architecture.md`**
- Complete system architecture
- Component diagrams (Mermaid)
- Technical stack details
- Performance and security considerations
- Future enhancement roadmap

#### **`docs/api-specs.md`**
- Azure Maps Weather API integration
- Data structure definitions
- Error handling specifications
- Code examples and implementations
- Performance optimization strategies

#### **`docs/deployment-guide.md`**
- Azure Maps account setup
- Azure Static Web Apps deployment
- Environment variable configuration
- Custom domain setup
- Monitoring and troubleshooting

### **⚙️ Configuration**
- **`staticwebapp.config.json`** - Azure hosting configuration
  - Routing rules
  - Cache headers
  - Security headers
  - MIME type mappings

## 🌟 Key Features Implemented

### **📱 User Interface**
- ✅ Interactive world map with Azure region markers
- ✅ Click-to-explore region weather and costs
- ✅ Real-time weather condition display
- ✅ Cost impact visualization with color coding
- ✅ Mobile-responsive design
- ✅ Loading states and error handling

### **🌤️ Weather Integration**
- ✅ Azure Maps Weather API support
- ✅ Intelligent mock data fallback
- ✅ Weather condition classification
- ✅ Emoji and visual indicators
- ✅ Caching for performance

### **💰 Cost Analysis**
- ✅ Educational cost calculation model
- ✅ Temperature deviation impact
- ✅ Humidity cooling efficiency factor
- ✅ Regional electricity pricing
- ✅ Wind cooling benefits
- ✅ Health score classification (🟢🟡🟠🔴)

### **🛠️ Developer Experience**
- ✅ Modular, maintainable code structure
- ✅ Comprehensive documentation
- ✅ Easy local development setup
- ✅ Azure deployment ready
- ✅ Test page for verification
- ✅ Error handling and fallbacks

## 🚀 Deployment Options

### **Option 1: Local Development**
```bash
python -m http.server 8000
# Open http://localhost:8000
```

### **Option 2: Azure Static Web Apps**
1. Fork repository on GitHub
2. Create Static Web App in Azure Portal
3. Connect to GitHub repository
4. Automatic deployment via GitHub Actions

### **Option 3: Any Static Host**
- Works with Netlify, Vercel, GitHub Pages
- Just upload files - no build process needed
- Configure environment variables for real weather data

## 🔧 Customization Points

### **Easy Modifications**
- Add regions: Edit `data/azure-regions.json`
- Adjust styling: Modify `css/main.css`
- Change cost formulas: Update `js/cost-calculator.js`
- Modify mock data: Edit `js/weather-service.js`

### **Advanced Features**
- Historical weather trends
- Real-time Azure pricing API integration
- Carbon footprint calculations
- User preferences and favorites
- Progressive Web App (PWA) capabilities

## 📊 Technical Specifications

### **Browser Support**
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

### **Performance**
- Lazy loading of weather data
- 15-minute weather data caching
- Optimized map rendering
- Compressed assets

### **Accessibility**
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast color schemes

## 🎯 Educational Value

This project demonstrates:
- **Cloud Infrastructure Awareness**: Understanding regional differences
- **API Integration**: Azure Maps Weather services
- **Data Visualization**: Interactive maps and real-time data
- **Cost Optimization**: Weather impact on data center operations
- **Modern Web Development**: Responsive design, modular JavaScript
- **Azure Services**: Static Web Apps, Maps, deployment strategies

## 🔮 Future Enhancements

**Phase 2 (Advanced Features)**
- Historical weather trend analysis
- Predictive cost modeling
- Real Azure pricing API integration
- Advanced data center efficiency metrics

**Phase 3 (Enterprise Features)**
- Multi-tenant configuration
- Custom alerting and notifications
- Integration with Azure Monitor
- Advanced analytics and reporting

---

*This simplified yet comprehensive implementation prioritizes educational value and ease of understanding while maintaining professional code quality and deployment readiness.*