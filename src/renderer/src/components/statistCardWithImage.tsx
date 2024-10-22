import { cn } from '@renderer/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
// Removed Icons import since we're using <img> now

type StatistCardProps = {
  title: string
  value?: number

  image: string // URL or path to the image
  className?: string
}

const StatistCardWithImage = ({ title, value = 0, image, className }: StatistCardProps) => {
  return (
    <Card
      className={cn(
        'shadow-lg border rounded-lg flex px-4 justify-between items-center',
        className
      )}
    >
      {/* Text Section */}
      <div className="flex flex-col items-start text-right  ">
        <CardHeader>
          <span className="text-gray-600 text-sm">{title}</span>
        </CardHeader>
        <CardContent>
          <CardTitle className="text-xl font-bold text-blue-600">{value}</CardTitle>
        </CardContent>
      </div>

      {/* Image Section */}
      <div className="flex items-center">
        <img src={image} alt={title} className="w-10 h-10 object-contain" />
      </div>
    </Card>
  )
}

export default StatistCardWithImage
