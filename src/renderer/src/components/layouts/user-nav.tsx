import { ChevronDown } from 'lucide-react'
import { useAuthUser, useIsAuthenticated, useSignOut } from 'react-auth-kit'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { Avatar } from '../ui/avatar'

export type userData = {
  user: {
    name: string
    image: string
    id: number
  }
}

export default function UserNav() {
  const issAuthenticated = useIsAuthenticated()
  const signOut = useSignOut()
  const authUser = useAuthUser()
  const user = authUser()

  if (issAuthenticated()) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="justify-end w-44 border">
          <Button variant="ghost" className="relative flex gap-1">
            <Avatar className="" />
          
            <div className="flex  space-y-1 ">
              <div>
                <p className="text-base leading-none text-muted-foreground">
                  {user?.role === 'Admin'
                    ? 'مدير'
                    : user?.role === 'Coordinator'
                      ? 'منسق'
                      : user?.role === 'Pharmacist'
                        ? 'صيدلاني'
                        : ''}
                </p>
                <p className="text-xs font-medium leading-none">{user?.email}</p>
              </div>
              <div>
                <ChevronDown size={15} />
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal"></DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>تسجيل الخروج</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  return null
}
