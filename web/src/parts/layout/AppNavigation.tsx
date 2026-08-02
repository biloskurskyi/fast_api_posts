"use client";

import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

import { NavPill } from "@/components/NavPill";
import { PUBLIC_NAV_ITEMS } from "@/constants/navigation";

export const AppNavigation = () => {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("nav.ariaLabel")}
      className="hidden items-center gap-2 md:flex"
    >
      {PUBLIC_NAV_ITEMS.map((item) => (
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
