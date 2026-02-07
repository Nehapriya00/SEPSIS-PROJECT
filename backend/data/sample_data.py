"""
Synthetic MIMIC-IV style sample data for sepsis clinical decision support system
This data is completely synthetic and does not contain any real patient information.
"""

import random
from datetime import datetime, timedelta

# First names and last names for synthetic patients
FIRST_NAMES = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
    "William", "Barbara", "David", "Elizabeth", "Richard", "Susan", "Joseph", "Jessica",
    "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
    "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
    "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle"
]

LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
    "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
    "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
    "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill"
]

# Medical conditions and chief complaints
CHIEF_COMPLAINTS = [
    "Fever and chills for 2 days",
    "Shortness of breath and confusion",
    "Abdominal pain and nausea",
    "Chest pain and cough",
    "Severe headache and neck stiffness",
    "Urinary frequency and burning",
    "Diarrhea and vomiting",
    "Joint pain and swelling",
    "Skin rash and itching",
    "Back pain and fever",
    "Dizziness and weakness",
    "Sore throat and cough",
    "Leg swelling and shortness of breath",
    "Head injury and confusion",
    "Severe abdominal pain"
]

# Medical histories
MEDICAL_HISTORIES = [
    ["Type 2 Diabetes", "Hypertension"],
    ["Chronic Kidney Disease", "Heart Failure"],
    ["COPD", "Diabetes"],
    ["Coronary Artery Disease", "Previous MI"],
    ["Asthma", "Anxiety Disorder"],
    ["Chronic Kidney Disease", "Anemia"],
    ["Heart Failure", "Atrial Fibrillation"],
    ["Type 1 Diabetes", "Retinopathy"],
    ["Hypertension", "Hyperlipidemia"],
    ["COPD", "Sleep Apnea"],
    ["Coronary Artery Disease", "Diabetes"],
    ["Chronic Kidney Disease"],
    ["Heart Failure", "Diabetes", "Hypertension"],
    ["Asthma", "Allergic Rhinitis"],
    ["Previous Stroke", "Hypertension"]
]

# Current medications
MEDICATIONS = [
    ["Metformin", "Lisinopril", "Aspirin"],
    ["Furosemide", "Metoprolol", "Insulin"],
    ["Albuterol", "Metformin"],
    ["Atorvastatin", "Clopidogrel", "Metoprolol"],
    ["Fluticasone", "Sertraline"],
    ["Erythropoietin", "Calcium Carbonate"],
    ["Warfarin", "Furosemide", "Digoxin"],
    ["Insulin", "Lisinopril"],
    ["Amlodipine", "Simvastatin"],
    ["Tiotropium", "Albuterol"],
    ["Metoprolol", "Atorvastatin", "Nitroglycerin"],
    ["Epoetin Alfa", "Sevelamer"],
    ["Carvedilol", "Furosemide", "Metformin", "Lisinopril"],
    ["Fluticasone", "Montelukast"],
    ["Clopidogrel", "Atorvastatin", "Lisinopril"]
]

def generate_realistic_vital_signs(risk_level="normal"):
    """Generate realistic vital signs based on risk level"""
    base_vitals = {
        "temperature": round(random.normalvariate(98.6, 1.5), 1),
        "heart_rate": int(random.normalvariate(75, 15)),
        "systolic_bp": int(random.normalvariate(120, 20)),
        "diastolic_bp": int(random.normalvariate(75, 10)),
        "respiratory_rate": int(random.normalvariate(16, 3)),
        "oxygen_saturation": round(random.normalvariate(97, 2), 1)
    }
    
    # Adjust vitals based on risk level
    if risk_level == "high":
        # Sepsis indicators
        if random.random() < 0.7:
            base_vitals["temperature"] = round(random.uniform(101.0, 104.0), 1)
        if random.random() < 0.6:
            base_vitals["heart_rate"] = int(random.uniform(100, 140))
        if random.random() < 0.5:
            base_vitals["systolic_bp"] = int(random.uniform(80, 95))
        if random.random() < 0.4:
            base_vitals["respiratory_rate"] = int(random.uniform(22, 35))
        if random.random() < 0.3:
            base_vitals["oxygen_saturation"] = round(random.uniform(88, 94), 1)
    elif risk_level == "moderate":
        # Some abnormal values
        if random.random() < 0.4:
            base_vitals["temperature"] = round(random.uniform(99.5, 101.5), 1)
        if random.random() < 0.3:
            base_vitals["heart_rate"] = int(random.uniform(90, 110))
        if random.random() < 0.3:
            base_vitals["systolic_bp"] = int(random.uniform(100, 110))
        if random.random() < 0.2:
            base_vitals["respiratory_rate"] = int(random.uniform(20, 25))
    
    return base_vitals

def generate_realistic_lab_values(risk_level="normal"):
    """Generate realistic lab values based on risk level"""
    base_labs = {
        "wbc_count": round(random.normalvariate(7.5, 2.5), 1),  # White blood cells (K/uL)
        "hemoglobin": round(random.normalvariate(13.5, 2.0), 1),  # Hemoglobin (g/dL)
        "platelets": int(random.normalvariate(250000, 75000)),  # Platelets (/uL)
        "creatinine": round(random.normalvariate(1.0, 0.3), 2),  # Creatinine (mg/dL)
        "bun": round(random.normalvariate(15, 5), 1),  # Blood urea nitrogen (mg/dL)
        "glucose": round(random.normalvariate(100, 30), 0),  # Glucose (mg/dL)
        "sodium": int(random.normalvariate(140, 3)),  # Sodium (mEq/L)
        "potassium": round(random.normalvariate(4.0, 0.5), 1),  # Potassium (mEq/L)
        "chloride": int(random.normalvariate(105, 3)),  # Chloride (mEq/L)
        "co2": int(random.normalvariate(24, 3)),  # CO2 (mEq/L)
        "lactate": round(random.normalvariate(1.2, 0.4), 2),  # Lactate (mmol/L)
        "bilirubin": round(random.normalvariate(0.8, 0.3), 2),  # Total bilirubin (mg/dL)
        "alt": int(random.normalvariate(25, 10)),  # ALT (U/L)
        "ast": int(random.normalvariate(28, 12)),  # AST (U/L)
        "alk_phosphatase": int(random.normalvariate(80, 20)),  # Alkaline phosphatase (U/L)
        "albumin": round(random.normalvariate(3.5, 0.5), 1),  # Albumin (g/dL)
        "protein": round(random.normalvariate(7.0, 0.8), 1),  # Total protein (g/dL)
        "calcium": round(random.normalvariate(9.2, 0.5), 1),  # Calcium (mg/dL)
        "magnesium": round(random.normalvariate(1.8, 0.2), 1),  # Magnesium (mg/dL)
        "phosphorus": round(random.normalvariate(3.5, 0.5), 1),  # Phosphorus (mg/dL)
    }
    
    # Adjust labs based on risk level
    if risk_level == "high":
        # Sepsis indicators
        if random.random() < 0.6:
            base_labs["wbc_count"] = round(random.uniform(15.0, 25.0), 1)  # Leukocytosis
        elif random.random() < 0.2:
            base_labs["wbc_count"] = round(random.uniform(2.0, 3.5), 1)  # Leukopenia
        
        if random.random() < 0.5:
            base_labs["lactate"] = round(random.uniform(2.5, 6.0), 2)  # Elevated lactate
        
        if random.random() < 0.4:
            base_labs["creatinine"] = round(random.uniform(1.8, 3.5), 2)  # Acute kidney injury
        
        if random.random() < 0.3:
            base_labs["platelets"] = int(random.uniform(50000, 120000))  # Thrombocytopenia
        
        if random.random() < 0.3:
            base_labs["bilirubin"] = round(random.uniform(2.5, 5.0), 2)  # Elevated bilirubin
        
        if random.random() < 0.4:
            base_labs["glucose"] = int(random.uniform(150, 300))  # Hyperglycemia
        
        if random.random() < 0.3:
            base_labs["albumin"] = round(random.uniform(2.5, 3.2), 1)  # Hypoalbuminemia
    
    elif risk_level == "moderate":
        # Some abnormal values
        if random.random() < 0.3:
            base_labs["wbc_count"] = round(random.uniform(12.0, 15.0), 1)
        
        if random.random() < 0.3:
            base_labs["lactate"] = round(random.uniform(2.0, 2.8), 2)
        
        if random.random() < 0.3:
            base_labs["creatinine"] = round(random.uniform(1.3, 1.8), 2)
        
        if random.random() < 0.2:
            base_labs["platelets"] = int(random.uniform(120000, 150000))
    
    return base_labs

def generate_sample_patients():
    """Generate synthetic sample patients"""
    patients = []
    
    for i in range(15):
        # Determine risk level for this patient
        risk_level = random.choices(
            ["normal", "moderate", "high"],
            weights=[0.4, 0.35, 0.25],
            k=1
        )[0]
        
        # Generate patient demographics
        age = int(random.normalvariate(65, 18))
        age = max(18, min(95, age))  # Constrain age between 18-95
        
        gender = random.choice(["Male", "Female"])
        
        # Generate name
        first_name = random.choice(FIRST_NAMES)
        last_name = random.choice(LAST_NAMES)
        full_name = f"{first_name} {last_name}"
        
        # Generate admission date (within last 30 days)
        admission_date = datetime.now() - timedelta(days=random.randint(1, 30))
        admission_date_str = admission_date.strftime("%Y-%m-%d %H:%M:%S")
        
        # Select medical history and medications
        medical_history = random.choice(MEDICAL_HISTORIES)
        medications = random.choice(MEDICATIONS)
        
        # Generate vital signs and lab values based on risk level
        vital_signs = generate_realistic_vital_signs(risk_level)
        lab_values = generate_realistic_lab_values(risk_level)
        
        # Select chief complaint
        chief_complaint = random.choice(CHIEF_COMPLAINTS)
        
        patient = {
            "id": i + 1,
            "name": full_name,
            "age": age,
            "gender": gender,
            "admission_date": admission_date_str,
            "chief_complaint": chief_complaint,
            "vital_signs": vital_signs,
            "lab_values": lab_values,
            "medical_history": medical_history,
            "current_medications": medications
        }
        
        patients.append(patient)
    
    return patients

# Generate the sample patients data
SAMPLE_PATIENTS = generate_sample_patients()

# Additional sample data for demonstration
SEPSIS_INDICATORS = {
    "qsofa_score": {
        "description": "Quick Sequential Organ Failure Assessment",
        "criteria": [
            "Respiratory rate ≥ 22/min",
            "Altered mentation (GCS < 15)",
            "Systolic blood pressure ≤ 100 mmHg"
        ],
        "interpretation": {
            0: "Low risk for in-hospital mortality",
            1: "Moderate risk",
            2: "High risk",
            3: "Very high risk"
        }
    },
    "sirs_criteria": {
        "description": "Systemic Inflammatory Response Syndrome",
        "criteria": [
            "Temperature > 38°C or < 36°C",
            "Heart rate > 90/min",
            "Respiratory rate > 20/min or PaCO2 < 32 mmHg",
            "WBC > 12,000/μL or < 4,000/μL or > 10% bands"
        ],
        "interpretation": {
            0: "No SIRS",
            1-2: "SIRS present",
            3-4: "Severe SIRS"
        }
    },
    "news2_score": {
        "description": "National Early Warning Score 2",
        "parameters": [
            "Respiratory rate", "Oxygen saturation", "Temperature",
            "Systolic blood pressure", "Pulse rate", "Level of consciousness"
        ],
        "interpretation": {
            "0-4": "Low risk",
            "5-6": "Medium risk", 
            "7+": "High risk"
        }
    }
}

CLINICAL_GUIDELINES = {
    "hour_1_bundle": {
        "title": "Surviving Sepsis Campaign 1-Hour Bundle",
        "interventions": [
            "Measure lactate level",
            "Obtain blood cultures before administering antibiotics",
            "Administer broad-spectrum antibiotics",
            "Begin rapid fluid resuscitation (30mL/kg crystalloid for hypotension or lactate ≥4 mmol/L)",
            "Apply vasopressors if patient is hypotensive during or after fluid resuscitation (target MAP ≥65 mmHg)"
        ]
    },
    "antibiotic_selection": {
        "community_acquired": [
            "Piperacillin-tazobactam 4.5g IV every 6h",
            "Ceftriaxone 2g IV daily plus Azithromycin 500mg IV daily",
            "Cefotaxime 2g IV every 8h plus Clarithromycin 500mg IV every 12h"
        ],
        "hospital_acquired": [
            "Meropenem 1g IV every 8h",
            "Imipenem-cilastatin 500mg IV every 6h",
            "Piperacillin-tazobactam 4.5g IV every 6h plus Vancomycin"
        ]
    }
}