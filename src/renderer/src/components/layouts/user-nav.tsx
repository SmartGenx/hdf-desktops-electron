// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown } from 'lucide-react'
import {  useIsAuthenticated, useSignOut } from 'react-auth-kit'
// import { useAuthUser, useIsAuthenticated, useSignOut } from 'react-auth-kit'
// import userIcon from '../icons/user.svg'
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
  // const auth = useAuthUser()

  if (issAuthenticated()) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="justify-between w-44 border">
          <Button variant="ghost" className="relative flex gap-1">
            {/* <Avatar className=''/> */}
            {/* <img
              className="w-[35px] h-[35px]"
              src={auth?.user?.image ?? userIcon}
              alt={auth?.user?.name ?? 'Unknown User'}
            />

            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {auth?.user?.name ?? 'Unknown User'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {auth?.user?.name ?? 'Unknown User'}
              </p>
            </div> */}
            <ChevronDown size={15} />
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
