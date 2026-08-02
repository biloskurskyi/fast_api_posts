import { Suspense, type ReactNode } from "react";

import { NoticeBanner } from "@/parts/feedback/NoticeBanner";
import { SessionExpiredToast } from "@/parts/feedback/SessionExpiredToast";

import { AppHeader } from "./AppHeader";

type AppShellProps = {
  children: ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => (
  <div className="flex min-h-dvh flex-col">
    <AppHeader />
    <Suspense>
      <NoticeBanner />
    </Suspense>
    <main className="flex-1">{children}</main>
    <SessionExpiredToast />
  </div>
);
