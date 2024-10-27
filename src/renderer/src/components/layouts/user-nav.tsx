import { ChevronDown } from 'lucide-react'
import { useAuthUser, useIsAuthenticated, useSignOut } from 'react-auth-kit'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { Avatar } from '../ui/avatar'
// import { Avatar } from '../ui/avatar'

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

  console.log('user', user)
  if (issAuthenticated()) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="justify-between w-44 border">
          <Button variant="ghost" className="relative flex gap-1">
            <Avatar className="" />
            {/* <img
              className="w-[35px] h-[35px]"
              src={}
              alt={auth?.name ?? 'Unknown User'}
            /> */}

            <div className="flex  space-y-1">
              <div>
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.role}</p>
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
          <DropdownMenuGroup>
            <DropdownMenuItem disabled>الملف الشخصي</DropdownMenuItem>
            <DropdownMenuItem disabled>الإعدادات</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>تسجيل الخروج</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  return null
}
