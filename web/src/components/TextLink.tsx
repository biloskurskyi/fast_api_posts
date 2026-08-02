import type { Route } from "next";
import Link from "next/link";

import { cn } from "@/utils/cn";

import { FOCUS_RING } from "./controlStyles";

type TextLinkProps = {
  href: Route;
  label: string;
};

export const TextLink = ({ href, label }: TextLinkProps) => (
  <Link
    href={href}
    className={cn("text-accent text-ui rounded-md hover:underline", FOCUS_RING)}
  >
    {label}
  </Link>
);
