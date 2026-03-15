export type UserRole = "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";

export const authRoutes = [
  "/login",
  "/register",
  "/verify-email",
  "/forget-password",
  "/reset-password",
];

export const isAuthRoute = (path: string) => {
  return authRoutes.some((route) => route === path);
};

export type RouteConfig = {
  exact: string[];
  pattern: RegExp[];
};

export const patientProtectedRoutes: RouteConfig = {
  pattern: [/^\/dashboard/],
  exact: ["/payment/success"],
};

export const commonProtectedRoutes: RouteConfig = {
  pattern: [],
  exact: ["/my-profile", "/change-password"],
};

export const doctorProtectedRoutes: RouteConfig = {
  pattern: [/^\/doctor\/dashboard/],
  exact: [],
};

export const adminOrSuperAdminProtectedRoutes: RouteConfig = {
  pattern: [/^\/admin\/dashboard/],
  exact: [],
};

export const isRouteMatch = (path: string, routes: RouteConfig) => {
  if (routes.exact.some((route) => route === path)) {
    return true;
  }
  return routes.pattern.some((pattern) => pattern.test(path));
};

export const getRouteOwner = (
  path: string,
): "ADMIN" | "PATIENT" | "DOCTOR" | "SUPER_ADMIN" | "COMMON" | null => {
  if (isRouteMatch(path, patientProtectedRoutes)) {
    return "PATIENT";
  }
  if (isRouteMatch(path, commonProtectedRoutes)) {
    return "COMMON";
  }
  if (isRouteMatch(path, doctorProtectedRoutes)) {
    return "DOCTOR";
  }

  if (isRouteMatch(path, adminOrSuperAdminProtectedRoutes)) {
    return "ADMIN";
  }
  return null;
};

export const getDefaultDashboardRoute = (role: UserRole) => {
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return "/admin/dashboard";
  }
  if (role === "PATIENT") {
    return "/dashboard";
  }
  if (role === "DOCTOR") {
    return "/doctor/dashboard";
  }
  return "/";
};

export const isValidRedirectForRole = (role: UserRole, path: string) => {
  const unifySuperAdminAndAdmin = role === "SUPER_ADMIN" ? "ADMIN" : role;

  role = unifySuperAdminAndAdmin;
  const routeOwner = getRouteOwner(path);
  if (routeOwner === role) {
    return true;
  }
  if (routeOwner === "COMMON" || routeOwner === null) {
    return true;
  }
  return false;
};
