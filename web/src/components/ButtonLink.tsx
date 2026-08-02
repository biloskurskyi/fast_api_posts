import type { Route } from "next";
import Link from "next/link";

import { cn } from "@/utils/cn";

import { BUTTON_BASE, BUTTON_SIZES, BUTTON_VARIANTS, FOCUS_RING } from "./controlStyles";

type ButtonLinkProps = {
  href: Route;
  label: string;
};

export const ButtonLink = ({ href, label }: ButtonLinkProps) => (
  <Link
    href={href}
    className={cn(
      BUTTON_BASE,
      BUTTON_SIZES.default,
      BUTTON_VARIANTS.primary,
      "inline-flex w-full items-center justify-center md:w-auto",
      FOCUS_RING,
    )}
  >
    {label}
  </Link>
);
