"use client";

import { AppErrorPanel } from "@/parts/feedback/AppErrorPanel";

type ErrorPageProps = {
  reset: () => void;
};

const ErrorPage = ({ reset }: ErrorPageProps) => <AppErrorPanel onRetry={reset} />;

export default ErrorPage;
