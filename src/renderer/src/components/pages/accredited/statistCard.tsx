import { cn } from '@renderer/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card'
import { Icon, Icons } from '@renderer/components/icons/icons'


type proptype = {
  title: string
  value: number
  subtitle: string
  icon: keyof typeof Icons
  className?: string
}

const StatistCard = ({ title, value, subtitle, icon, className }: proptype) => {

  const Icon = Icons[icon]
  return (
    <Card className={cn('shadow-lg border rounded-lg flex px-4  justify-between', className)}>
      <div className=" flex flex-col  items-center text-right mr-0 gap-0">
        <CardHeader className="text-right ">
          <span className="text-gray-600 text-sm text-right">{title}</span>
        </CardHeader>
        <CardContent className="text-right">
          <CardTitle className="text-xl font-bold text-blue-600">{value}</CardTitle>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </CardContent>
      </div>
      <div className="flex flex-col   items- mt-5">
        <Icon className="w-[40px] h-[40px]" />
      </div>
    </Card>
  )
}

export default StatistCard
