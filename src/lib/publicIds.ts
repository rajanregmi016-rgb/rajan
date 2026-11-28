/** Strip stray quotes/whitespace that can sneak into env values pasted in the Vercel dashboard. */
const clean = (v?: string) => (v ?? "").replace(/["'\s]/g, "") || undefined;

export const ADS_CLIENT = clean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT);
export const GA_ID = clean(process.env.NEXT_PUBLIC_GA_ID);
export const GSC_TOKEN = clean(process.env.NEXT_PUBLIC_GSC_TOKEN);
