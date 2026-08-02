import type { ReactNode } from "react";

import { AppHeader } from "./AppHeader";

type AppShellProps = {
  children: ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => (
  <div className="flex min-h-dvh flex-col">
    <AppHeader />
    <main className="flex-1">{children}</main>
  </div>
);
