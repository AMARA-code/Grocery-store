"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseServerConfigured } from "@/lib/supabase/env";
import { revalidatePath } from "next/cache";
import { sendMail } from "@/lib/email/mailer";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  ip_address: string | null;
  created_at: string;
  replied: boolean;
  reply_text: string | null;
  replied_at: string | null;
};

export async function getAdminQueries(): Promise<ContactMessage[]> {
  if (!isSupabaseServerConfigured()) return [];

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as ContactMessage[];
  } catch {
    return [];
  }
}

export async function replyToQuery(
  queryId: string,
  replyText: string,
  customerEmail: string,
  customerName: string,
  originalMessage: string
) {
  const supabase = await createSupabaseServerClient();

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#16a34a;padding:24px;border-radius:12px 12px 0 0;">
        <h1 style="color:white;margin:0;font-size:20px;">FreshCart Support</h1>
      </div>
      <div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
        <p style="color:#374151;">Hi <strong>${customerName}</strong>,</p>
        <p style="color:#374151;">Thank you for reaching out. Here's our reply to your query:</p>
        <div style="background:#f3f4f6;border-left:4px solid #16a34a;padding:16px;border-radius:4px;margin:16px 0;">
          <p style="color:#111827;margin:0;">${replyText}</p>
        </div>
        <p style="color:#6b7280;font-size:14px;">Your original message:</p>
        <p style="color:#9ca3af;font-size:13px;font-style:italic;">"${originalMessage}"</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
        <p style="color:#6b7280;font-size:13px;">Best regards,<br/><strong>FreshCart Team</strong></p>
      </div>
    </div>
  `;

  await sendMail({
    to: customerEmail,
    subject: `Re: Your query to FreshCart`,
    html,
  });

  const { error } = await supabase
    .from("contact_messages")
    .update({
      replied: true,
      reply_text: replyText,
      replied_at: new Date().toISOString(),
    })
    .eq("id", queryId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/queries");
}

export async function deleteQuery(queryId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", queryId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/queries");
}