import { SESSION_STORAGE_KEYS } from "./constants"

export const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-400"
  if (score >= 60) return "text-yellow-400"
  return "text-red-400"
}

export const getScoreEmoji = (score: number) => {
  if (score >= 90) return "🔥"
  if (score >= 80) return "✨"
  if (score >= 70) return "👍"
  if (score >= 60) return "👌"
  return "💡"
}

export const clearSessionStorage = () => {
  Object.values(SESSION_STORAGE_KEYS).forEach(key => {
    sessionStorage.removeItem(key)
  })
}

export const smoothScrollToElement = (element: HTMLElement | null, offset = 100) => {
  if (!element) return
  
  const currentScroll = window.scrollY
  const elementTop = element.offsetTop - offset
  
  // Only scroll down, never up
  if (elementTop > currentScroll) {
    window.scrollTo({
      top: elementTop,
      behavior: "smooth",
    })
  }
}

export const calculatePotentialScore = (currentScore: number) => {
  return Math.min(95, currentScore + Math.floor(Math.random() * 20) + 10)
}