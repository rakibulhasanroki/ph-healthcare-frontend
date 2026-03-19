"use client";

import { NavSection } from "@/types/dashboardTypes";
import { UserInfo } from "@/types/user.types";
import { useEffect, useState } from "react";
import DashboardMobileSidebar from "./DashboardMobileSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";

interface DashboardNavbarContentProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardNavbarContent = ({
  userInfo,
  navItems,
  dashboardHome,
}: DashboardNavbarContentProps) => {
  const [isOPen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const checkSmallScreen = () => {
      if (window.innerWidth < 768) {
        setIsMobileOpen(true);
      } else {
        setIsMobileOpen(false);
      }
    };

    checkSmallScreen();

    window.addEventListener("resize", checkSmallScreen);

    return () => {
      window.removeEventListener("resize", checkSmallScreen);
    };
  }, []);

  return (
    <div className="w-full border-b">
      <div className="flex items-center w-full gap-3 p-3.5">
        {/* mobile sidebar */}
        <Sheet open={isOPen && isMobileOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-64 p-0 flex flex-col bg-background overflow-hidden"
          >
            <DashboardMobileSidebar
              userInfo={userInfo}
              navItems={navItems}
              dashboardHome={dashboardHome}
            />
          </SheetContent>
        </Sheet>

        {/* search */}
        <div className="flex-1 flex items-center justify-start">
          <div className="relative w-full max-w-md hidden sm:block">
            <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search..."
              className="pl-9 pr-4 h-9"
              type="text"
            />
          </div>
        </div>

        {/* notification */}
        <NotificationDropdown />

        {/* user dropdown */}
        <UserDropdown userInfo={userInfo} />
      </div>
    </div>
  );
};

export default DashboardNavbarContent;
