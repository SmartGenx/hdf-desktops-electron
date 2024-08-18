import { cn } from '@renderer/lib/utils'
interface SidebarToggleIconProps {
  expanded: boolean
  setExpanded: (value: boolean) => void
}

const SidebarToggleIcon = ({ expanded, setExpanded }: SidebarToggleIconProps) => {
  return (
    <span
      onClick={() => setExpanded(!expanded)}
      className="group absolute -left-5 top-1/2 z-20 hidden cursor-pointer flex-col p-2 sm:flex"
    >
      <span
        className={cn(
          'h-[14px] w-1 origin-bottom translate-y-[2px] rounded-sm bg-slate-400 transition-all ease-in-out',
          expanded ? 'group-hover:-rotate-[25deg]' : 'group-hover:rotate-[25deg]'
        )}
      />
      <span
        className={cn(
          'h-[14px] w-1 origin-top -translate-y-[2px] rounded-sm bg-slate-400 transition-all ease-in-out',
          expanded ? 'group-hover:rotate-[25deg]' : 'group-hover:-rotate-[25deg]'
        )}
      />
    </span>
  )
}

export default SidebarToggleIcon
