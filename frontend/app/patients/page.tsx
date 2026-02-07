'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, AlertTriangle, Clock, User } from 'lucide-react'

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
    respiratory_rate: number
    oxygen_saturation: number
  }
  lab_values: {
    wbc_count: number
    lactate: number
    creatinine: number
  }
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRisk, setFilterRisk] = useState('all')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/patients`)
      if (!response.ok) {
        throw new Error('Failed to fetch patients')
      }
      const data = await response.json()
      setPatients(data)
    } catch (err) {
      setError('Failed to load patients. Please check if the backend is running.')
      console.error('Error loading patients:', err)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (riskLevel: string) => {
    if (riskLevel.includes('High Risk')) return 'text-danger-600 bg-danger-50'
    if (riskLevel.includes('Elevated Risk')) return 'text-warning-600 bg-warning-50'
    return 'text-success-600 bg-success-50'
  }

  const getRiskBadgeClass = (riskLevel: string) => {
    if (riskLevel.includes('High Risk')) return 'bg-danger-100 text-danger-800'
    if (riskLevel.includes('Elevated Risk')) return 'bg-warning-100 text-warning-800'
    return 'bg-success-100 text-success-800'
  }

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.chief_complaint.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterRisk === 'all' ||
                         (filterRisk === 'high' && patient.risk_level.includes('High Risk')) ||
                         (filterRisk === 'moderate' && patient.risk_level.includes('Elevated Risk')) ||
                         (filterRisk === 'low' && patient.risk_level.includes('Low Risk'))
    
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
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
              <span className="ml-8 text-gray-600">Patients</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/intake" className="btn-secondary">
                Back to Dashboard
              </Link>
              <Link href="/intake" className="btn-primary">
                Add Patient
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Management</h1>
          <p className="text-gray-600">
            Monitor and assess sepsis risk for all patients
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message mb-6">
            {error}
          </div>
        )}

        {/* Search and Filter Controls */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search patients by name or complaint..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="input-field pl-10 pr-8 appearance-none"
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
              >
                <option value="all">All Risk Levels</option>
                <option value="high">High Risk</option>
                <option value="moderate">Elevated Risk</option>
                <option value="low">Low Risk</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patients Grid */}
        {filteredPatients.length === 0 ? (
          <div className="card text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-600">
              {searchTerm || filterRisk !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No patients have been admitted yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <Link
                key={patient.id}
                href={`/patients/${patient.id}`}
                className="card hover:shadow-lg transition-shadow duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-100 group-hover:bg-primary-100 transition-colors duration-200">
                      <User className="h-6 w-6 text-gray-600 group-hover:text-primary-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                        {patient.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {patient.age} years, {patient.gender}
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskBadgeClass(patient.risk_level)}`}>
                    {patient.risk_score.toFixed(0)}%
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Chief Complaint</p>
                    <p className="text-sm font-medium text-gray-900">{patient.chief_complaint}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Risk Assessment</p>
                    <div className={`p-3 rounded-lg border ${getRiskColor(patient.risk_level)}`}>
                      <p className="text-sm font-medium">{patient.risk_level}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Temperature</p>
                      <p className="text-sm font-medium">{patient.vital_signs.temperature}°F</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Heart Rate</p>
                      <p className="text-sm font-medium">{patient.vital_signs.heart_rate} bpm</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Blood Pressure</p>
                      <p className="text-sm font-medium">{patient.vital_signs.systolic_bp} mmHg</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">WBC Count</p>
                      <p className="text-sm font-medium">{patient.lab_values.wbc_count} K/μL</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center text-xs text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      Admitted {new Date(patient.admission_date).toLocaleDateString()}
                    </div>
                    <div className="text-xs font-medium text-primary-600 group-hover:text-primary-700">
                      View Details →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{filteredPatients.length}</p>
              <p className="text-sm text-gray-600">Total Patients</p>
            </div>
            <div className="text-center p-4 bg-danger-50 rounded-lg">
              <p className="text-2xl font-bold text-danger-600">
                {filteredPatients.filter(p => p.risk_level.includes('High Risk')).length}
              </p>
              <p className="text-sm text-danger-600">High Risk</p>
            </div>
            <div className="text-center p-4 bg-warning-50 rounded-lg">
              <p className="text-2xl font-bold text-warning-600">
                {filteredPatients.filter(p => p.risk_level.includes('Elevated Risk')).length}
              </p>
              <p className="text-sm text-warning-600">Elevated Risk</p>
            </div>
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <p className="text-2xl font-bold text-success-600">
                {filteredPatients.filter(p => p.risk_level.includes('Low Risk')).length}
              </p>
              <p className="text-sm text-success-600">Low Risk</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}