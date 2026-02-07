from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import sys
import os

# Add the data directory to the path to import sample data
sys.path.append(os.path.join(os.path.dirname(__file__), 'data'))

from sample_data import generate_sample_patients, SAMPLE_PATIENTS

app = FastAPI(title="Sepsis Clinical Decision Support API", version="1.0.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class Patient(BaseModel):
    id: int
    name: str
    age: int
    gender: str
    admission_date: str
    chief_complaint: str
    vital_signs: Dict[str, Any]
    lab_values: Dict[str, Any]
    medical_history: List[str]
    current_medications: List[str]
    risk_level: Optional[str] = None
    risk_score: Optional[float] = None

class PredictionRequest(BaseModel):
    patient_id: int
    vital_signs: Dict[str, Any]
    lab_values: Dict[str, Any]
    symptoms: List[str]

class PredictionResponse(BaseModel):
    patient_id: int
    risk_level: str
    risk_score: float
    recommendations: List[str]
    timestamp: str

class ExplanationRequest(BaseModel):
    patient_id: int
    features: Dict[str, Any]

class FeatureImportance(BaseModel):
    feature: str
    importance: float
    direction: str  # 'positive' or 'negative'

class ExplanationResponse(BaseModel):
    patient_id: int
    feature_importances: List[FeatureImportance]
    total_impact: float
    interpretation: str

# Mock ML prediction function
def predict_sepsis_risk(vital_signs: Dict, lab_values: Dict, symptoms: List[str]) -> Dict[str, Any]:
    """
    Mock sepsis risk prediction based on clinical indicators
    """
    # Extract key indicators
    temperature = vital_signs.get('temperature', 98.6)
    heart_rate = vital_signs.get('heart_rate', 70)
    systolic_bp = vital_signs.get('systolic_bp', 120)
    respiratory_rate = vital_signs.get('respiratory_rate', 16)
    oxygen_saturation = vital_signs.get('oxygen_saturation', 98)
    
    # Lab values
    wbc_count = lab_values.get('wbc_count', 7.0)
    lactate = lab_values.get('lactate', 1.0)
    creatinine = lab_values.get('creatinine', 1.0)
    bilirubin = lab_values.get('bilirubin', 1.0)
    platelets = lab_values.get('platelets', 250000)
    
    # Calculate risk score (0-100)
    risk_score = 0
    
    # Temperature contribution
    if temperature > 100.4 or temperature < 96.0:
        risk_score += 15
    
    # Heart rate contribution
    if heart_rate > 100:
        risk_score += 10
    
    # Blood pressure contribution
    if systolic_bp < 90:
        risk_score += 20
    
    # Respiratory rate contribution
    if respiratory_rate > 20:
        risk_score += 10
    
    # Oxygen saturation contribution
    if oxygen_saturation < 95:
        risk_score += 15
    
    # WBC count contribution
    if wbc_count > 12.0 or wbc_count < 4.0:
        risk_score += 15
    
    # Lactate contribution
    if lactate > 2.0:
        risk_score += 20
    
    # Creatinine contribution
    if creatinine > 1.5:
        risk_score += 10
    
    # Bilirubin contribution
    if bilirubin > 2.0:
        risk_score += 10
    
    # Platelet contribution
    if platelets < 100000:
        risk_score += 15
    
    # Symptom-based contribution
    sepsis_symptoms = ['fever', 'chills', 'confusion', 'shortness of breath', 'rapid breathing']
    symptom_matches = sum(1 for symptom in symptoms if any(keyword in symptom.lower() for keyword in sepsis_symptoms))
    risk_score += symptom_matches * 5
    
    # Determine risk level
    if risk_score >= 70:
        risk_level = "High Risk - Immediate Action Required"
    elif risk_score >= 40:
        risk_level = "Elevated Risk - Monitor Closely"
    else:
        risk_level = "Low Risk - Routine Monitoring"
    
    # Generate evidence-based recommendations
    recommendations = []
    if risk_score >= 70:
        recommendations.extend([
            "Initiate sepsis protocol immediately",
            "Obtain blood cultures before antibiotics",
            "Start broad-spectrum antibiotics within 1 hour",
            "Administer 30mL/kg crystalloid for hypotension",
            "Consider vasopressors if hypotensive despite fluid resuscitation",
            "Transfer to ICU for continuous monitoring"
        ])
    elif risk_score >= 40:
        recommendations.extend([
            "Increase monitoring frequency",
            "Repeat vital signs in 2 hours",
            "Consider additional laboratory studies",
            "Evaluate for infection source",
            "Prepare for potential escalation of care"
        ])
    else:
        recommendations.extend([
            "Continue routine monitoring",
            "Reassess in 4-6 hours",
            "Monitor for clinical deterioration",
            "Ensure adequate hydration"
        ])
    
    return {
        "risk_score": min(risk_score, 100),  # Cap at 100
        "risk_level": risk_level,
        "recommendations": recommendations
    }

# Mock SHAP-like feature importance calculation
def calculate_feature_importance(vital_signs: Dict, lab_values: Dict, symptoms: List[str]) -> List[Dict]:
    """
    Mock SHAP-like feature importance calculation
    """
    features = []
    
    # Vital signs
    temperature = vital_signs.get('temperature', 98.6)
    heart_rate = vital_signs.get('heart_rate', 70)
    systolic_bp = vital_signs.get('systolic_bp', 120)
    respiratory_rate = vital_signs.get('respiratory_rate', 16)
    oxygen_saturation = vital_signs.get('oxygen_saturation', 98)
    
    # Lab values
    wbc_count = lab_values.get('wbc_count', 7.0)
    lactate = lab_values.get('lactate', 1.0)
    creatinine = lab_values.get('creatinine', 1.0)
    bilirubin = lab_values.get('bilirubin', 1.0)
    platelets = lab_values.get('platelets', 250000)
    
    # Calculate importance based on deviation from normal ranges
    def calc_importance(value, normal_range, weight=1.0):
        low, high = normal_range
        if value < low:
            return (low - value) / low * weight
        elif value > high:
            return (value - high) / high * weight
        return 0
    
    # Temperature importance
    temp_importance = calc_importance(temperature, (96.0, 100.4), 15)
    features.append({"feature": "Temperature", "importance": abs(temp_importance), "direction": "positive" if temp_importance > 0 else "negative"})
    
    # Heart rate importance
    hr_importance = calc_importance(heart_rate, (60, 100), 10)
    features.append({"feature": "Heart Rate", "importance": abs(hr_importance), "direction": "positive" if hr_importance > 0 else "negative"})
    
    # Blood pressure importance
    bp_importance = calc_importance(systolic_bp, (90, 140), 20)
    features.append({"feature": "Systolic BP", "importance": abs(bp_importance), "direction": "negative" if bp_importance < 0 else "positive"})
    
    # Respiratory rate importance
    rr_importance = calc_importance(respiratory_rate, (12, 20), 10)
    features.append({"feature": "Respiratory Rate", "importance": abs(rr_importance), "direction": "positive" if rr_importance > 0 else "negative"})
    
    # Oxygen saturation importance
    o2_importance = calc_importance(oxygen_saturation, (95, 100), 15)
    features.append({"feature": "Oxygen Saturation", "importance": abs(o2_importance), "direction": "negative" if o2_importance < 0 else "positive"})
    
    # WBC count importance
    wbc_importance = calc_importance(wbc_count, (4.0, 12.0), 15)
    features.append({"feature": "WBC Count", "importance": abs(wbc_importance), "direction": "positive" if wbc_importance > 0 else "negative"})
    
    # Lactate importance
    lactate_importance = calc_importance(lactate, (0.5, 2.0), 20)
    features.append({"feature": "Lactate", "importance": abs(lactate_importance), "direction": "positive" if lactate_importance > 0 else "negative"})
    
    # Creatinine importance
    creatinine_importance = calc_importance(creatinine, (0.6, 1.2), 10)
    features.append({"feature": "Creatinine", "importance": abs(creatinine_importance), "direction": "positive" if creatinine_importance > 0 else "negative"})
    
    # Bilirubin importance
    bilirubin_importance = calc_importance(bilirubin, (0.3, 1.2), 10)
    features.append({"feature": "Bilirubin", "importance": abs(bilirubin_importance), "direction": "positive" if bilirubin_importance > 0 else "negative"})
    
    # Platelet importance
    platelet_importance = calc_importance(platelets/1000, (150, 450), 15)  # Convert to thousands
    features.append({"feature": "Platelets", "importance": abs(platelet_importance), "direction": "negative" if platelet_importance > 0 else "positive"})
    
    # Sort by importance and return top features
    features.sort(key=lambda x: x["importance"], reverse=True)
    return features[:6]  # Return top 6 most important features

@app.get("/")
async def root():
    return {"message": "Sepsis Clinical Decision Support API", "version": "1.0.0"}

@app.get("/patients", response_model=List[Patient])
async def get_patients():
    """Get all patients with their current status"""
    patients = []
    for patient_data in SAMPLE_PATIENTS:
        patient = Patient(**patient_data)
        # Calculate current risk level based on latest data
        prediction = predict_sepsis_risk(
            patient_data["vital_signs"],
            patient_data["lab_values"],
            [patient_data["chief_complaint"]]
        )
        patient.risk_level = prediction["risk_level"]
        patient.risk_score = prediction["risk_score"]
        patients.append(patient)
    return patients

@app.get("/patients/{patient_id}", response_model=Patient)
async def get_patient(patient_id: int):
    """Get a specific patient by ID"""
    for patient_data in SAMPLE_PATIENTS:
        if patient_data["id"] == patient_id:
            patient = Patient(**patient_data)
            # Calculate current risk level
            prediction = predict_sepsis_risk(
                patient_data["vital_signs"],
                patient_data["lab_values"],
                [patient_data["chief_complaint"]]
            )
            patient.risk_level = prediction["risk_level"]
            patient.risk_score = prediction["risk_score"]
            return patient
    
    raise HTTPException(status_code=404, detail="Patient not found")

@app.post("/predict", response_model=PredictionResponse)
async def predict_sepsis(request: PredictionRequest):
    """Predict sepsis risk for a patient"""
    try:
        prediction = predict_sepsis_risk(
            request.vital_signs,
            request.lab_values,
            request.symptoms
        )
        
        return PredictionResponse(
            patient_id=request.patient_id,
            risk_level=prediction["risk_level"],
            risk_score=prediction["risk_score"],
            recommendations=prediction["recommendations"],
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/explain", response_model=ExplanationResponse)
async def explain_prediction(request: ExplanationRequest):
    """Get SHAP-like feature importance explanation"""
    try:
        # Mock feature importance (in real implementation, this would use actual SHAP values)
        features = calculate_feature_importance(
            request.features.get("vital_signs", {}),
            request.features.get("lab_values", {}),
            request.features.get("symptoms", [])
        )
        
        total_impact = sum(f["importance"] for f in features)
        
        interpretation = ""
        if total_impact > 50:
            interpretation = "High risk indicators are strongly present. Immediate clinical attention recommended."
        elif total_impact > 25:
            interpretation = "Moderate risk indicators present. Close monitoring advised."
        else:
            interpretation = "Low risk indicators present. Continue routine care."
        
        return ExplanationResponse(
            patient_id=request.patient_id,
            feature_importances=[
                FeatureImportance(**f) for f in features
            ],
            total_impact=total_impact,
            interpretation=interpretation
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explanation error: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)