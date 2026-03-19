import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

export const getIconComponent = (icon: string): LucideIcon => {
  const IconComponent = Icons[icon as keyof typeof Icons];
  if (!IconComponent) {
    return Icons.HelpCircle;
  }
  return IconComponent as LucideIcon;
};
