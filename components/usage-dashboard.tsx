"use client"

import { useState, useEffect } from "react"
import { getUsageStats, resetUsageStats } from "@/lib/usage-tracker"
import { RotateCcw, ChevronDown, ChevronUp } from "lucide-react"

export function UsageDashboard() {
  const [stats, setStats] = useState<ReturnType<typeof getUsageStats> | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const loadStats = () => {
      setStats(getUsageStats())
    }
    loadStats()

    // Refresh stats periodically
    const interval = setInterval(loadStats, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all usage statistics?")) {
      setStats(resetUsageStats())
    }
  }

  if (!stats) {
    return null
  }

  return (
    <div className="border-t bg-card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary transition-colors"
      >
        <span className="text-sm font-semibold text-foreground">Usage Stats</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 py-4 space-y-4 border-t">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Total Queries</p>
              <p className="text-2xl font-bold text-primary">{stats.totalQueries}</p>
            </div>
            <div className="bg-background rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Tokens Used</p>
              <p className="text-2xl font-bold text-primary">
                {Math.round(stats.totalTokensUsed)}
              </p>
            </div>
            <div className="bg-background rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Avg Response</p>
              <p className="text-2xl font-bold text-primary">
                {Math.round(stats.averageResponseTime)}ms
              </p>
            </div>
            <div className="bg-background rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Total Time</p>
              <p className="text-2xl font-bold text-primary">
                {Math.round(stats.totalResponseTime / 1000)}s
              </p>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg bg-background hover:bg-secondary transition-colors text-foreground"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Stats
          </button>
        </div>
      )}
    </div>
  )
}
