import type { Route } from "next";

import { ROUTES } from "./routes";

type NavigationItem = {
  href: Route;
  labelKey: string;
};

const PUBLIC_NAV_ITEMS: readonly NavigationItem[] = [
  { href: ROUTES.feed, labelKey: "nav.feed" },
];

const PRIVATE_NAV_ITEMS: readonly NavigationItem[] = [
  { href: ROUTES.autoReplySettings, labelKey: "nav.autoReply" },
  { href: ROUTES.statistics, labelKey: "nav.statistics" },
];

export const toNavigationItems = (
  isAuthenticated: boolean,
): readonly NavigationItem[] =>
  isAuthenticated ? [...PUBLIC_NAV_ITEMS, ...PRIVATE_NAV_ITEMS] : PUBLIC_NAV_ITEMS;
