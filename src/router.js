import { Router } from "@vaadin/router";

export const routes = [
  { path: "/", component: "page-home" },
  { path: "/login", component: "page-login" },
  { path: "(.*)", component: "page-not-found" },
];

export function initRouter(outlet) {
  const router = new Router(outlet);
  router.setRoutes(routes);
  return router;
}
