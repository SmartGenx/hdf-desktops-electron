// components/DashboardNav.tsx

import  { useEffect, useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/components/ui/tooltip'
import { cn } from '@renderer/lib/utils'
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
  const [user, setUser] = useState<{ role: string } | null>(null)

  useEffect(() => {
    const authState = localStorage.getItem('_auth_state')
    if (authState) {
      try {
        const authData = JSON.parse(authState)
        if (authData && authData.user) {
          setUser(authData.user)
        }
      } catch (error) {
        console.error('Error parsing auth state:', error)
      }
    }
  }, [])
  const signOut = useSignOut()
  const location = useLocation()
  const path = location.pathname

  const isSelected = (href: string) => {
    return path === href
  }

  if (!items?.length) {
    return null
  }

  const filterNavItemsByRole = (navItems: NavItem[]) => {
    return navItems
      .map((item) => {
        const filteredList = item.list.filter((nav) => {
          if (nav.roles) {
            return user && nav.roles.includes(user.role)
          }
          return true // If no roles specified, show to all users
        })
        if (filteredList.length === 0) {
          return null
        }
        return { ...item, list: filteredList }
      })
      .filter(Boolean) as NavItem[] // Remove nulls
  }

  const filteredItems = filterNavItemsByRole(items)
  const filteredItemSetting = filterNavItemsByRole(itemSetting)

  return (
    <>
      <nav className="grid items-start gap-6 overflow-x-hidden">
        {filteredItems.map((item, index) => (
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
                        <Link
                          to={nav.href}
                          className={cn(
                            'group mb-1 flex items-center px-4 py-2 rounded-lg mx-4 text-sm font-medium hover:bg-[#5483aa] hover:text-white cursor-pointer',
                            isSelected(nav.href) ? 'bg-[#e5f0ff] text-[#196CB0] ' : 'transparent',
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
                        </Link>
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
        <div className="mt-10">
          {filteredItemSetting.map((item, index) => (
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
                          <Link
                            to={nav.href}
                            className={cn(
                              'group mb-1 flex items-center px-4 py-3 text-sm font-medium hover:bg-[#196CB0] hover:text-white cursor-pointer',
                              isSelected(nav.href)
                                ? 'bg-[#196CB0] text-white border-l-4 border-primary'
                                : 'transparent',
                              !expanded && 'justify-center',
                              nav.disabled && 'cursor-not-allowed opacity-80'
                            )}
                            onClick={(e) => {
                              if (nav.disabled) e.preventDefault()
                              if (nav.label === 'تسجيل الخروج') {
                                signOut()
                              }
                            }}
                          >
                            <Icon className="mx-3 -translate-x-2 h-5 w-5" />
                            {expanded && (
                              <span className="min-w-max text-lg font-medium flex items-center justify-between w-full">
                                {nav.label}
                              </span>
                            )}
                          </Link>
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
