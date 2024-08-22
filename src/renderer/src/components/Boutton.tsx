import React from 'react'
import { Button } from './ui/button' // Assuming you have a Button component in your ShadCN setup
// import { Filter } from 'lucide-react' // Importing the filter icon
import { Icons } from '@renderer/components/icons/icons'
import { cn } from '@renderer/lib/utils'
type Props = {
  icon?: keyof typeof Icons
  title?: string
  className?: string
  onClick?: () => void
}

const Boutton = ({ icon, title, className}: Props) => {
  const Icon = icon ? Icons[icon] : undefined
  return (
    <Button

      className={cn(
        'flex items-center justify-center w-[120px] bg-[#196CB0] text-white rounded-lg px-4 py-2 hover:bg-[#346186] focus:outline-none focus:ring-2 focus:ring-blue-300',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        {Icon && <Icon className="w-5 h-5" />}
        <span className="">{title}</span>
      </div>
    </Button>
  )
}

export default Boutton
