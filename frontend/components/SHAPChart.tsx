'use client'

import { useEffect, useRef } from 'react'
import { TrendingUp, TrendingDown, Info } from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts'

interface FeatureImportance {
  feature: string
  importance: number
  direction: string
}

interface Explanation {
  feature_importances: FeatureImportance[]
  total_impact: number
  interpretation: string
}

interface SHAPChartProps {
  explanation: Explanation
}

export default function SHAPChart({ explanation }: SHAPChartProps) {
  const chartData = explanation.feature_importances.map(feature => ({
    ...feature,
    positiveImportance: feature.direction === 'positive' ? feature.importance : 0,
    negativeImportance: feature.direction === 'negative' ? -feature.importance : 0,
    displayImportance: feature.importance
  }))

  const getFeatureColor = (feature: string, direction: string) => {
    const isIncreasing = direction === 'positive'
    if (feature.toLowerCase().includes('temperature') || feature.toLowerCase().includes('heart rate')) {
      return isIncreasing ? '#dc2626' : '#16a34a'
    }
    if (feature.toLowerCase().includes('blood pressure') || feature.toLowerCase().includes('oxygen')) {
      return isIncreasing ? '#16a34a' : '#dc2626'
    }
    if (feature.toLowerCase().includes('lactate') || feature.toLowerCase().includes('wbc')) {
      return isIncreasing ? '#dc2626' : '#16a34a'
    }
    return isIncreasing ? '#dc2626' : '#16a34a'
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Impact:</span>
              <span className={`font-medium ${
                data.direction === 'positive' ? 'text-danger-600' : 'text-success-600'
              }`}>
                {data.importance.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Direction:</span>
              <span className="font-medium text-gray-900 flex items-center">
                {data.direction === 'positive' ? (
                  <>
                    <TrendingUp className="h-4 w-4 mr-1 text-danger-600" />
                    Increases Risk
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 mr-1 text-success-600" />
                    Decreases Risk
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const getRiskLevelColor = (totalImpact: number) => {
    if (totalImpact >= 50) return 'text-danger-600 bg-danger-50 border-danger-200'
    if (totalImpact >= 25) return 'text-warning-600 bg-warning-50 border-warning-200'
    return 'text-success-600 bg-success-50 border-success-200'
  }

  return (
    <div className="space-y-6">
      {/* Overall Interpretation */}
      <div className={`p-4 rounded-lg border ${getRiskLevelColor(explanation.total_impact)}`}>
        <div className="flex items-start">
          <Info className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-2">AI Model Interpretation</h3>
            <p className="text-sm">{explanation.interpretation}</p>
            <div className="mt-3 flex items-center">
              <span className="text-sm font-medium mr-2">Total Impact Score:</span>
              <span className="font-bold">{explanation.total_impact.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SHAP Waterfall Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Feature Importance (SHAP Values)</h3>
          <div className="text-sm text-gray-600">
            Top {explanation.feature_importances.length} contributing factors
          </div>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="feature"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                label={{ value: 'Impact on Risk Score', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={0} stroke="#6b7280" strokeDasharray="2 2" />
              
              <Bar
                dataKey="importance"
                fill={(entry) => getFeatureColor(entry.feature, entry.direction)}
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Bar key={`cell-${index}`} fill={getFeatureColor(entry.feature, entry.direction)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature List with Details */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Feature Analysis</h3>
        <div className="space-y-4">
          {explanation.feature_importances.map((feature, index) => (
            <div key={feature.feature} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{feature.feature}</h4>
                    <div className="flex items-center mt-1">
                      {feature.direction === 'positive' ? (
                        <TrendingUp className="h-4 w-4 text-danger-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-success-600 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        feature.direction === 'positive' ? 'text-danger-600' : 'text-success-600'
                      }`}>
                        {feature.direction === 'positive' ? 'Increases' : 'Decreases'} Risk
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {feature.importance.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">impact score</div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    feature.direction === 'positive' ? 'bg-danger-500' : 'bg-success-500'
                  }`}
                  style={{ width: `${Math.min((feature.importance / Math.max(...explanation.feature_importances.map(f => f.importance))) * 100, 100)}%` }}
                ></div>
              </div>

              {/* Feature-specific context */}
              <div className="mt-3 text-sm text-gray-600">
                {feature.feature.toLowerCase().includes('temperature') && (
                  <p>Body temperature outside normal range (96-100.4°F) can indicate infection or sepsis.</p>
                )}
                {feature.feature.toLowerCase().includes('heart rate') && (
                  <p>Elevated heart rate (tachycardia) may suggest systemic inflammatory response.</p>
                )}
                {feature.feature.toLowerCase().includes('blood pressure') && (
                  <p>Low blood pressure can indicate shock and organ hypoperfusion.</p>
                )}
                {feature.feature.toLowerCase().includes('respiratory') && (
                  <p>Increased respiratory rate may compensate for metabolic acidosis.</p>
                )}
                {feature.feature.toLowerCase().includes('oxygen') && (
                  <p>Low oxygen saturation suggests respiratory compromise or shunting.</p>
                )}
                {feature.feature.toLowerCase().includes('wbc') && (
                  <p>Abnormal white blood cell count indicates immune system response.</p>
                )}
                {feature.feature.toLowerCase().includes('lactate') && (
                  <p>Elevated lactate levels suggest tissue hypoperfusion and anaerobic metabolism.</p>
                )}
                {feature.feature.toLowerCase().includes('creatinine') && (
                  <p>Elevated creatinine indicates acute kidney injury, common in sepsis.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">About SHAP Values</h3>
        <div className="prose text-sm text-gray-600">
          <p className="mb-3">
            SHAP (SHapley Additive exPlanations) values show how much each feature contributes to the model's prediction 
            compared to a baseline prediction. This helps clinicians understand why the AI model made its decision.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Positive values</strong> (red) increase the sepsis risk score</li>
            <li><strong>Negative values</strong> (green) decrease the sepsis risk score</li>
            <li><strong>Feature importance</strong> is ranked by the magnitude of impact</li>
            <li><strong>Total impact</strong> represents the combined effect of all features</li>
          </ul>
        </div>
      </div>
    </div>
  )
}