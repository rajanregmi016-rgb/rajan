import { ogImage, OG_SIZE } from "@/lib/ogImage";
import { allTools, getCategory, getTool } from "@/lib/tools";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Nepali Tools";

export function generateStaticParams() {
  return allTools().map((t) => ({ slug: t.slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const tool = getTool(params.slug);
  const cat = tool ? getCategory(tool.category) : undefined;
  return ogImage({
    eyebrow: cat?.name ?? "Free tool",
    title: tool?.shortTitle ?? "Nepali Tools",
    subtitle: tool ? (tool.description.length > 120 ? tool.description.slice(0, 117) + "…" : tool.description) : undefined,
  });
}
