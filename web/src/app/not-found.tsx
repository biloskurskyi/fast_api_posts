import type { Metadata } from "next";

import { getT } from "@/i18n/server";
import { RouteNotFoundPanel } from "@/parts/feedback/RouteNotFoundPanel";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getT("common");
  return { title: t("boundary.notFound.title") };
};

const NotFoundPage = () => <RouteNotFoundPanel />;

export default NotFoundPage;
