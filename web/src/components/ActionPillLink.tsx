import type { Route } from "next";
import Link from "next/link";

import { cn } from "@/utils/cn";

import { ACTION_PILL, FOCUS_RING } from "./controlStyles";

type ActionPillLinkProps<T extends string> = {
  href: Route<T>;
  label: string;
};

export const ActionPillLink = <T extends string>({
  href,
  label,
}: ActionPillLinkProps<T>) => (
  <Link href={href} className={cn(ACTION_PILL, FOCUS_RING)}>
    {label}
  </Link>
);
