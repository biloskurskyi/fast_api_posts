import type { ReactNode } from "react";

type SurfaceProps = {
  children: ReactNode;
};

export const Surface = ({ children }: SurfaceProps) => (
  <div className="bg-raised shadow-e1 rounded-lg p-6">{children}</div>
);
