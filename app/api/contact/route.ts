import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseServerConfigured } from "@/lib/supabase/env";

export interface ContactRequestBody {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

function parseBody(body: unknown): ContactRequestBody | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as Record<string, unknown>;

  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  const message = typeof raw.message === "string" ? raw.message.trim() : "";
  const subject =
    typeof raw.subject === "string" ? raw.subject.trim() : undefined;

  if (!name || name.length < 2) return null;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (!message || message.length < 5) return null;

  return { name, email, subject: subject || undefined, message };
}

export async function POST(request: Request) {
  // Rate-limit hint via IP (logged to Supabase row, not enforced at edge here)
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = parseBody(json);
  if (!parsed) {
    return NextResponse.json(
      { error: "Please fill in all required fields correctly." },
      { status: 400 }
    );
  }

  if (!isSupabaseServerConfigured()) {
    return NextResponse.json(
      { error: "Server is not configured. Please try again later." },
      { status: 503 }
    );
  }

  try {
    const supabase = createSupabaseServerClient();

    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.name,
      email: parsed.email,
      subject: parsed.subject ?? null,
      message: parsed.message,
      ip_address: ip,
    });

    if (error) {
      console.error("[contact] Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    console.error("[contact] Unexpected error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}