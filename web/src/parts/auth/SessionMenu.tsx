"use client";

import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/auth/useAuth";
import { NavPill } from "@/components/NavPill";
import { PillButton } from "@/components/PillButton";
import { ROUTES } from "@/constants/routes";

type SessionMenuProps = {
  onAfterAction?: () => void;
};

export const SessionMenu = ({ onAfterAction }: SessionMenuProps) => {
  const { t } = useTranslation("auth");
  const pathname = usePathname();
  const { userId, isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated) {
    return (
      <NavPill
        href={ROUTES.signIn}
        label={t("signIn.cta")}
        isActive={pathname === ROUTES.signIn}
        onNavigate={onAfterAction}
      />
    );
  }

  const endSessionAndClose = () => {
    signOut();
    onAfterAction?.();
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-secondary text-meta">{t("session.user", { id: userId })}</span>
      <PillButton
        label={t("session.signOut")}
        ariaLabel={t("session.signOut")}
        onClick={endSessionAndClose}
      />
    </div>
  );
};
