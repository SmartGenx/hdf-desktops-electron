import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/components/ui/tooltip'
import { cn } from '@renderer/lib/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NavItem } from '../../types/index'
import { Icons } from '../icons/icons'

interface DashboardNavProps {
  items: NavItem[]
  expanded?: boolean
}

export default function DashboardNav({ items, expanded = false }: DashboardNavProps) {
  const location = useLocation()
  const path = location.pathname
  const [expandedGroups, setExpandedGroups] = useState<{ [key: number]: boolean }>({})

  const toggleGroup = (index: number) => {
    setExpandedGroups((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const isSelected = (href: string) => {
    if (href === '/dashboard') {
      return path === href
    }
    
    return path === href
  }

  if (!items?.length) {
    return null
  }

  return (
    <nav className="grid items-start gap-6">
      {items.map((item, index) => (
        <div key={index}>
          {item.title && (
            <h5
              className={cn('mb-2 px-4 text-sm font-normal text-primary', !expanded && 'invisible')}
            >
              {item.title}
            </h5>
          )}
          {item.list.map((nav, i) => {
            const Icon = Icons[nav.icon || 'arrowRight']
            const isGroup =
              nav.type === 'group' && nav.href === '' && nav.subLinks && nav.subLinks.length > 0

            return (
              <div key={i}>
                <TooltipProvider delayDuration={0}>
                  <Tooltip disableHoverableContent>
                    <TooltipTrigger asChild>
                      {nav.href === '' ? (
                        <div
                          className={cn(
                            'group mb-1 flex items-center px-4 py-3 text-sm font-medium hover:bg-[#e6dcee] hover:text-[#8150AB] cursor-pointer',
                            nav.subLinks &&
                              nav.subLinks.filter((x) => isSelected(x.href)).length > 0
                              ? 'bg-[#e6dcee] text-[#8150AB] border-l-4 border-primary'
                              : 'transparent',
                            !expanded && 'justify-center',
                            nav.disabled && 'cursor-not-allowed opacity-80'
                          )}
                          onClick={(e) => {
                            if (nav.disabled) e.preventDefault()

                            isGroup && toggleGroup(i)
                          }}
                        >
                          <Icon className="mx-2 h-5 w-5" />
                          {expanded && (
                            <span className="min-w-max text-lg font-medium flex items-center justify-between w-full">
                              {nav.label}
                              {isGroup && (expandedGroups[i] ? <ChevronUp /> : <ChevronDown />)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={nav.href}
                          className={cn(
                            'group mb-1 flex items-center px-4 py-3 text-sm font-medium hover:bg-[#e6dcee] hover:text-[#8150AB] cursor-pointer',
                            isSelected(nav.href)
                              ? 'bg-[#e6dcee] text-[#8150AB] border-l-4 border-primary'
                              : 'transparent',
                            !expanded && 'justify-center',
                            nav.disabled && 'cursor-not-allowed opacity-80'
                          )}
                          onClick={(e) => {
                            if (nav.disabled) e.preventDefault()

                            isGroup && toggleGroup(i)
                          }}
                        >
                          <Icon className="mx-2 h-5 w-5" />
                          {expanded && (
                            <span className="min-w-max text-lg font-medium flex items-center justify-between w-full">
                              {nav.label}
                              {isGroup && <ChevronDown />}
                            </span>
                          )}
                        </Link>
                      )}
                    </TooltipTrigger>
                    {!expanded && (
                      <TooltipContent side="left">
                        <div>{nav.label}</div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                {isGroup && expandedGroups[i] && (
                  <div className="ms-4">
                    {nav.subLinks?.map((subLink, j) => (
                      <Link
                        key={j}
                        to={subLink.href}
                        className={cn(
                          ' mb-1 flex items-center gap-1 ps-8 py-3 text-sm font-medium hover:bg-[#e6dcee] hover:text-[#8150AB]',
                          'transparent',
                          subLink.disabled && 'cursor-not-allowed opacity-80',
                          !expanded && 'justify-center'
                        )}
                      >
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            isSelected(subLink.href) ? 'bg-primary' : 'bg-gray-600/75'
                          )}
                        ></div>{' '}
                        {subLink.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
