export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  decisions: "/decisions",
  decisionsNew: "/decisions/new",
} as const;

export function decisionDetailPath(id: string) {
  return `/decisions/${id}`;
}

export const protectedRoutePrefixes = [routes.dashboard, "/decisions"] as const;

export const authRoutePrefixes = [routes.login, routes.register] as const;
