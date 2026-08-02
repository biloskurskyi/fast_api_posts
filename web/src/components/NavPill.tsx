import type { Route } from "next";
import Link from "next/link";

import { cn } from "@/utils/cn";

import { FOCUS_RING } from "./controlStyles";

type NavPillProps = {
  href: Route;
  label: string;
  isActive: boolean;
  onNavigate?: () => void;
};

export const NavPill = ({ href, label, isActive, onNavigate }: NavPillProps) => (
  <Link
    href={href}
    aria-current={isActive ? "page" : undefined}
    onClick={onNavigate}
    className={cn(
      "rounded-pill text-ui min-h-touch inline-flex items-center px-3 font-medium transition-colors duration-120",
      FOCUS_RING,
      isActive ? "bg-hover-tint text-text" : "text-secondary hover:bg-hover-tint",
    )}
  >
    {label}
  </Link>
);
