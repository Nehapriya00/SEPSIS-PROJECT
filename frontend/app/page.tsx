'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Activity, Users, AlertTriangle, TrendingUp } from 'lucide-react'

interface DashboardStats {
  totalPatients: number
  highRiskPatients: number
  averageRiskScore: number
  recentAlerts: number
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading dashboard stats
    const loadStats = async () => {
      try {
        // In a real app, this would fetch from the API
        setTimeout(() => {
          setStats({
            totalPatients: 15,
            highRiskPatients: 4,
            averageRiskScore: 42.5,
            recentAlerts: 3
          })
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Failed to load dashboard stats:', error)
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const quickActions = [
    {
      title: 'Patient Intake',
      description: 'Add new patient and perform initial assessment',
      href: '/intake',
      icon: Users,
      color: 'bg-primary-500',
    },
    {
      title: 'View Patients',
      description: 'Browse and assess current patients',
      href: '/patients',
      icon: Activity,
      color: 'bg-success-500',
    },
    {
      title: 'Risk Alerts',
      description: 'Review high-risk patients requiring immediate attention',
      href: '/patients?filter=high-risk',
      icon: AlertTriangle,
      color: 'bg-danger-500',
    },
    {
      title: 'Analytics',
      description: 'View system analytics and trends',
      href: '/analytics',
      icon: TrendingUp,
      color: 'bg-warning-500',
    },
  ]

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
              <h1 className="text-xl font-bold text-gray-900">
                Sepsis Clinical Decision Support
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/patients" className="btn-secondary">
                Patients
              </Link>
              <Link href="/intake" className="btn-primary">
                New Patient
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Sepsis Clinical Decision Support
          </h1>
          <p className="text-gray-600">
            AI-powered clinical decision support for early sepsis detection and risk assessment
          </p>
        </div>

        {/* Dashboard Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary-100">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-danger-100">
                  <AlertTriangle className="h-6 w-6 text-danger-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">High Risk</p>
                  <p className="text-2xl font-bold text-danger-600">{stats.highRiskPatients}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-warning-100">
                  <TrendingUp className="h-6 w-6 text-warning-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Risk Score</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRiskScore.toFixed(1)}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-success-100">
                  <Activity className="h-6 w-6 text-success-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Recent Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.recentAlerts}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="card hover:shadow-lg transition-shadow duration-200 group"
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-full ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600">
                    {action.description}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-success-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-success-500 rounded-full mr-3"></div>
                <span className="text-success-800 font-medium">All Systems Operational</span>
              </div>
              <span className="text-success-600 text-sm">Last updated: Just now</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-success-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-success-500 rounded-full mr-3"></div>
                <span className="text-success-800 font-medium">ML Model Status: Active</span>
              </div>
              <span className="text-success-600 text-sm">Accuracy: 94.2%</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-warning-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-warning-500 rounded-full mr-3"></div>
                <span className="text-warning-800 font-medium">3 High-Risk Patients Need Review</span>
              </div>
              <Link href="/patients?filter=high-risk" className="text-warning-600 hover:text-warning-800 text-sm font-medium">
                View Details →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}