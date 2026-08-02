import type { Metadata } from "next";

import { getT } from "@/i18n/server";
import { PostEditorScreen } from "@/screens/PostEditorScreen";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getT("editor");
  return { title: t("edit.title") };
};

const EditPostPage = () => <PostEditorScreen />;

export default EditPostPage;
