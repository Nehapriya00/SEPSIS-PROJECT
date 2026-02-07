'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, AlertTriangle, CheckCircle } from 'lucide-react'

interface VitalSigns {
  temperature: number
  heart_rate: number
  systolic_bp: number
  diastolic_bp: number
  respiratory_rate: number
  oxygen_saturation: number
}

interface LabValues {
  wbc_count: number
  hemoglobin: number
  platelets: number
  creatinine: number
  bun: number
  glucose: number
  sodium: number
  potassium: number
  lactate: number
  bilirubin: number
  alt: number
  ast: number
}

export default function IntakePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    // Patient Demographics
    name: '',
    age: '',
    gender: 'Male',
    admission_date: new Date().toISOString().split('T')[0],
    admission_time: new Date().toTimeString().slice(0, 5),
    chief_complaint: '',
    
    // Medical History
    medical_history: '',
    current_medications: '',
    
    // Vital Signs
    vital_signs: {
      temperature: 98.6,
      heart_rate: 75,
      systolic_bp: 120,
      diastolic_bp: 80,
      respiratory_rate: 16,
      oxygen_saturation: 98
    } as VitalSigns,
    
    // Lab Values
    lab_values: {
      wbc_count: 7.0,
      hemoglobin: 13.5,
      platelets: 250000,
      creatinine: 1.0,
      bun: 15,
      glucose: 100,
      sodium: 140,
      potassium: 4.0,
      lactate: 1.0,
      bilirubin: 0.8,
      alt: 25,
      ast: 28
    } as LabValues
  })

  const handleInputChange = (field: string, value: string | number) => {
    if (field.startsWith('vital_signs.')) {
      const vitalField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        vital_signs: {
          ...prev.vital_signs,
          [vitalField]: value
        }
      }))
    } else if (field.startsWith('lab_values.')) {
      const labField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        lab_values: {
          ...prev.lab_values,
          [labField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const performRiskAssessment = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      
      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: Date.now(), // Temporary ID for assessment
          vital_signs: formData.vital_signs,
          lab_values: formData.lab_values,
          symptoms: [formData.chief_complaint]
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to perform risk assessment')
      }

      const predictionData = await response.json()
      setPrediction(predictionData)
      setSuccess('Risk assessment completed successfully!')
      
    } catch (err) {
      setError('Failed to perform risk assessment. Please check if the backend is running.')
      console.error('Error performing risk assessment:', err)
    } finally {
      setLoading(false)
    }
  }

  const savePatient = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // In a real application, this would save to the backend
      // For this demo, we'll just show success and navigate
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      setSuccess('Patient saved successfully!')
      setTimeout(() => {
        router.push('/patients')
      }, 2000)
      
    } catch (err) {
      setError('Failed to save patient. Please try again.')
      console.error('Error saving patient:', err)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (riskLevel: string) => {
    if (riskLevel.includes('High Risk')) return 'border-danger-500 bg-danger-50'
    if (riskLevel.includes('Elevated Risk')) return 'border-warning-500 bg-warning-50'
    return 'border-success-500 bg-success-50'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Sepsis CDS
              </Link>
              <span className="ml-8 text-gray-600">Patient Intake</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/patients" className="btn-secondary">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Intake & Risk Assessment</h1>
          <p className="text-gray-600">
            Add new patient information and perform AI-powered sepsis risk assessment
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="error-message mb-6 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="success-message mb-6 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Information Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Demographics */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Patient Demographics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="Age"
                    min="0"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    className="input-field"
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admission Date *
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.admission_date}
                    onChange={(e) => handleInputChange('admission_date', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chief Complaint *
                  </label>
                  <textarea
                    className="input-field"
                    rows={3}
                    value={formData.chief_complaint}
                    onChange={(e) => handleInputChange('chief_complaint', e.target.value)}
                    placeholder="Describe the patient's primary complaint and symptoms"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical History
                  </label>
                  <textarea
                    className="input-field"
                    rows={3}
                    value={formData.medical_history}
                    onChange={(e) => handleInputChange('medical_history', e.target.value)}
                    placeholder="List relevant medical conditions, allergies, etc."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Medications
                  </label>
                  <textarea
                    className="input-field"
                    rows={2}
                    value={formData.current_medications}
                    onChange={(e) => handleInputChange('current_medications', e.target.value)}
                    placeholder="List current medications and dosages"
                  />
                </div>
              </div>
            </div>

            {/* Vital Signs */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Vital Signs</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature (°F)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="input-field"
                    value={formData.vital_signs.temperature}
                    onChange={(e) => handleInputChange('vital_signs.temperature', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.vital_signs.heart_rate}
                    onChange={(e) => handleInputChange('vital_signs.heart_rate', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Systolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.vital_signs.systolic_bp}
                    onChange={(e) => handleInputChange('vital_signs.systolic_bp', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diastolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.vital_signs.diastolic_bp}
                    onChange={(e) => handleInputChange('vital_signs.diastolic_bp', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Respiratory Rate (/min)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.vital_signs.respiratory_rate}
                    onChange={(e) => handleInputChange('vital_signs.respiratory_rate', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Oxygen Saturation (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="input-field"
                    value={formData.vital_signs.oxygen_saturation}
                    onChange={(e) => handleInputChange('vital_signs.oxygen_saturation', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Lab Values */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Laboratory Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WBC Count (K/μL)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="input-field"
                    value={formData.lab_values.wbc_count}
                    onChange={(e) => handleInputChange('lab_values.wbc_count', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hemoglobin (g/dL)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="input-field"
                    value={formData.lab_values.hemoglobin}
                    onChange={(e) => handleInputChange('lab_values.hemoglobin', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platelets (/μL)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.lab_values.platelets}
                    onChange={(e) => handleInputChange('lab_values.platelets', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Creatinine (mg/dL)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field"
                    value={formData.lab_values.creatinine}
                    onChange={(e) => handleInputChange('lab_values.creatinine', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Glucose (mg/dL)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.lab_values.glucose}
                    onChange={(e) => handleInputChange('lab_values.glucose', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lactate (mmol/L)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field"
                    value={formData.lab_values.lactate}
                    onChange={(e) => handleInputChange('lab_values.lactate', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Risk Assessment Panel */}
          <div className="lg:col-span-1">
            <div className="card sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Risk Assessment</h2>
              
              {!prediction ? (
                <div className="text-center py-8">
                  <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-6">
                    Complete the patient information and vital signs to perform risk assessment
                  </p>
                  <button
                    onClick={performRiskAssessment}
                    disabled={loading || !formData.name || !formData.age || !formData.chief_complaint}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="loading-spinner mr-2"></div>
                        Assessing Risk...
                      </div>
                    ) : (
                      'Perform Risk Assessment'
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className={`p-4 rounded-lg border-2 ${getRiskColor(prediction.risk_level)}`}>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">Risk Level</h3>
                      <p className="text-3xl font-bold mb-2">{prediction.risk_score.toFixed(0)}%</p>
                      <p className="font-medium">{prediction.risk_level}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
                    <div className="space-y-2">
                      {prediction.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={performRiskAssessment}
                      disabled={loading}
                      className="btn-secondary flex-1"
                    >
                      Reassess
                    </button>
                    <button
                      onClick={savePatient}
                      disabled={loading}
                      className="btn-primary flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Patient
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}