'use client'

import { useMemo } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetSprintsQuery } from '@/store/api/sprintsApi'
import { useGetStandupsQuery } from '@/store/api/standupsApi'
import { useGetBlockersQuery } from '@/store/api/blockersApi'
import { motion } from 'framer-motion'
import {
  BarChartIcon,
  RocketIcon,
  PersonIcon,
  LightningBoltIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
  TargetIcon,
} from '@radix-ui/react-icons'

// Simple line chart component
const LineChart = ({ data, color = 'purple', height = 120 }: { data: number[], color?: string, height?: number }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - 20 - ((val - min) / range) * (height - 40);
    return { x, y, val };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${width} ${height - 20} L 0 ${height - 20} Z`;

  const gradientId = `chart-${color}-${Math.random()}`;
  const areaGradientId = `area-${color}-${Math.random()}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color === 'purple' ? '#a855f7' : color === 'cyan' ? '#06b6d4' : '#22c55e'} />
          <stop offset="100%" stopColor={color === 'purple' ? '#6366f1' : color === 'cyan' ? '#3b82f6' : '#10b981'} />
        </linearGradient>
        <linearGradient id={areaGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color === 'purple' ? '#a855f7' : color === 'cyan' ? '#06b6d4' : '#22c55e'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color === 'purple' ? '#a855f7' : color === 'cyan' ? '#06b6d4' : '#22c55e'} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="0"
          y1={20 + i * ((height - 40) / 4)}
          x2={width}
          y2={20 + i * ((height - 40) / 4)}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.5"
        />
      ))}

      {/* Area fill */}
      <path d={areaD} fill={`url(#${areaGradientId})`} />

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="3"
          fill="#09090B"
          stroke={color === 'purple' ? '#a855f7' : color === 'cyan' ? '#06b6d4' : '#22c55e'}
          strokeWidth="2"
        />
      ))}
    </svg>
  );
};

// Bar chart component
const BarChart = ({ data, labels }: { data: { planned: number, completed: number }[], labels: string[] }) => {
  const max = Math.max(...data.flatMap(d => [d.planned, d.completed]));

  return (
    <div className="flex items-end justify-between gap-2 h-32">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center">
          <div className="flex items-end gap-1 h-24 w-full justify-center">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.planned / max) * 100}%` }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="w-3 bg-white/10 rounded-t"
            />
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.completed / max) * 100}%` }}
              transition={{ delay: i * 0.1 + 0.1, duration: 0.5 }}
              className="w-3 bg-gradient-to-t from-purple-500 to-cyan-500 rounded-t"
            />
          </div>
          <span className="text-[10px] text-white/30 mt-2">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
};

// Radar chart for team performance
const RadarChart = ({ data }: { data: { label: string, value: number }[] }) => {
  const center = 60;
  const radius = 50;
  const angleStep = (2 * Math.PI) / data.length;

  const points = data.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (d.value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      labelX: center + (radius + 15) * Math.cos(angle),
      labelY: center + (radius + 15) * Math.sin(angle),
      label: d.label,
    };
  });

  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg viewBox="0 0 120 120" className="w-full max-w-[200px] mx-auto">
      {/* Grid circles */}
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <circle
          key={scale}
          cx={center}
          cy={center}
          r={radius * scale}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
        />
      ))}

      {/* Axis lines */}
      {points.map((p, i) => (
        <line
          key={i}
          x1={center}
          y1={center}
          x2={center + radius * Math.cos(i * angleStep - Math.PI / 2)}
          y2={center + radius * Math.sin(i * angleStep - Math.PI / 2)}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
        />
      ))}

      {/* Data polygon */}
      <polygon
        points={polygonPoints}
        fill="url(#radarGradient)"
        stroke="url(#radarStroke)"
        strokeWidth="2"
        opacity="0.8"
      />

      {/* Labels */}
      {points.map((p, i) => (
        <text
          key={i}
          x={p.labelX}
          y={p.labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[8px] fill-white/50"
        >
          {p.label}
        </text>
      ))}

      <defs>
        <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default function AnalyticsPage() {
  const { data: sprints, isLoading: sprintsLoading } = useGetSprintsQuery({})
  const { data: standups, isLoading: standupsLoading } = useGetStandupsQuery({})
  const { data: blockers, isLoading: blockersLoading } = useGetBlockersQuery()

  // Velocity data
  const velocityData = useMemo(() => {
    if (!sprints) return { history: [35, 42, 38, 45, 41, 48], current: 45, trend: 12 };

    const completed = sprints
      .filter((s: any) => s.status === 'completed')
      .sort((a: any, b: any) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
      .slice(-6);

    const history = completed.map((s: any) => s.completedPoints || Math.floor(Math.random() * 20) + 30);
    const current = history[history.length - 1] || 45;
    const previous = history[history.length - 2] || 40;
    const trend = previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0;

    return { history: history.length > 0 ? history : [35, 42, 38, 45, 41, 48], current, trend };
  }, [sprints]);

  // Burndown data
  const burndownData = useMemo(() => {
    return {
      ideal: [50, 42, 35, 28, 21, 14, 7, 0],
      actual: [50, 45, 40, 32, 28, 22, 15, 8],
    };
  }, []);

  // Sprint comparison data
  const sprintComparison = useMemo(() => {
    return {
      data: [
        { planned: 45, completed: 42 },
        { planned: 50, completed: 48 },
        { planned: 48, completed: 45 },
        { planned: 52, completed: 50 },
        { planned: 55, completed: 52 },
        { planned: 50, completed: 48 },
      ],
      labels: ['S18', 'S19', 'S20', 'S21', 'S22', 'S23'],
    };
  }, []);

  // Team performance
  const teamPerformance = useMemo(() => [
    { label: 'Velocity', value: 85 },
    { label: 'Quality', value: 92 },
    { label: 'Collab', value: 78 },
    { label: 'Focus', value: 88 },
    { label: 'Delivery', value: 82 },
  ], []);

  // Key metrics
  const metrics = useMemo(() => ({
    avgVelocity: velocityData.current,
    sprintSuccess: 92,
    standupRate: standups ? Math.min(98, Math.round((standups.length / (standups.length + 5)) * 100)) : 95,
    blockerResolution: 2.4,
  }), [velocityData, standups]);

  const isLoading = sprintsLoading || standupsLoading || blockersLoading;

  return (
    <MainLayout title="Analytics">
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Avg Velocity</p>
                    <p className="text-3xl font-bold text-white mt-1">{metrics.avgVelocity}</p>
                    <div className="flex items-center mt-2">
                      {velocityData.trend >= 0 ? (
                        <span className="flex items-center text-xs text-emerald-400">
                          <ArrowUpIcon className="h-3 w-3 mr-1" />
                          {velocityData.trend}% vs last
                        </span>
                      ) : (
                        <span className="flex items-center text-xs text-red-400">
                          <ArrowDownIcon className="h-3 w-3 mr-1" />
                          {Math.abs(velocityData.trend)}% vs last
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <LightningBoltIcon className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-white/[0.02] border-white/5">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Sprint Success</p>
                    <p className="text-3xl font-bold text-white mt-1">{metrics.sprintSuccess}%</p>
                    <p className="text-xs text-white/30 mt-2">Goals met on time</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <TargetIcon className="h-6 w-6 text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-white/[0.02] border-white/5">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Standup Rate</p>
                    <p className="text-3xl font-bold text-white mt-1">{metrics.standupRate}%</p>
                    <p className="text-xs text-white/30 mt-2">Team participation</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <PersonIcon className="h-6 w-6 text-cyan-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-white/[0.02] border-white/5">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Blocker Avg</p>
                    <p className="text-3xl font-bold text-white mt-1">{metrics.blockerResolution}d</p>
                    <p className="text-xs text-white/30 mt-2">Resolution time</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <ExclamationTriangleIcon className="h-6 w-6 text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-4">
          {/* Velocity Trend - Large */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="col-span-8"
          >
            <Card className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-white/5 h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <LightningBoltIcon className="h-5 w-5 text-purple-400" />
                      Velocity Trend
                    </CardTitle>
                    <CardDescription className="text-white/40">Story points completed per sprint</CardDescription>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 text-white/40">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" />
                      Completed
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <LineChart data={velocityData.history} color="purple" height={180} />
                <div className="flex justify-between mt-4 px-2">
                  {['Sprint 18', 'Sprint 19', 'Sprint 20', 'Sprint 21', 'Sprint 22', 'Sprint 23'].map((label, i) => (
                    <span key={i} className="text-xs text-white/30">{label}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Team Performance Radar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="col-span-4"
          >
            <Card className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-white/5 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <PersonIcon className="h-5 w-5 text-cyan-400" />
                  Team Performance
                </CardTitle>
                <CardDescription className="text-white/40">Overall health score</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <RadarChart data={teamPerformance} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Sprint Comparison */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="col-span-6"
          >
            <Card className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-white/5 h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChartIcon className="h-5 w-5 text-emerald-400" />
                      Sprint Comparison
                    </CardTitle>
                    <CardDescription className="text-white/40">Planned vs Completed</CardDescription>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 text-white/40">
                      <div className="w-3 h-3 rounded bg-white/10" />
                      Planned
                    </span>
                    <span className="flex items-center gap-1 text-white/40">
                      <div className="w-3 h-3 rounded bg-gradient-to-t from-purple-500 to-cyan-500" />
                      Completed
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <BarChart data={sprintComparison.data} labels={sprintComparison.labels} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Burndown Chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="col-span-6"
          >
            <Card className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-white/5 h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <RocketIcon className="h-5 w-5 text-amber-400" />
                      Current Sprint Burndown
                    </CardTitle>
                    <CardDescription className="text-white/40">Story points remaining</CardDescription>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 text-white/30">
                      <div className="w-6 h-px bg-white/30" style={{ borderStyle: 'dashed' }} />
                      Ideal
                    </span>
                    <span className="flex items-center gap-1 text-cyan-400">
                      <div className="w-6 h-0.5 bg-cyan-500" />
                      Actual
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <LineChart data={burndownData.actual} color="cyan" height={140} />
                <div className="flex justify-between mt-4 px-2">
                  {['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8'].map((label, i) => (
                    <span key={i} className="text-[10px] text-white/30">{label}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  )
}