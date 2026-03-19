"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SheetTitle } from "@/components/ui/sheet";
import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboardTypes";
import { UserInfo } from "@/types/user.types";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardMobileSidebarProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardMobileSidebar = ({
  userInfo,
  navItems,
  dashboardHome,
}: DashboardMobileSidebarProps) => {
  const pathName = usePathname();

  return (
    <div className="flex h-full flex-col min-h-0">
      <div className="sr-only">
        <SheetTitle>Navigation Menu</SheetTitle>
      </div>

      {/* logo */}
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <Link href={dashboardHome}>
          <span className="text-lg font-semibold text-primary">
            PH Healthcare
          </span>
        </Link>
      </div>

      {/* scroll area */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full px-3 py-4">
          <nav className="space-y-4">
            {navItems.map((section, sectionId) => (
              <div key={sectionId}>
                {section.title && (
                  <h4 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {section.title}
                  </h4>
                )}

                <div className="space-y-1">
                  {section.items.map((item, itemId) => {
                    const isActive = item.href === pathName;
                    const Icon = getIconComponent(item.icon);

                    return (
                      <Link
                        href={item.href}
                        key={itemId}
                        className={cn(
                          "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        <Icon className="mr-2 h-4 w-4 shrink-0" />
                        <span className="flex-1 truncate">{item.title}</span>
                      </Link>
                    );
                  })}
                </div>

                {sectionId < navItems.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </div>

      {/* user */}
      <div className="border-t p-4 shrink-0 bg-background">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <div className="h-9 w-9 shrink-0 rounded-full bg-primary/15 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {userInfo?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>

          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">{userInfo.name}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {userInfo.role.toLowerCase().replace("_", " ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMobileSidebar;
