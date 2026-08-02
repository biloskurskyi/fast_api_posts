"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { FOCUS_RING } from "@/components/controlStyles";
import { ROUTES } from "@/constants/routes";
import { SessionMenu } from "@/parts/auth/SessionMenu";

import { AppNavigation } from "./AppNavigation";
import { MobileNavigationMenu } from "./MobileNavigationMenu";
import { ServerHealthDot } from "./ServerHealthDot";
import { ServerHealthLabel } from "./ServerHealthLabel";
import { ThemeToggle } from "./ThemeToggle";

export const AppHeader = () => {
  const { t } = useTranslation();

  return (
    <header className="bg-raised shadow-e1 sticky top-0 z-10">
      <div className="px-gutter flex items-center justify-between gap-4 py-3">
        <Link
          href={ROUTES.feed}
          className={`text-title rounded-md font-serif font-semibold ${FOCUS_RING}`}
        >
          {t("app.name")}
        </Link>
        <AppNavigation />
        <div className="flex items-center gap-3">
          <ServerHealthDot />
          <span className="hidden md:inline">
            <ServerHealthLabel />
          </span>
          <ThemeToggle />
          <span className="hidden md:inline">
            <SessionMenu />
          </span>
          <MobileNavigationMenu />
        </div>
      </div>
    </header>
  );
};
