export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export const formatFullDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const formatCurrency = (amount: number) => `₹${amount}`

export const formatOrdinal = (num: number) => {
  const suffixes = ["th", "st", "nd", "rd"]
  const v = num % 100
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}

export const timeToPercentage = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number)
  const totalMinutes = hours * 60 + minutes
  const dayMinutes = 24 * 60
  return ((dayMinutes - totalMinutes) / dayMinutes) * 100
}
