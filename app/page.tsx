"use client";

import { useState } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function Page() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input } as ChatMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err: any) {
      setError(err?.message || "L?i kh?ng x?c ??nh");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div className="badge">Claude 3 Opus ? opus</div>
        <div className="hint">Nh?p c?u h?i b?ng ti?ng Vi?t ho?c ti?ng Anh</div>
      </div>
      <div className="card">
        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role === "user" ? "user" : "assistant"}`}>
              {m.content}
            </div>
          ))}
        </div>
        <form className="form" onSubmit={onSubmit}>
          <input
            className="input"
            placeholder="H?i Opus..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button className="button" disabled={loading}>
            {loading ? "?ang g?i..." : "G?i"}
          </button>
        </form>
        {error && <div className="error" style={{ marginTop: 8 }}>{error}</div>}
        <div className="hint" style={{ marginTop: 8 }}>
          Y?u c?u bi?n m?i tr??ng ANTHROPIC_API_KEY ? m?y ch?.
        </div>
      </div>
    </div>
  );
}
