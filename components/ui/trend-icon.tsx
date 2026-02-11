import { Icon } from '@/components/ui/icon'

interface TrendIconProps {
  trend?: "up" | "down" | "stable"
  size?: "sm" | "md"
}

export function TrendIcon({ trend, size = "sm" }: TrendIconProps) {
  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4"

  switch (trend) {
    case "up":
      return <Icon name="trendingUp" className={`${iconSize} text-[var(--ds-status-success)]`} />
    case "down":
      return <Icon name="trendingDown" className={`${iconSize} text-[var(--ds-status-error)]`} />
    default:
      return <Icon name="minus" className={`${iconSize} text-gray-400`} />
  }
}
