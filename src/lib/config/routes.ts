export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  decisionsNew: "/decisions/new",
} as const;

export const protectedRoutePrefixes = [routes.dashboard, "/decisions"] as const;

export const authRoutePrefixes = [routes.login, routes.register] as const;
