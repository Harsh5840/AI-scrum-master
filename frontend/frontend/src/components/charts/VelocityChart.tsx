'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface VelocityData {
  sprintName: string
  planned: number
  completed: number
  velocity: number
}

interface VelocityChartProps {
  data: VelocityData[]
}

export function VelocityChart({ data }: VelocityChartProps) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="sprintName" 
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis />
          <Tooltip 
            formatter={(value: any, name: string) => [
              Math.round(value), 
              name === 'planned' ? 'Planned Points' : 'Completed Points'
            ]}
          />
          <Legend />
          <Bar 
            dataKey="planned" 
            fill="#e2e8f0" 
            name="Planned Points"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="completed" 
            fill="#3b82f6" 
            name="Completed Points"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}