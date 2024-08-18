import { cn } from '../../lib/utils'
// import { LucideIcon } from "lucide-react";

type StatisticCardProps = {
  title?: string
  total?: number
  icon?: any
  handleClick?: () => void
  className?: string
  iconClassName?: string
  iconWrapperClassName?: string
}

const StatisticCard = ({
  title,
  total,
  icon: Icon,
  handleClick,
  className,
  iconClassName,
  iconWrapperClassName
}: StatisticCardProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-start gap-5 rounded-[8px] bg-background p-4 shadow-lg  ',
        className,
        {
          'cursor-pointer': handleClick
        }
      )}
      onClick={handleClick}
    >
      {Icon && (
        <div className={`rounded-full p-4 ${iconWrapperClassName}`}>
          <Icon className={iconClassName} size={40} />
        </div>
      )}
      <div className="text-nowrap">
        <h1 className="text-[32px] font-bold">{total?.toLocaleString()}</h1>
        <p className="text-nowrap text-sm font-bold">{title}</p>
      </div>
    </div>
  )
}

export default StatisticCard
