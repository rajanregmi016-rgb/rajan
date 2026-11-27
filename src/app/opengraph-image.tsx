import { ogImage, OG_SIZE } from "@/lib/ogImage";
import { allTools } from "@/lib/tools";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Nepali Tools — free online tools for Nepal";

export default function Image() {
  return ogImage({
    eyebrow: "Free tools for Nepal",
    title: "Every Nepali tool you need, in one place.",
    subtitle: `${allTools().length} free tools: BS/AD dates, gold price, EMI, tax, SEE GPA, Preeti to Unicode and more.`,
  });
}
