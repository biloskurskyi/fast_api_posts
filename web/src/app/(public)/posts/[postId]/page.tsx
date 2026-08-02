import type { Metadata } from "next";
import { Suspense } from "react";

import { getT } from "@/i18n/server";
import { PostScreen } from "@/screens/PostScreen";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getT("post");
  return { title: t("title") };
};

const PostPage = () => (
  <Suspense>
    <PostScreen />
  </Suspense>
);

export default PostPage;
