import { Icon } from '@/components/ui/icon'

interface TrendIndicatorProps {
  trend?: "up" | "down" | "stable"
  size?: "sm" | "md"
  showIcon?: boolean
  showText?: boolean
}

export function TrendIndicator({ trend, size = "sm", showIcon = true, showText = false }: TrendIndicatorProps) {
  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4"

  const config = {
    up: { icon: (props: any) => <Icon name="trendingUp" {...props} />, color: "text-[var(--ds-status-success)]", text: "Improving" },
    down: { icon: (props: any) => <Icon name="trendingDown" {...props} />, color: "text-[var(--ds-status-error)]", text: "Declining" },
    stable: { icon: (props: any) => <Icon name="minus" {...props} />, color: "text-gray-400", text: "Stable" },
  }

  const { icon: Icon, color, text } = config[trend || "stable"]

  return (
    <div className="flex items-center gap-1">
      {showIcon && <Icon className={`${iconSize} ${color}`} />}
      {showText && <span className={`text-xs font-medium ${color}`}>{text}</span>}
    </div>
  )
}
