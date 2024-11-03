import { cn } from '@renderer/lib/utils'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

type PropsType = {
  title: string
  href?: string
  className?: string
}

const CreateBtn = ({ title, href = 'new', className }: PropsType) => {
  return (
    <Link
      to={href}
      className={cn(
        'flex items-center justify-center gap-2 bg-primary text-white p-3 rounded-lg hover:bg-[#ca8c2a] transition ease-in-out duration-300',
        className
      )}
    >
      {title}
      <Plus />
    </Link>
  )
}

export default CreateBtn
