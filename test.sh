#!/bin/bash

echo "🏥 Sepsis Clinical Decision Support System - Test Script"
echo "========================================================"

# Test backend endpoints
echo "Testing Backend API..."
echo "----------------------"

echo "1. Testing health endpoint:"
curl -s http://localhost:8000/health || echo "❌ Backend not responding"

echo -e "\n\n2. Testing patients endpoint:"
curl -s http://localhost:8000/patients | head -c 200 || echo "❌ Patients endpoint failed"

echo -e "\n\n3. Testing prediction endpoint:"
curl -s -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": 999,
    "vital_signs": {
      "temperature": 101.5,
      "heart_rate": 110,
      "systolic_bp": 95,
      "respiratory_rate": 22,
      "oxygen_saturation": 96
    },
    "lab_values": {
      "wbc_count": 15.2,
      "lactate": 2.8,
      "creatinine": 1.5
    },
    "symptoms": ["fever", "confusion"]
  }' | head -c 300 || echo "❌ Prediction endpoint failed"

echo -e "\n\nFrontend Status:"
echo "----------------"
echo "Frontend should be accessible at: http://localhost:3000"
echo "Backend API should be accessible at: http://localhost:8000"

echo -e "\n\n🎉 Application is ready for testing!"
echo "========================================"