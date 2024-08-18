import { Loader2 } from 'lucide-react'

const Loader = ({ size, color }: { size?: number; color: string }) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Loader2 className="animate-sining" color={color} size={size || 30} />
    </div>
  )
}

export default Loader
