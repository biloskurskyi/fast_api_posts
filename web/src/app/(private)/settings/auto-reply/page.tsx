import type { Metadata } from "next";

import { getT } from "@/i18n/server";
import { AutoReplySettingsScreen } from "@/screens/AutoReplySettingsScreen";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getT("settings");
  return { title: t("title") };
};

const AutoReplySettingsPage = () => <AutoReplySettingsScreen />;

export default AutoReplySettingsPage;
