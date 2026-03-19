import { getDefaultDashboardRoute, UserRole } from "./authUtils";
import { NavSection } from "@/types/dashboardTypes";

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboardRoute = getDefaultDashboardRoute(role);
  return [
    {
      items: [
        {
          title: "Home",
          href: "/",
          icon: "Home",
        },
        {
          title: "Dashboard",
          href: defaultDashboardRoute,
          icon: "LayoutDashboard",
        },
        {
          title: "My Profile",
          href: "/my-profile",
          icon: "User",
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Change Password",
          href: "/change-password",
          icon: "Settings",
        },
      ],
    },
  ];
};

export const doctorNavItems: NavSection[] = [
  {
    title: "Patient Management",
    items: [
      {
        title: "Appointments",
        href: "/doctor/dashboard/appointments",
        icon: "Calendar",
      },
      {
        title: "My Schedule",
        href: "/doctor/dashboard/my-schedules",
        icon: "Clock",
      },
      {
        title: "Prescriptions",
        href: "/doctor/dashboard/prescriptions",
        icon: "FileText",
      },
      {
        title: "Reviews",
        href: "/doctor/dashboard/my-reviews",
        icon: "Star",
      },
    ],
  },
];

export const adminNavItems: NavSection[] = [
  {
    title: "User Management",
    items: [
      {
        title: "Admins",
        href: "/admin/dashboard/admins-management",
        icon: "Shield",
      },
      {
        title: "Doctors",
        href: "/admin/dashboard/doctors-management",
        icon: "Stethoscope",
      },
      {
        title: "Patients",
        href: "/admin/dashboard/patients-management",
        icon: "Users",
      },
    ],
  },
  {
    title: "Hospital management",
    items: [
      {
        title: "Appointments",
        href: "/admin/dashboard/appointments-management",
        icon: "Calendar",
      },
      {
        title: "Schedules",
        href: "/admin/dashboard/schedules-management",
        icon: "Clock",
      },
      {
        title: "Specialties",
        href: "/admin/dashboard/specialties-management",
        icon: "Hospital",
      },
      {
        title: "Doctor Schedules",
        href: "/admin/dashboard/doctor-schedules-management",
        icon: "Clock",
      },
      {
        title: "Doctor Specialties",
        href: "/admin/dashboard/doctor-specialties-management",
        icon: "Hospital",
      },
      {
        title: "Payments",
        href: "/admin/dashboard/payments-management",
        icon: "CreditCard",
      },
      {
        title: "Prescriptions",
        href: "/admin/dashboard/prescriptions-management",
        icon: "FileText",
      },
      {
        title: "Reviews",
        href: "/admin/dashboard/reviews-management",
        icon: "Star",
      },
    ],
  },
];

export const patientNavItems: NavSection[] = [
  {
    title: "Appointments",
    items: [
      {
        title: "Appointments",
        href: "/dashboard/my-appointments",
        icon: "Calendar",
      },
      {
        title: "Book Appointment",
        href: "/dashboard/book-appointment",
        icon: "ClipboardList",
      },
    ],
  },
  {
    title: "Medical Record",
    items: [
      {
        title: "Health Record",
        href: "/dashboard/health-record",
        icon: "FileText",
      },
      {
        title: "Prescriptions",
        href: "/dashboard/my-prescriptions",
        icon: "FileText",
      },
    ],
  },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return [...commonNavItems, ...adminNavItems];
    case "DOCTOR":
      return [...commonNavItems, ...doctorNavItems];
    case "PATIENT":
      return [...commonNavItems, ...patientNavItems];
    default:
      return commonNavItems;
  }
};
