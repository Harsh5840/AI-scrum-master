'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    CheckCircledIcon,
    ExclamationTriangleIcon,
    RocketIcon,
    BarChartIcon,
    ClipboardCopyIcon,
    DownloadIcon,
    ArrowLeftIcon,
    LightningBoltIcon
} from '@radix-ui/react-icons'

interface ReportData {
    id: string
    sprintId: number
    title: string
    summary: string
    metrics: {
        totalStoryPoints: number
        completedStoryPoints: number
        completionRate: number
        velocity: number
        totalTasks: number
        completedTasks: number
        blockerCount: number
        standupCount: number
    }
    highlights: string[]
    risks: string[]
    recommendations: string[]
    generatedAt: string
}

export default function ReportPage() {
    const params = useParams()
    const reportId = params.id as string

    const [report, setReport] = useState<ReportData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        fetchReport()
    }, [reportId])

    const fetchReport = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/${reportId}`)

            if (!res.ok) {
                throw new Error('Report not found')
            }

            const data = await res.json()
            setReport(data)
        } catch (err) {
            setError('Report not found or has expired')
        } finally {
            setIsLoading(false)
        }
    }

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handlePrint = () => {
        window.print()
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-white/40 mt-4">Loading report...</p>
                </div>
            </div>
        )
    }

    if (error || !report) {
        return (
            <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
                <Card className="bg-white/[0.02] border-white/10 max-w-md">
                    <CardContent className="py-12 text-center">
                        <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">Report Not Found</h3>
                        <p className="text-white/40 text-sm mb-6">{error}</p>
                        <Button asChild variant="outline" className="border-white/10 text-white hover:bg-white/5">
                            <Link href="/">Go Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#09090B] print:bg-white">
            {/* Header */}
            <header className="border-b border-white/5 print:border-gray-200">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 print:hidden">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                            AI
                        </div>
                        <span className="font-semibold text-white">Scrum Master</span>
                    </Link>

                    <div className="flex items-center gap-2 print:hidden">
                        <Button variant="outline" size="sm" onClick={copyLink} className="border-white/10 text-white hover:bg-white/5">
                            <ClipboardCopyIcon className="h-4 w-4 mr-1" />
                            {copied ? 'Copied!' : 'Copy Link'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={handlePrint} className="border-white/10 text-white hover:bg-white/5">
                            <DownloadIcon className="h-4 w-4 mr-1" />
                            Print/PDF
                        </Button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
                {/* Title */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white print:text-black">{report.title}</h1>
                    <p className="text-white/40 print:text-gray-500 mt-2">
                        Generated on {new Date(report.generatedAt).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>

                {/* Executive Summary */}
                <Card className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-white/5 print:bg-gray-50 print:border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-white print:text-black flex items-center gap-2">
                            <LightningBoltIcon className="h-5 w-5 text-purple-400 print:text-purple-600" />
                            Executive Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-white/80 print:text-gray-700 text-lg leading-relaxed">{report.summary}</p>
                    </CardContent>
                </Card>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-white/[0.02] border-white/5 print:bg-gray-50 print:border-gray-200">
                        <CardContent className="p-4 text-center">
                            <p className="text-3xl font-bold text-white print:text-black">{report.metrics.completionRate}%</p>
                            <p className="text-white/40 print:text-gray-500 text-sm">Completion</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/[0.02] border-white/5 print:bg-gray-50 print:border-gray-200">
                        <CardContent className="p-4 text-center">
                            <p className="text-3xl font-bold text-white print:text-black">{report.metrics.velocity}</p>
                            <p className="text-white/40 print:text-gray-500 text-sm">Velocity/Week</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/[0.02] border-white/5 print:bg-gray-50 print:border-gray-200">
                        <CardContent className="p-4 text-center">
                            <p className="text-3xl font-bold text-white print:text-black">
                                {report.metrics.completedStoryPoints}/{report.metrics.totalStoryPoints}
                            </p>
                            <p className="text-white/40 print:text-gray-500 text-sm">Story Points</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/[0.02] border-white/5 print:bg-gray-50 print:border-gray-200">
                        <CardContent className="p-4 text-center">
                            <p className="text-3xl font-bold text-white print:text-black">{report.metrics.blockerCount}</p>
                            <p className="text-white/40 print:text-gray-500 text-sm">Active Blockers</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Highlights */}
                {report.highlights.length > 0 && (
                    <Card className="bg-white/[0.02] border-white/5 print:bg-gray-50 print:border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-white print:text-black flex items-center gap-2">
                                <CheckCircledIcon className="h-5 w-5 text-emerald-400 print:text-emerald-600" />
                                Key Highlights
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {report.highlights.map((highlight, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs flex-shrink-0">
                                            {index + 1}
                                        </span>
                                        <span className="text-white/80 print:text-gray-700">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {/* Risks */}
                {report.risks.length > 0 && (
                    <Card className="bg-white/[0.02] border-white/5 print:bg-gray-50 print:border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-white print:text-black flex items-center gap-2">
                                <ExclamationTriangleIcon className="h-5 w-5 text-amber-400 print:text-amber-600" />
                                Risks & Challenges
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {report.risks.map((risk, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs flex-shrink-0">
                                            !
                                        </span>
                                        <span className="text-white/80 print:text-gray-700">{risk}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {/* Recommendations */}
                {report.recommendations.length > 0 && (
                    <Card className="bg-white/[0.02] border-white/5 print:bg-gray-50 print:border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-white print:text-black flex items-center gap-2">
                                <RocketIcon className="h-5 w-5 text-purple-400 print:text-purple-600" />
                                Recommendations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {report.recommendations.map((rec, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs flex-shrink-0">
                                            →
                                        </span>
                                        <span className="text-white/80 print:text-gray-700">{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {/* Footer */}
                <div className="text-center pt-8 border-t border-white/5 print:border-gray-200">
                    <p className="text-white/30 print:text-gray-400 text-sm">
                        Generated by AI Scrum Master • {new Date(report.generatedAt).toLocaleString()}
                    </p>
                </div>
            </main>
        </div>
    )
}
