'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface TeamPerformanceChartProps {
  participationRate: number
  blockerRate: number
  totalStandups: number
}

const COLORS = {
  participation: '#22c55e',
  blockers: '#ef4444',
  inactive: '#e2e8f0'
}

export function TeamPerformanceChart({ participationRate, blockerRate, totalStandups }: TeamPerformanceChartProps) {
  const participationData = [
    { name: 'Active', value: participationRate, color: COLORS.participation },
    { name: 'Inactive', value: 100 - participationRate, color: COLORS.inactive }
  ]

  const blockerData = [
    { name: 'With Blockers', value: blockerRate, color: COLORS.blockers },
    { name: 'No Blockers', value: 100 - blockerRate, color: COLORS.participation }
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">{`${Math.round(data.value)}%`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Participation Rate */}
      <div>
        <h4 className="text-sm font-medium mb-3">Team Participation Rate</h4>
        <div className="w-full h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={participationData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                dataKey="value"
                stroke="none"
              >
                {participationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          {participationRate}% active participation
        </p>
      </div>

      {/* Blocker Rate */}
      <div>
        <h4 className="text-sm font-medium mb-3">Blocker Distribution</h4>
        <div className="w-full h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={blockerData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                dataKey="value"
                stroke="none"
              >
                {blockerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          {blockerRate}% of standups have blockers
        </p>
      </div>
    </div>
  )
}