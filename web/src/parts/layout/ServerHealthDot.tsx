"use client";

import { StatusDot } from "@/components/StatusDot";
import { useHealthQueries } from "@/hooks/queries/useHealthQueries";

export const ServerHealthDot = () => {
  const { serverStatus } = useHealthQueries();

  return <StatusDot tone={serverStatus} />;
};
