'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  User, 
  Activity, 
  AlertTriangle, 
  TrendingUp,
  FileText,
  Heart,
  Thermometer,
  Wind,
  Droplets
} from 'lucide-react'
import RiskAssessment from '@/components/RiskAssessment'
import SHAPChart from '@/components/SHAPChart'

interface Patient {
  id: number
  name: string
  age: number
  gender: string
  admission_date: string
  chief_complaint: string
  risk_level: string
  risk_score: number
  vital_signs: {
    temperature: number
    heart_rate: number
    systolic_bp: number
    diastolic_bp: number
    respiratory_rate: number
    oxygen_saturation: number
  }
  lab_values: {
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
  medical_history: string[]
  current_medications: string[]
}

interface Prediction {
  risk_level: string
  risk_score: number
  recommendations: string[]
  timestamp: string
}

interface Explanation {
  feature_importances: Array<{
    feature: string
    importance: number
    direction: string
  }>
  total_impact: number
  interpretation: string
}

export default function PatientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const patientId = params.id as string
  
  const [patient, setPatient] = useState<Patient | null>(null)
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [explanation, setExplanation] = useState<Explanation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'vitals' | 'labs' | 'explanation'>('overview')

  useEffect(() => {
    if (patientId) {
      loadPatientData()
    }
  }, [patientId])

  const loadPatientData = async () => {
    try {
      setLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      
      // Load patient data
      const patientResponse = await fetch(`${apiUrl}/patients/${patientId}`)
      if (!patientResponse.ok) {
        throw new Error('Failed to fetch patient data')
      }
      const patientData = await patientResponse.json()
      setPatient(patientData)

      // Get fresh prediction
      const predictionResponse = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: parseInt(patientId),
          vital_signs: patientData.vital_signs,
          lab_values: patientData.lab_values,
          symptoms: [patientData.chief_complaint]
        }),
      })
      if (predictionResponse.ok) {
        const predictionData = await predictionResponse.json()
        setPrediction(predictionData)
      }

      // Get explanation
      const explanationResponse = await fetch(`${apiUrl}/explain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: parseInt(patientId),
          features: {
            vital_signs: patientData.vital_signs,
            lab_values: patientData.lab_values,
            symptoms: [patientData.chief_complaint]
          }
        }),
      })
      if (explanationResponse.ok) {
        const explanationData = await explanationResponse.json()
        setExplanation(explanationData)
      }

    } catch (err) {
      setError('Failed to load patient data. Please check if the backend is running.')
      console.error('Error loading patient data:', err)
    } finally {
      setLoading(false)
    }
  }

  const getRiskBadgeClass = (riskLevel: string) => {
    if (riskLevel.includes('High Risk')) return 'bg-danger-100 text-danger-800 border-danger-200'
    if (riskLevel.includes('Elevated Risk')) return 'bg-warning-100 text-warning-800 border-warning-200'
    return 'bg-success-100 text-success-800 border-success-200'
  }

  const getVitalStatus = (value: number, type: string) => {
    // Simple normal ranges for demonstration
    const ranges = {
      temperature: { low: 96.0, high: 100.4 },
      heart_rate: { low: 60, high: 100 },
      systolic_bp: { low: 90, high: 140 },
      respiratory_rate: { low: 12, high: 20 },
      oxygen_saturation: { low: 95, high: 100 }
    }
    
    const range = ranges[type as keyof typeof ranges]
    if (!range) return 'normal'
    
    if (value < range.low || value > range.high) return 'abnormal'
    return 'normal'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-danger-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Patient</h2>
          <p className="text-gray-600 mb-4">{error || 'Patient not found'}</p>
          <button onClick={() => router.push('/patients')} className="btn-primary">
            Back to Patients
          </button>
        </div>
      </div>
    )
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
              <span className="ml-4 text-gray-600">
                <Link href="/patients" className="hover:text-primary-600">Patients</Link>
                <span className="mx-2">/</span>
                <span>{patient.name}</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => router.back()} className="btn-secondary">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </button>
              <Link href="/intake" className="btn-primary">
                New Assessment
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Patient Header */}
        <div className="card mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="p-4 rounded-full bg-primary-100">
                <User className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
                <div className="flex items-center space-x-4 mt-2 text-gray-600">
                  <span>{patient.age} years old</span>
                  <span>•</span>
                  <span>{patient.gender}</span>
                  <span>•</span>
                  <span>Admitted {new Date(patient.admission_date).toLocaleDateString()}</span>
                </div>
                <div className="mt-3">
                  <p className="text-gray-700 font-medium">{patient.chief_complaint}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getRiskBadgeClass(patient.risk_level)}`}>
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span className="font-semibold">{prediction?.risk_score.toFixed(0) || patient.risk_score.toFixed(0)}% Risk</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {prediction?.risk_level || patient.risk_level}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: FileText },
                { id: 'vitals', label: 'Vital Signs', icon: Activity },
                { id: 'labs', label: 'Lab Results', icon: Droplets },
                { id: 'explanation', label: 'AI Explanation', icon: TrendingUp },
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RiskAssessment 
                  prediction={prediction || {
                    risk_level: patient.risk_level,
                    risk_score: patient.risk_score,
                    recommendations: [],
                    timestamp: new Date().toISOString()
                  }}
                />
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
                    <div className="space-y-2">
                      {patient.medical_history.map((condition, index) => (
                        <span key={index} className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm mr-2 mb-2">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Medications</h3>
                    <div className="space-y-2">
                      {patient.current_medications.map((medication, index) => (
                        <span key={index} className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm mr-2 mb-2">
                          {medication}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vitals' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Vital Signs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { 
                      name: 'Temperature', 
                      value: patient.vital_signs.temperature, 
                      unit: '°F', 
                      icon: Thermometer,
                      status: getVitalStatus(patient.vital_signs.temperature, 'temperature')
                    },
                    { 
                      name: 'Heart Rate', 
                      value: patient.vital_signs.heart_rate, 
                      unit: 'bpm', 
                      icon: Heart,
                      status: getVitalStatus(patient.vital_signs.heart_rate, 'heart_rate')
                    },
                    { 
                      name: 'Blood Pressure', 
                      value: patient.vital_signs.systolic_bp, 
                      unit: 'mmHg', 
                      icon: Activity,
                      status: getVitalStatus(patient.vital_signs.systolic_bp, 'systolic_bp')
                    },
                    { 
                      name: 'Respiratory Rate', 
                      value: patient.vital_signs.respiratory_rate, 
                      unit: '/min', 
                      icon: Wind,
                      status: getVitalStatus(patient.vital_signs.respiratory_rate, 'respiratory_rate')
                    },
                    { 
                      name: 'Oxygen Saturation', 
                      value: patient.vital_signs.oxygen_saturation, 
                      unit: '%', 
                      icon: Activity,
                      status: getVitalStatus(patient.vital_signs.oxygen_saturation, 'oxygen_saturation')
                    },
                  ].map((vital) => {
                    const Icon = vital.icon
                    const statusColor = vital.status === 'normal' ? 'text-success-600 bg-success-50' : 'text-danger-600 bg-danger-50'
                    return (
                      <div key={vital.name} className={`p-4 rounded-lg border ${statusColor}`}>
                        <div className="flex items-center justify-between mb-2">
                          <Icon className="h-6 w-6" />
                          {vital.status === 'abnormal' && (
                            <AlertTriangle className="h-5 w-5" />
                          )}
                        </div>
                        <p className="text-sm font-medium">{vital.name}</p>
                        <p className="text-2xl font-bold">
                          {vital.value} <span className="text-sm font-normal">{vital.unit}</span>
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === 'labs' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Laboratory Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'WBC Count', value: patient.lab_values.wbc_count, unit: 'K/μL', normal: '4.0-12.0' },
                    { name: 'Hemoglobin', value: patient.lab_values.hemoglobin, unit: 'g/dL', normal: '12.0-16.0' },
                    { name: 'Platelets', value: patient.lab_values.platelets / 1000, unit: 'K/μL', normal: '150-450' },
                    { name: 'Creatinine', value: patient.lab_values.creatinine, unit: 'mg/dL', normal: '0.6-1.2' },
                    { name: 'Glucose', value: patient.lab_values.glucose, unit: 'mg/dL', normal: '70-140' },
                    { name: 'Lactate', value: patient.lab_values.lactate, unit: 'mmol/L', normal: '0.5-2.0' },
                    { name: 'Sodium', value: patient.lab_values.sodium, unit: 'mEq/L', normal: '135-145' },
                    { name: 'Potassium', value: patient.lab_values.potassium, unit: 'mEq/L', normal: '3.5-5.0' },
                    { name: 'Bilirubin', value: patient.lab_values.bilirubin, unit: 'mg/dL', normal: '0.3-1.2' },
                  ].map((lab) => (
                    <div key={lab.name} className="p-4 border border-gray-200 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 mb-1">{lab.name}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {lab.value} <span className="text-sm font-normal text-gray-600">{lab.unit}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Normal: {lab.normal}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'explanation' && explanation && (
              <SHAPChart explanation={explanation} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}