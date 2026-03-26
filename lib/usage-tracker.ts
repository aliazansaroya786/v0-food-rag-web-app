export interface UsageStats {
  totalQueries: number
  totalTokensUsed: number
  totalResponseTime: number
  averageResponseTime: number
  queriesByDay: Record<string, number>
  lastUpdated: number
}

const STORAGE_KEY = "food-rag-usage"

export function initializeUsageStats(): UsageStats {
  return {
    totalQueries: 0,
    totalTokensUsed: 0,
    totalResponseTime: 0,
    averageResponseTime: 0,
    queriesByDay: {},
    lastUpdated: Date.now(),
  }
}

export function getUsageStats(): UsageStats {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (err) {
    console.error("Failed to load usage stats:", err)
  }
  return initializeUsageStats()
}

export function trackQuery(
  tokensUsed: number,
  responseTimeMs: number
): UsageStats {
  const stats = getUsageStats()

  stats.totalQueries += 1
  stats.totalTokensUsed += tokensUsed
  stats.totalResponseTime += responseTimeMs
  stats.averageResponseTime =
    stats.totalResponseTime / stats.totalQueries

  // Track by day
  const today = new Date().toISOString().split("T")[0]
  stats.queriesByDay[today] = (stats.queriesByDay[today] || 0) + 1

  stats.lastUpdated = Date.now()

  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  return stats
}

export function resetUsageStats(): UsageStats {
  const newStats = initializeUsageStats()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats))
  return newStats
}

export function getLastSevenDaysStats(): Array<{
  date: string
  queries: number
}> {
  const stats = getUsageStats()
  const result = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    result.push({
      date: dateStr,
      queries: stats.queriesByDay[dateStr] || 0,
    })
  }

  return result
}
