import type { Route } from "next";
import Link from "next/link";

import { cn } from "@/utils/cn";

import { FOCUS_RING } from "./controlStyles";

type TextLinkProps<T extends string> = {
  href: Route<T>;
  label: string;
};

export const TextLink = <T extends string>({ href, label }: TextLinkProps<T>) => (
  <Link
    href={href}
    className={cn(
      "text-accent text-ui min-h-touch inline-flex items-center rounded-md hover:underline md:min-h-0",
      FOCUS_RING,
    )}
  >
    {label}
  </Link>
);
