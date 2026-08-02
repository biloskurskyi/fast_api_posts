"use client";

import { usePathname } from "next/navigation";
import { Popover } from "radix-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/auth/useAuth";
import { FOCUS_RING } from "@/components/controlStyles";
import { MenuIcon } from "@/components/MenuIcon";
import { NavPill } from "@/components/NavPill";
import { toNavigationItems } from "@/constants/navigation";
import { SessionMenu } from "@/parts/auth/SessionMenu";

import { ServerHealthLabel } from "./ServerHealthLabel";
import { ThemeToggle } from "./ThemeToggle";

export const MobileNavigationMenu = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger
        aria-label={isOpen ? t("menu.close") : t("menu.open")}
        className={`size-touch text-text hover:bg-hover-tint inline-flex items-center justify-center rounded-md transition-colors duration-120 md:hidden ${FOCUS_RING}`}
      >
        <MenuIcon />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="bg-raised shadow-e2 flex w-56 flex-col gap-2 rounded-lg p-3"
        >
          <nav aria-label={t("nav.ariaLabel")} className="flex flex-col gap-1">
            {toNavigationItems(isAuthenticated).map((item) => (
              <NavPill
                key={item.href}
                href={item.href}
                label={t(item.labelKey)}
                isActive={pathname === item.href}
                onNavigate={closeMenu}
              />
            ))}
          </nav>
          <SessionMenu onAfterAction={closeMenu} />
          <ThemeToggle onAfterToggle={closeMenu} />
          <ServerHealthLabel />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
