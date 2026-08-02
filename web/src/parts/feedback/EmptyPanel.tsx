import type { ReactNode } from "react";

type EmptyPanelProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export const EmptyPanel = ({ title, description, action }: EmptyPanelProps) => (
  <div className="bg-raised shadow-e1 flex flex-col items-center gap-3 rounded-lg px-6 py-16 text-center">
    <p className="text-text text-title font-serif font-semibold">{title}</p>
    <p className="text-secondary text-prose max-w-prose font-serif text-pretty">
      {description}
    </p>
    {action}
  </div>
);
