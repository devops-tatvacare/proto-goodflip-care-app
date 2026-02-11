export const getStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    Complete: "bg-green-100 text-green-700 border-green-200",
    "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
    Upcoming: "bg-orange-100 text-orange-700 border-orange-200",
    Normal: "bg-green-100 text-green-700",
    Good: "bg-blue-100 text-blue-700",
    "Needs Attention": "bg-red-100 text-red-700",
  }
  return statusMap[status] || "bg-gray-100 text-gray-700 border-gray-200"
}

export const getBatteryColor = (level?: number) => {
  if (!level) return "text-gray-400"
  if (level > 60) return "text-green-500"
  if (level > 30) return "text-yellow-500"
  return "text-red-500"
}

export const getPainScaleColor = (scale: number) => {
  if (scale <= 3) return "text-green-600 bg-green-100"
  if (scale <= 6) return "text-yellow-600 bg-yellow-100"
  return "text-red-600 bg-red-100"
}
