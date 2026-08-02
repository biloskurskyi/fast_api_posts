import type { ReactNode } from "react";

import { AppShell } from "@/parts/layout/AppShell";

const PublicLayout = ({ children }: { children: ReactNode }) => (
  <AppShell>{children}</AppShell>
);

export default PublicLayout;
