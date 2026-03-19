import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserInfo } from "@/types/user.types";
import { User } from "lucide-react";
import Link from "next/link";

interface UserDropdownProps {
  userInfo: UserInfo;
}

const UserDropdown = ({ userInfo }: UserDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-9 w-9 flex items-center justify-center cursor-pointer"
        >
          <span className="text-sm font-semibold">
            {userInfo?.name?.charAt(0).toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-60 rounded-xl p-2"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal px-2 py-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold truncate">{userInfo.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {userInfo.email}
            </p>
            <p className="text-[11px] text-muted-foreground capitalize">
              {userInfo?.role?.toLowerCase()?.replace("_", " ")}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer rounded-md px-2 py-2 focus:bg-muted">
          <Link href="/my-profile" className="flex items-center gap-2 w-full">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">My Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer rounded-md px-2 py-2 focus:bg-muted">
          <Link
            href="/change-password"
            className="flex items-center gap-2 w-full"
          >
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Change Password</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer rounded-md px-2 py-2 text-red-600 focus:bg-red-50">
          <Link href="/logout" className="flex items-center gap-2 w-full">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">Logout</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
