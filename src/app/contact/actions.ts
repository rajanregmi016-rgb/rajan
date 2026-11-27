"use server";

import { revalidatePath } from "next/cache";
import { writeAdminState, getAdminStateSafe, type AdminState } from "@/lib/adminStore";

export interface ContactFormState {
  ok: boolean;
  error?: string;
  message?: string;
}

const TOPICS = ["error", "suggestion", "data", "advertising", "other"];

export async function submitContactAction(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const str = (k: string) => String(formData.get(k) ?? "").trim();

  // Honeypot: real users never fill this hidden field.
  if (str("website")) {
    return { ok: true, message: "Thanks — your message has been received." };
  }

  const name = str("name");
  const email = str("email");
  const topic = str("topic");
  const url = str("url");
  const message = str("message");

  if (!name || name.length > 100) {
    return { ok: false, error: "Please enter your name (max 100 characters)." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address so we can reply." };
  }
  if (!TOPICS.includes(topic)) {
    return { ok: false, error: "Please choose what your message is about." };
  }
  if (message.length < 10 || message.length > 4000) {
    return {
      ok: false,
      error: "Your message should be between 10 and 4,000 characters.",
    };
  }

  const id = `msg-${Date.now()}`;
  const date = new Date().toISOString().slice(0, 10);
  const entry: AdminState["contactMessages"][number] = {
    id, date, name, email, topic, message,
    url: url || undefined,
    status: "new",
  };
  writeAdminState((s) => {
    const base = getAdminStateSafe();
    return {
      ...s,
      contactMessages: [
        entry,
        ...(base.contactMessages ?? []),
      ].slice(0, 200),
    };
  });
  revalidatePath("/admin");

  return {
    ok: true,
    message:
      "Thanks — your message has been received. The team reads every message and replies at the email you provided.",
  };
}

export async function markMessageReadAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  writeAdminState((s) => ({
    ...s,
    contactMessages: (s.contactMessages ?? []).map((m) =>
      m.id === id ? { ...m, status: "read" } : m
    ),
  }));
  revalidatePath("/admin");
}
