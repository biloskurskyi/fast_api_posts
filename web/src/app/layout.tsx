import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";

import { getT } from "@/i18n/server";
import { Providers } from "@/parts/layout/Providers";
import { interFont, sourceSerifFont } from "@/theme/fonts";
import "@/theme/theme.css";
import { themePrePaintScript } from "@/theme/themeScript";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getT("common");
  return { title: t("app.name") };
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html
    lang="en"
    className={`${interFont.variable} ${sourceSerifFont.variable}`}
    suppressHydrationWarning
  >
    <head>
      <Script id="theme-pre-paint" strategy="beforeInteractive">
        {themePrePaintScript}
      </Script>
    </head>
    <body className="bg-page text-text font-sans antialiased">
      <Providers>{children}</Providers>
    </body>
  </html>
);

export default RootLayout;
