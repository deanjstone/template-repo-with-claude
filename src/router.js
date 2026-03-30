import { Router } from "@vaadin/router";
import { getSession } from "./services/auth.js";

export const routes = [
  {
    path: "/",
    component: "page-home",
    action: async (_context, commands) => {
      const session = await getSession();
      if (!session) return commands.redirect("/login");
    },
  },
  {
    path: "/login",
    component: "page-login",
    action: async (_context, commands) => {
      const session = await getSession();
      if (session) return commands.redirect("/");
    },
  },
  { path: "(.*)", component: "page-not-found" },
];

export function initRouter(outlet) {
  const router = new Router(outlet);
  router.setRoutes(routes);
  return router;
}
