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
import { Icons } from '../icons/icons'
import { NavItem } from '@renderer/types'
import { Separator } from '../ui/separator'
import { useSignOut } from 'react-auth-kit'

interface DashboardNavProps {
  items: NavItem[]
  expanded?: boolean
  itemSetting: NavItem[]
}

export default function DashboardNav({ items, expanded = true, itemSetting }: DashboardNavProps) {
  const signOut = useSignOut()
  const location = useLocation()
  const path = location.pathname

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
    <>
      <nav className="grid items-start gap-6">
        {items.map((item, index) => (
          <div key={index}>
            {item.title && (
              <h5
                className={cn(
                  'mb-2 px-4 text-sm font-normal text-primary',
                  !expanded && 'invisible'
                )}
              >
                {item.title}
              </h5>
            )}
            {item.list.map((nav, i) => {
              const Icon = Icons[nav.icon || 'arrowRight']

              return (
                <div key={i}>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip disableHoverableContent>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            'group mb-1 flex items-center px-4 py-3 text-sm font-medium hover:bg-[#196CB0] hover:text-white cursor-pointer ',
                            isSelected(nav.href)
                              ? 'bg-[#196CB0] text-white border-l-4 border-primary'
                              : 'transparent',
                            !expanded && 'justify-center',
                            nav.disabled && 'cursor-not-allowed opacity-80'
                          )}
                          onClick={(e) => {
                            if (nav.disabled) e.preventDefault()
                          }}
                        >
                          <Icon className="mx-2 h-5 w-5" />
                          {expanded && (
                            <span className="min-w-max text-lg font-medium flex items-center justify-between w-full">
                              {nav.label}
                            </span>
                          )}
                        </div>
                      </TooltipTrigger>
                      {!expanded && (
                        <TooltipContent side="left">
                          <div>{nav.label}</div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )
            })}
            <Separator className="mt-6 " />
          </div>
        ))}
        <div className="mt-28">
          {itemSetting.map((item, index) => (
            <div key={index}>
              {item.title && (
                <h5
                  className={cn(
                    'mb-2 px-4 text-sm font-normal text-primary',
                    !expanded && 'invisible'
                  )}
                >
                  {item.title}
                </h5>
              )}
              {item.list.map((nav, i) => {
                const Icon = Icons[nav.icon || 'arrowRight']

                return (
                  <div key={i}>
                    <TooltipProvider delayDuration={0}>
                      <Tooltip disableHoverableContent>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              'group mb-1 flex items-center px-4 py-3 text-sm font-medium hover:bg-[#196CB0] hover:text-white cursor-pointer ',
                              isSelected(nav.href)
                                ? 'bg-[#196CB0] text-white border-l-4 border-primary'
                                : 'transparent',
                              !expanded && 'justify-center',
                              nav.disabled && 'cursor-not-allowed opacity-80'
                            )}
                            onClick={(e) => {
                              if (nav.disabled) e.preventDefault()
                            }}
                          >
                            <Icon className="mx-2 h-5 w-5" />
                            {expanded && (
                              <span
                                onClick={nav.label == 'تسجيل الخروج' ? () => signOut() : () => {}}
                                className="min-w-max text-lg font-medium flex items-center justify-between w-full"
                              >
                                {nav.label}
                              </span>
                            )}
                          </div>
                        </TooltipTrigger>
                        {!expanded && (
                          <TooltipContent side="left">
                            <div>{nav.label}</div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </nav>
    </>
  )
}
