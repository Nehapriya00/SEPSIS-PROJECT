# Sepsis Clinical Decision Support System

A complete full-stack web application for AI-powered sepsis risk assessment and clinical decision support. This system provides healthcare professionals with real-time sepsis risk predictions, evidence-based recommendations, and interpretable AI explanations.

## 🏥 Features

### Frontend (Next.js 16 + TypeScript + Tailwind)
- **Multi-page Dashboard**: Overview, patient management, intake, and detailed assessments
- **Role-based UI**: Supports Doctor, Nurse, and Patient views
- **Patient Intake**: Comprehensive form for new patient registration and assessment
- **Risk Visualization**: Real-time risk scoring with color-coded indicators
- **SHAP Interpretability**: Feature importance charts showing AI decision rationale
- **Responsive Design**: Mobile-friendly interface for bedside use
- **Loading States**: Professional loading indicators and error handling

### Backend (FastAPI + Python)
- **RESTful API**: Clean, documented endpoints for all operations
- **ML Inference**: Mock sepsis risk prediction algorithm
- **Feature Explanation**: SHAP-like feature importance calculation
- **Sample Data**: Realistic MIMIC-IV style synthetic patient data
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Error Handling**: Comprehensive error responses and validation

### AI/ML Features
- **Risk Prediction**: Early sepsis detection with risk stratification (Low/Elevated/High)
- **Evidence-based Recommendations**: Clinical guidelines and best practices
- **Feature Attribution**: Explainable AI with SHAP-style visualizations
- **Real-time Assessment**: Instant risk calculations based on vital signs and lab values

## 🛠 Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 19** - Latest React features
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization library
- **Lucide React** - Icon library
- **Date-fns** - Date manipulation utilities

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation and serialization
- **NumPy** - Numerical computing
- **Pandas** - Data manipulation
- **Uvicorn** - ASGI server

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd sepsis-cds
```

### 2. Backend Setup

Navigate to the backend directory and install Python dependencies:
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\\Scripts\\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend

# Install dependencies
npm install
```

### 4. Environment Configuration

Create a `.env.local` file in the frontend directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 5. Start the Backend Server

In the backend directory with virtual environment activated:
```bash
python main.py
# OR
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The FastAPI server will start at `http://localhost:8000`

### 6. Start the Frontend Development Server

In the frontend directory:
```bash
npm run dev
```

The Next.js application will start at `http://localhost:3000`

## 🚀 Usage Guide

### Accessing the Application

1. Open your browser and navigate to `http://localhost:3000`
2. You'll see the main dashboard with system overview
3. Use the navigation menu to access different sections

### Key Workflows

#### 1. Adding a New Patient
- Click "New Patient" or "Patient Intake" from the dashboard
- Fill in patient demographics and medical history
- Enter vital signs and laboratory values
- Click "Perform Risk Assessment" to get AI predictions
- Review recommendations and save the patient

#### 2. Viewing Existing Patients
- Navigate to "Patients" from the main menu
- Use search and filter options to find specific patients
- Click on any patient card to view detailed assessment
- Access tabs for overview, vitals, labs, and AI explanation

#### 3. Understanding Risk Assessment
- **Risk Score**: Percentage from 0-100% indicating sepsis probability
- **Risk Levels**: 
  - 0-39%: Low Risk (Green)
  - 40-69%: Elevated Risk (Yellow)
  - 70-100%: High Risk (Red)
- **Recommendations**: Evidence-based clinical actions
- **Feature Importance**: Visual explanation of AI decision factors

## 📊 Sample Data

The application includes 15 synthetic patients with realistic MIMIC-IV style data:

### Patient Demographics
- Ages: 18-95 years
- Gender: Male/Female
- Admission dates: Within last 30 days
- Chief complaints: Various sepsis-related symptoms

### Vital Signs
- Temperature (°F)
- Heart rate (bpm)
- Blood pressure (mmHg)
- Respiratory rate (/min)
- Oxygen saturation (%)

### Laboratory Values
- Complete Blood Count (WBC, Hemoglobin, Platelets)
- Metabolic panel (Glucose, Electrolytes, Kidney function)
- Liver function tests
- Lactate levels
- Inflammatory markers

## 🔧 API Endpoints

### Core Endpoints

#### `GET /patients`
- **Description**: Get all patients with current risk assessments
- **Response**: Array of patient objects with risk scores

#### `GET /patients/{id}`
- **Description**: Get specific patient details
- **Response**: Complete patient object with medical data

#### `POST /predict`
- **Description**: Perform sepsis risk prediction
- **Request Body**:
  ```json
  {
    "patient_id": 1,
    "vital_signs": {
      "temperature": 101.2,
      "heart_rate": 110,
      "systolic_bp": 95
    },
    "lab_values": {
      "wbc_count": 15.2,
      "lactate": 2.8
    },
    "symptoms": ["fever", "confusion"]
  }
  ```
- **Response**: Risk assessment with recommendations

#### `POST /explain`
- **Description**: Get SHAP-like feature importance explanation
- **Response**: Feature contributions and interpretation

### Health Check
- `GET /health` - System health status
- `GET /` - API information

## 🎨 UI Components

### Risk Assessment Display
- Color-coded risk levels
- Progress bars and visual indicators
- Evidence-based recommendations
- Quick action buttons

### SHAP Visualization
- Interactive feature importance charts
- Positive/negative impact indicators
- Detailed explanations for each feature
- Clinical context for medical parameters

### Patient Management
- Searchable patient lists
- Filterable by risk level
- Responsive card layouts
- Quick assessment access

## 🔍 Testing

### Manual Testing Checklist

#### Backend Testing
1. Start backend server: `cd backend && uvicorn main:app --reload`
2. Test health endpoint: `curl http://localhost:8000/health`
3. Check patients endpoint: `curl http://localhost:8000/patients`
4. Test prediction endpoint: Use Swagger UI at `http://localhost:8000/docs`

#### Frontend Testing
1. Start frontend: `cd frontend && npm run dev`
2. Navigate to `http://localhost:3000`
3. Test all navigation links
4. Verify patient intake form submission
5. Check risk assessment visualization
6. Test SHAP chart interactions

#### Integration Testing
1. Ensure both servers are running
2. Verify API communication in browser dev tools
3. Test error handling when backend is stopped
4. Check responsive design on different screen sizes

### Automated Testing
```bash
# Frontend tests (when implemented)
cd frontend
npm test

# Backend tests (when implemented)
cd backend
python -m pytest tests/
```

## 🐳 Docker Deployment

### Backend Dockerfile
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - PYTHONPATH=/app
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend
```

## 🏗 Project Structure

```
sepsis-cds/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── data/
│   │   └── sample_data.py     # Synthetic patient data
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile            # Backend container
├── frontend/
│   ├── app/
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Homepage
│   │   ├── patients/
│   │   │   └── page.tsx      # Patient list
│   │   ├── patients/[id]/
│   │   │   └── page.tsx      # Patient detail
│   │   └── intake/
│   │       └── page.tsx      # Patient intake
│   ├── components/
│   │   ├── RiskAssessment.tsx # Risk display component
│   │   └── SHAPChart.tsx     # Feature importance visualization
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   ├── package.json          # Frontend dependencies
│   ├── next.config.js        # Next.js configuration
│   ├── tailwind.config.js    # Tailwind CSS config
│   └── tsconfig.json         # TypeScript config
└── README.md                 # This file
```

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript best practices
2. Use Tailwind CSS for styling
3. Implement proper error handling
4. Add loading states for async operations
5. Write meaningful commit messages
6. Test changes manually before submitting

### Code Style
- Use meaningful variable and function names
- Add comments for complex logic
- Follow React/Next.js conventions
- Maintain consistent formatting

## 🔐 Security Considerations

- All patient data is synthetic and fictional
- No real patient information is used
- Basic CORS configuration for development
- Input validation on all API endpoints
- No authentication implemented (development only)

## 📈 Performance

### Frontend Optimizations
- Next.js App Router for optimal loading
- Component-level code splitting
- Optimized images and assets
- Responsive design for mobile devices

### Backend Optimizations
- Efficient data structures
- Minimal API response times
- Caching headers where appropriate
- Async/await patterns

## 🆘 Troubleshooting

### Common Issues

#### Backend won't start
- Check Python version (3.11+ required)
- Verify virtual environment is activated
- Ensure all dependencies are installed
- Check for port 8000 conflicts

#### Frontend won't build
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (18+ required)
- Verify TypeScript configuration
- Check for dependency conflicts

#### API calls failing
- Ensure backend is running on port 8000
- Check CORS configuration
- Verify NEXT_PUBLIC_API_URL environment variable
- Check browser console for errors

#### Charts not displaying
- Ensure Recharts is properly installed
- Check for TypeScript errors
- Verify data format matches expected structure
- Check browser console for JavaScript errors

### Getting Help
1. Check the browser developer console for errors
2. Verify both servers are running
3. Review the API documentation at `http://localhost:8000/docs`
4. Check the troubleshooting sections above

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏥 Clinical Disclaimer

This application is for demonstration and educational purposes only. It should not be used for actual patient care or medical decision-making. All patient data is synthetic and fictional. In a real clinical environment, this system would require:

- Extensive clinical validation
- Regulatory approval (FDA, CE marking)
- Integration with Electronic Health Records
- Robust security and compliance measures
- Clinical workflow integration
- User training and certification

Always consult with healthcare professionals and follow established clinical guidelines for sepsis diagnosis and management.

---

**Built with ❤️ for healthcare professionals using modern web technologies.**