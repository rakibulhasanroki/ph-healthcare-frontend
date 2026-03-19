"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Calendar, Clock, Settings, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NotificationDropdownProps {
  id: string;
  title: string;
  message: string;
  type: "appointment" | "schedule" | "system" | "user";
  timestamp: Date;
  read: boolean;
}

const MOCK_NOTIFICATIONS: NotificationDropdownProps[] = [
  {
    id: "1",
    title: "New Appointment",
    message: "You have a new appointment",
    type: "appointment",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: "2",
    title: "New Schedule",
    message: "You have a new schedule",
    type: "schedule",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: false,
  },
  {
    id: "3",
    title: "System Notification",
    message: "A system notification",
    type: "system",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    read: false,
  },
];

const getNotifications = (type: NotificationDropdownProps["type"]) => {
  switch (type) {
    case "appointment":
      return <Calendar className="h-4 w-4" />;
    case "schedule":
      return <Clock className="h-4 w-4" />;
    case "system":
      return <Settings className="h-4 w-4" />;
    case "user":
      return <User className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
};

const NotificationDropdown = () => {
  const unreadNotifications = MOCK_NOTIFICATIONS.filter(
    (notification) => !notification.read,
  ).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full flex items-center justify-center text-[10px]"
              variant="destructive"
            >
              {unreadNotifications > 9 ? "9+" : unreadNotifications}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-center gap-2">
          Notifications
          {unreadNotifications > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadNotifications} unread
            </Badge>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <ScrollArea className="h-80">
          {MOCK_NOTIFICATIONS.length > 0 ? (
            MOCK_NOTIFICATIONS.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted transition"
              >
                <div className="mt-1 text-muted-foreground">
                  {getNotifications(notification.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{notification.title}</p>

                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground leading-snug">
                    {notification.message}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(notification.timestamp, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuLabel className="text-center py-6">
              No notifications
            </DropdownMenuLabel>
          )}
        </ScrollArea>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer justify-center font-medium">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
