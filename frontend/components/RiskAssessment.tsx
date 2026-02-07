'use client'

import { AlertTriangle, TrendingUp, Clock, CheckCircle } from 'lucide-react'

interface Prediction {
  risk_level: string
  risk_score: number
  recommendations: string[]
  timestamp: string
}

interface RiskAssessmentProps {
  prediction: Prediction
}

export default function RiskAssessment({ prediction }: RiskAssessmentProps) {
  const getRiskColor = (riskLevel: string) => {
    if (riskLevel.includes('High Risk')) {
      return {
        border: 'border-danger-500',
        bg: 'bg-danger-50',
        text: 'text-danger-700',
        icon: 'text-danger-600'
      }
    }
    if (riskLevel.includes('Elevated Risk')) {
      return {
        border: 'border-warning-500',
        bg: 'bg-warning-50',
        text: 'text-warning-700',
        icon: 'text-warning-600'
      }
    }
    return {
      border: 'border-success-500',
      bg: 'bg-success-50',
      text: 'text-success-700',
      icon: 'text-success-600'
    }
  }

  const getRecommendationIcon = (index: number) => {
    return <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0" />
  }

  const colors = getRiskColor(prediction.risk_level)

  return (
    <div className="space-y-6">
      {/* Risk Score Display */}
      <div className={`p-6 rounded-lg border-2 ${colors.border} ${colors.bg}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${colors.text}`}>Risk Assessment</h3>
          <div className="flex items-center text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {new Date(prediction.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
        
        <div className="text-center mb-4">
          <div className="mb-2">
            <span className={`text-5xl font-bold ${colors.text}`}>
              {prediction.risk_score.toFixed(0)}
            </span>
            <span className="text-2xl font-medium text-gray-600 ml-1">%</span>
          </div>
          <p className={`font-medium text-lg ${colors.text}`}>
            {prediction.risk_level}
          </p>
        </div>

        {/* Risk Level Bar */}
        <div className="relative">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Low Risk</span>
            <span>Elevated Risk</span>
            <span>High Risk</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                prediction.risk_score >= 70 ? 'bg-danger-500' :
                prediction.risk_score >= 40 ? 'bg-warning-500' : 'bg-success-500'
              }`}
              style={{ width: `${Math.min(prediction.risk_score, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0-39%</span>
            <span>40-69%</span>
            <span>70-100%</span>
          </div>
        </div>
      </div>

      {/* Clinical Recommendations */}
      <div className="card">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Clinical Recommendations</h3>
        </div>
        
        <div className="space-y-3">
          {prediction.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start">
              {getRecommendationIcon(index)}
              <p className="text-sm text-gray-700 leading-relaxed">
                {recommendation}
              </p>
            </div>
          ))}
        </div>

        {prediction.recommendations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No specific recommendations at this time</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-3">
          {prediction.risk_score >= 70 && (
            <button className="btn-danger w-full">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Activate Sepsis Protocol
            </button>
          )}
          <button className="btn-secondary w-full">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Detailed Analysis
          </button>
          <button className="btn-secondary w-full">
            <CheckCircle className="h-4 w-4 mr-2" />
            Schedule Follow-up
          </button>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Risk Factors</h3>
        <div className="space-y-2">
          {prediction.risk_score >= 70 && (
            <>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-danger-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Multiple organ dysfunction indicators present</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-danger-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Hemodynamic instability detected</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-danger-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Elevated inflammatory markers</span>
              </div>
            </>
          )}
          {prediction.risk_score >= 40 && prediction.risk_score < 70 && (
            <>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-warning-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Some abnormal vital signs detected</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-warning-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Mild inflammatory response</span>
              </div>
            </>
          )}
          {prediction.risk_score < 40 && (
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-3"></div>
              <span className="text-gray-700">All parameters within normal ranges</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}