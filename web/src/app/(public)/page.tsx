import type { Metadata } from "next";
import { Suspense } from "react";

import { getT } from "@/i18n/server";
import { FeedScreen } from "@/screens/FeedScreen";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getT("feed");
  return { title: t("title") };
};

const FeedPage = () => (
  <Suspense>
    <FeedScreen />
  </Suspense>
);

export default FeedPage;
