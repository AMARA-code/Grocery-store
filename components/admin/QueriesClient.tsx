"use client";

import { useState } from "react";
import { replyToQuery, deleteQuery } from "@/lib/admin/queries";
import type { ContactMessage } from "@/lib/admin/queries";
import { Mail, MailOpen, Trash2, Send, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export function QueriesClient({ queries }: { queries: ContactMessage[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id));

  const handleReply = async (q: ContactMessage) => {
    const text = replyText[q.id]?.trim();
    if (!text) return toast.error("Reply cannot be empty.");
    setLoading(q.id);
    try {
      await replyToQuery(q.id, text, q.email, q.name, q.message);
      toast.success(`Reply sent to ${q.email}`);
      setReplyText((prev) => ({ ...prev, [q.id]: "" }));
    } catch {
      toast.error("Failed to send reply.");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this query?")) return;
    setLoading(id);
    try {
      await deleteQuery(id);
      toast.success("Query deleted.");
    } catch {
      toast.error("Failed to delete.");
    } finally {
      setLoading(null);
    }
  };

  if (queries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-20 text-center">
        <MailOpen className="mb-3 h-10 w-10 text-gray-300" />
        <p className="text-gray-500">No queries yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {queries.map((q) => (
        <div
          key={q.id}
          className={cn(
            "rounded-2xl border bg-white shadow-sm transition",
            q.replied ? "border-green-200" : "border-gray-200"
          )}
        >
          {/* Header row */}
          <button
            type="button"
            onClick={() => toggle(q.id)}
            className="flex w-full items-center gap-4 px-5 py-4 text-left"
          >
            <div className="shrink-0">
              {q.replied ? (
                <MailOpen className="h-5 w-5 text-green-500" />
              ) : (
                <Mail className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-gray-900">{q.name}</span>
                <span className="text-sm text-gray-500">{q.email}</span>
                {q.replied && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    Replied
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-sm text-gray-600">
                {q.subject ?? q.message}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-3 shrink-0">
              <span className="hidden text-xs text-gray-400 sm:block">
                {new Date(q.created_at).toLocaleDateString()}
              </span>
              {expanded === q.id ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </button>

          {/* Expanded body */}
          {expanded === q.id && (
            <div className="border-t border-gray-100 px-5 py-4 space-y-4">
              {/* Original message */}
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Message
                </p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{q.message}</p>
              </div>

              {/* Previous reply */}
              {q.replied && q.reply_text && (
                <div className="rounded-xl bg-green-50 border border-green-200 p-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-green-600">
                    Your reply · {q.replied_at ? new Date(q.replied_at).toLocaleDateString() : ""}
                  </p>
                  <p className="text-sm text-green-800 whitespace-pre-wrap">{q.reply_text}</p>
                </div>
              )}

              {/* Reply box */}
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {q.replied ? "Send another reply" : "Reply"}
                </p>
                <textarea
                  rows={3}
                  value={replyText[q.id] ?? ""}
                  onChange={(e) =>
                    setReplyText((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                  placeholder={`Reply to ${q.name}...`}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-100"
                />
                <div className="mt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleDelete(q.id)}
                    disabled={loading === q.id}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReply(q)}
                    disabled={loading === q.id || !replyText[q.id]?.trim()}
                    className="flex items-center gap-1.5 rounded-xl bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    {loading === q.id ? "Sending…" : "Send Reply"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}