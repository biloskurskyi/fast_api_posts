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
    className={cn("text-accent text-ui rounded-md hover:underline", FOCUS_RING)}
  >
    {label}
  </Link>
);
