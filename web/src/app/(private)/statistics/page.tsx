import type { Metadata } from "next";

import { getT } from "@/i18n/server";
import { CommentStatisticsScreen } from "@/screens/CommentStatisticsScreen";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getT("statistics");
  return { title: t("title") };
};

const CommentStatisticsPage = () => <CommentStatisticsScreen />;

export default CommentStatisticsPage;
