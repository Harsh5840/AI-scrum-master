'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface BurndownChartProps {
  idealLine: number[]
  actualLine: number[]
  totalDays: number
  elapsedDays: number
}

export function BurndownChart({ idealLine, actualLine, totalDays, elapsedDays }: BurndownChartProps) {
  // Prepare data for the chart
  const chartData = Array.from({ length: totalDays + 1 }, (_, index) => {
    const day = index
    return {
      day,
      ideal: idealLine[index] || 0,
      actual: index <= elapsedDays ? (actualLine[index] || 0) : null,
      dayLabel: index === 0 ? 'Start' : index === totalDays ? 'End' : `Day ${index}`
    }
  })

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="day" 
            type="number"
            domain={[0, totalDays]}
            ticks={[0, Math.floor(totalDays/4), Math.floor(totalDays/2), Math.floor(3*totalDays/4), totalDays]}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => `Day ${value}`}
            formatter={(value: any, name: string) => [
              value === null ? 'No data' : Math.round(value), 
              name === 'ideal' ? 'Ideal Burndown' : 'Actual Burndown'
            ]}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="ideal" 
            stroke="#94a3b8" 
            strokeDasharray="5 5"
            name="Ideal Burndown"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Actual Burndown"
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}