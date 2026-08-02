"use client";

import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/auth/useAuth";
import { NavPill } from "@/components/NavPill";
import { toNavigationItems } from "@/constants/navigation";

export const AppNavigation = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  return (
    <nav
      aria-label={t("nav.ariaLabel")}
      className="hidden items-center gap-2 md:flex"
    >
      {toNavigationItems(isAuthenticated).map((item) => (
        <NavPill
          key={item.href}
          href={item.href}
          label={t(item.labelKey)}
          isActive={pathname === item.href}
        />
      ))}
    </nav>
  );
};
