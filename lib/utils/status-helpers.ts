export const getPainScaleColor = (scale: number) => {
  if (scale <= 3) return "text-green-600 bg-green-100"
  if (scale <= 6) return "text-yellow-600 bg-yellow-100"
  return "text-red-600 bg-red-100"
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Normal":
      return "bg-green-100 text-green-700 border-green-200"
    case "Good":
      return "bg-blue-100 text-blue-700 border-blue-200"
    case "Needs Attention":
      return "bg-yellow-100 text-yellow-700 border-yellow-200"
    case "Critical":
      return "bg-red-100 text-red-700 border-red-200"
    case "High":
      return "text-red-600"
    case "Low":
      return "text-orange-600"
    default:
      return "text-green-600"
  }
}

export const getTrendIcon = (trend?: "up" | "down" | "stable") => {
  switch (trend) {
    case "up":
      return "TrendingUp"
    case "down":
      return "TrendingDown"
    default:
      return "Minus"
  }
}
