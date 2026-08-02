import type { Metadata } from "next";

import { getT } from "@/i18n/server";
import { SignInScreen } from "@/screens/SignInScreen";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getT("auth");
  return { title: t("signIn.title") };
};

const SignInPage = () => <SignInScreen />;

export default SignInPage;
