import StaticPageView, { staticPageMeta } from "@/components/StaticPageView";
import { getStaticPage } from "@/data/staticPages";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  const page = getStaticPage("terms")!;
  return staticPageMeta(page);
}

export default function Page() {
  return <StaticPageView slug="terms" />;
}
