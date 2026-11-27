"use server";

import { revalidatePath } from "next/cache";
import { getRates, writeRates } from "@/lib/rates";
import { writeAdminState } from "@/lib/adminStore";
import type { RatesData } from "@/lib/rates";

export async function updateRatesAction(formData: FormData): Promise<void> {
  const num = (k: string) => Number(String(formData.get(k) ?? "0").replace(/[,\s]/g, "")) || 0;
  const current = getRates();
  const next: RatesData = {
    ...current,
    gold: {
      fineTola: num("fineTola") || current.gold.fineTola,
      tejabiTola: num("tejabiTola") || current.gold.tejabiTola,
      silverTola: num("silverTola") || current.gold.silverTola,
      tenGram: num("tenGram") || Math.round((num("fineTola") || current.gold.fineTola) / 11.6638 * 10),
      updated: new Date().toISOString(),
      source: current.gold.source,
    },
    forex: {
      ...current.forex,
      fallbackUsdNpr: num("fallbackUsdNpr") || current.forex.fallbackUsdNpr,
      updated: new Date().toISOString().slice(0, 10),
    },
  };
  writeRates(() => next);
  writeAdminState((s) => ({
    ...s,
    seoEngine: {
      ...s.seoEngine,
      updateHistory: [
        { date: new Date().toISOString().slice(0, 10), action: `Rates updated — gold Rs ${next.gold.fineTola.toLocaleString("en-IN")}/tola, USD Rs ${next.forex.fallbackUsdNpr}`, status: "auto" as "auto" | "verified" | "draft" },
        ...s.seoEngine.updateHistory,
      ].slice(0, 50),
    },
  }));
  revalidatePath("/", "layout");
}

export async function reviewQueueAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  writeAdminState((s) => ({
    ...s,
    seoEngine: {
      ...s.seoEngine,
      contentQueue: s.seoEngine.contentQueue.map((q) =>
        q.id === id ? { ...q, status: decision === "approve" ? "approved" : "rejected" } : q
      ),
    },
  }));
  revalidatePath("/admin");
}

export async function addQueueItemAction(formData: FormData): Promise<void> {
  const text = String(formData.get("text") ?? "").trim();
  if (!text) return;
  const toolSlug = String(formData.get("toolSlug") ?? "").trim();
  writeAdminState((s) => ({
    ...s,
    seoEngine: {
      ...s.seoEngine,
      contentQueue: [
        {
          id: `q-${Date.now()}`,
          createdAt: new Date().toISOString().slice(0, 10),
          toolSlug: toolSlug || undefined,
          kind: "paragraph",
          text,
          confidence: "low",
          status: "pending",
        },
        ...s.seoEngine.contentQueue,
      ],
    },
  }));
  revalidatePath("/admin");
}
