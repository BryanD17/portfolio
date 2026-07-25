import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema, TOPIC_LABELS } from "@/lib/contact-schema";

/** Per-IP sliding window: 5 submissions per hour per instance. */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

interface ContactResponse {
  ok: boolean;
  error?: string;
}

export async function POST(request: Request): Promise<NextResponse<ContactResponse>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, error: first?.message ?? "Invalid submission." },
      { status: 400 }
    );
  }

  // Honeypot filled: pretend success, send nothing, log nothing useful.
  if (parsed.data.company && parsed.data.company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages in a row. Please try again later or email directly." },
      { status: 429 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? "bdjenabia5@gmail.com";
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "The contact service is not configured yet. Please email directly." },
      { status: 503 }
    );
  }

  const { name, email, message, topic } = parsed.data;
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to,
      replyTo: email,
      subject: `Portfolio contact: ${topic ? `${TOPIC_LABELS[topic]} from ` : ""}${name}`,
      text: `From: ${name} <${email}>\nTopic: ${topic ? TOPIC_LABELS[topic] : "not specified"}\n\n${message}`,
    });
    if (error) {
      return NextResponse.json(
        { ok: false, error: "Sending failed. Please email directly." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Sending failed. Please email directly." },
      { status: 502 }
    );
  }
}
