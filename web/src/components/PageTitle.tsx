import type { ReactNode } from "react";

type PageTitleProps = {
  children: ReactNode;
};

export const PageTitle = ({ children }: PageTitleProps) => (
  <h1 className="text-text text-h1 font-serif font-semibold">{children}</h1>
);
