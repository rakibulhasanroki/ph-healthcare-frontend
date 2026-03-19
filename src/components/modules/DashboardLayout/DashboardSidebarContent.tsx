"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboardTypes";
import { UserInfo } from "@/types/user.types";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface DashboardSidebarContentProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardSidebarContent = ({
  userInfo,
  navItems,
  dashboardHome,
}: DashboardSidebarContentProps) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen border-r bg-background transition-all duration-300",
        collapsed ? "md:w-18" : "md:w-64",
      )}
    >
      {/* Top Logo + Toggle */}
      <div className="flex h-16 items-center border-b px-4 shrink-0 justify-between">
        {!collapsed && (
          <Link href={dashboardHome}>
            <span className="text-lg font-semibold tracking-tight text-primary">
              PH Healthcare
            </span>
          </Link>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="h-9 w-9 flex items-center justify-center rounded-md border hover:bg-accent transition"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
      </div>

      {/* Scrollable Nav */}
      <ScrollArea className="flex-1 min-h-0 px-2 py-5">
        <nav className="space-y-6">
          {navItems.map((section, sectionId) => (
            <div key={sectionId}>
              {!collapsed && section.title && (
                <h4 className="mb-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h4>
              )}

              <div className="space-y-1">
                {section.items.map((item, navItemId) => {
                  const isActive = pathname === item.href;
                  const Icon = getIconComponent(item.icon);

                  return (
                    <Link
                      href={item.href}
                      key={navItemId}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        collapsed && "justify-center px-2",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4.5 w-4.5",
                          isActive
                            ? "text-primary-foreground"
                            : "text-muted-foreground group-hover:text-foreground",
                        )}
                      />

                      {!collapsed && (
                        <span className="truncate">{item.title}</span>
                      )}
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

      {/* Bottom User */}
      <div className="border-t p-4 shrink-0 bg-background">
        <div
          className={cn(
            "rounded-xl bg-muted/40",
            collapsed
              ? "flex items-center justify-center p-2"
              : "flex items-center gap-3 p-3",
          )}
        >
          <div className="h-9 w-9 shrink-0 rounded-full bg-primary/15 flex items-center justify-center mx-auto">
            <span className="text-sm font-semibold text-primary">
              {userInfo?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>

          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate">{userInfo.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {userInfo?.role?.toLowerCase().replace("_", " ")}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebarContent;
