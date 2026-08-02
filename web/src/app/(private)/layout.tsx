import type { ReactNode } from "react";

import { AppShell } from "@/parts/layout/AppShell";
import { AuthGuard } from "@/parts/layout/AuthGuard";

const PrivateLayout = ({ children }: { children: ReactNode }) => (
  <AppShell>
    <AuthGuard>{children}</AuthGuard>
  </AppShell>
);

export default PrivateLayout;
