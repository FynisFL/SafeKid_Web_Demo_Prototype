import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, RotateCcw, Send, ShieldAlert, Sparkles, UserRound } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  QUICK_QUESTIONS,
  STARTER_PROMPTS,
  THOUGHT_STEPS,
  useLocalChat,
  type ChatMessage,
} from "@/hooks/useLocalChat";
import { cn } from "@/lib/utils";

function MessageBubble({
  message,
  onHandoff,
  busy,
}: {
  message: ChatMessage;
  onHandoff: () => void;
  busy: boolean;
}) {
  const reduce = useReducedMotion();

  if (message.role === "thought") {
    return (
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-night text-primary">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="rounded-2xl rounded-tl-md border border-ink/10 bg-white px-4 py-3">
          <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-deep/60">
            {message.working ? "Thinking" : "Reviewed"}
            <span className="flex gap-1" aria-hidden="true">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="h-1 w-1 rounded-full bg-primary"
                  animate={reduce ? undefined : { opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: dot * 0.16 }}
                />
              ))}
            </span>
          </p>
          <ul className="mt-2 space-y-1.5">
            {(message.steps ?? THOUGHT_STEPS).map((step) => (
              <li key={step} className="flex items-center gap-2 text-[12px] text-deep/60">
                <Check className="h-3 w-3 text-primary" aria-hidden="true" />
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (message.role === "system") {
    return (
      <p className="mx-auto max-w-[92%] rounded-full bg-ink/[0.05] px-4 py-2 text-center text-[11px] leading-relaxed text-deep/50">
        {message.content}
      </p>
    );
  }

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[82%] rounded-2xl rounded-br-md bg-ink px-4 py-3 text-[13px] leading-relaxed text-white">
          {message.content}
        </p>
      </div>
    );
  }

  const isAgent = message.role === "agent";

  return (
    <div className="flex items-start gap-3">
      <span
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isAgent ? "bg-primary text-primary-foreground" : "bg-night text-primary"
        )}
        aria-hidden="true"
      >
        {isAgent ? <UserRound className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </span>
      <div className="max-w-[86%]">
        {isAgent && (
          <p className="mb-1 text-[9.5px] uppercase tracking-[0.16em] text-primary">
            Simulated agent
          </p>
        )}
        <div
          className={cn(
            "rounded-2xl rounded-tl-md border px-4 py-3 text-[13px] leading-relaxed",
            isAgent
              ? "border-primary/25 bg-secondary/40 text-ink"
              : "border-ink/10 bg-white text-deep"
          )}
        >
          {message.content}
        </div>
        {message.offerHandoff && (
          <button
            type="button"
            onClick={onHandoff}
            disabled={busy}
            className="press mt-2 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3.5 py-1.5 text-[11.5px] font-medium text-ink transition-colors hover:border-primary/40 hover:bg-mist disabled:opacity-50"
          >
            Preview human handoff
            <ArrowUpRight className="h-3 w-3 text-primary" aria-hidden="true" />
          </button>
        )}
        {message.action === "sos" && (
          <Link
            to="/sos"
            className="group mt-2 inline-flex min-h-10 items-center gap-2 rounded-full bg-ink px-4 py-2 text-[11.5px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-night focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {message.actionLabel ?? "Explore SOS Demo"}
            <ArrowUpRight className="h-3.5 w-3.5 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}

export default function Chat() {
  usePageTitle(
    "S-F AI | SafeKid",
    "A local, scripted support prototype for the SafeKid concept. No AI model or live agent is connected."
  );

  const { messages, layer, isBusy, send, stop, reset, requestHandoff } = useLocalChat();
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTo({ top: list.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages, isBusy, reduce]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim()) return;
    send(draft);
    setDraft("");
  }

  function onComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!draft.trim()) return;
      send(draft);
      setDraft("");
    }
  }

  const fresh = messages.length === 1 && !isBusy;
  const status = layer === "assistant" ? "Demo assistant" : layer === "handoff" ? "Handoff preview" : "Demo agent";

  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-mist pb-16 pt-[104px] sm:pb-20 lg:pt-[124px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[10%] -top-[30%] h-[640px] w-[640px] rounded-full bg-white/70 blur-[100px]"
        />
        <div className="shell relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-12">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">
              <span className="eyebrow-line" />
              S-F AI / Support prototype
            </p>
            <h1 className="display mt-6 text-[clamp(2.3rem,4.2vw,3.6rem)]">
              A little help,
              <br />
              <span className="text-primary">close at hand.</span>
            </h1>
            <p className="lede mt-5 max-w-[40ch]">
              A local, scripted preview of how a SafeKid support conversation could feel. It answers
              only from information shown on this concept site.
            </p>

            <ul className="mt-7 space-y-3 border-t border-ink/10 pt-6">
              {[
                "No AI model or live agent is connected.",
                "No account, order or location data is accessed.",
                "The human handoff is a simulation only.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[12.5px] text-deep/60">
                  <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              to="/support"
              className="group mt-7 inline-flex items-center gap-2 text-[13px] font-medium text-ink"
            >
              Read the support notes
              <ArrowUpRight
                className="h-4 w-4 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="overflow-hidden rounded-[30px] border border-ink/10 bg-white shadow-[0_40px_100px_-70px_rgba(16,42,56,0.6)]">
            <div className="flex items-center gap-3 border-b border-ink/10 bg-mist/50 px-5 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-night text-primary">
                <Sparkles className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[14px] font-semibold tracking-[-0.02em] text-ink">
                  SafeKid assistant
                </p>
                <p className="flex items-center gap-1.5 text-[10px] text-deep/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  {status} · scripted
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setDraft("");
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-white px-3 py-1.5 text-[11px] text-deep/60 transition-colors hover:border-primary/40 hover:text-ink"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                New
              </button>
            </div>

            <div
              ref={listRef}
              className="h-[clamp(280px,38vh,400px)] space-y-4 overflow-y-auto bg-white px-4 py-5 sm:px-5"
              role="log"
              aria-live="polite"
              aria-label="Conversation"
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={reduce ? false : { opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: message.role === "user" ? "bottom right" : "bottom left" }}
                >
                  <MessageBubble
                    message={message}
                    onHandoff={requestHandoff}
                    busy={isBusy}
                  />
                </motion.div>
              ))}
            </div>

            <div className="border-t border-ink/10 bg-mist/40 px-4 py-3 sm:px-5">
              {fresh && (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => send(prompt)}
                      className="press shrink-0 rounded-full border border-ink/12 bg-white px-3 py-1.5 text-[11px] text-deep/70 transition-colors hover:border-primary/40 hover:text-ink"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={submit} className="flex items-end gap-2">
                <label className="sr-only" htmlFor="chat-input">
                  Your message
                </label>
                <textarea
                  id="chat-input"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={onComposerKeyDown}
                  rows={1}
                  placeholder="Ask about SafeKid…"
                  className="field-motion max-h-24 min-h-[44px] flex-1 resize-none rounded-2xl border border-ink/12 bg-white px-4 py-3 text-[13px] text-ink outline-none transition-colors placeholder:text-deep/45 focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
                {isBusy ? (
                  <button
                    type="button"
                    onClick={stop}
                    className="h-11 rounded-full border border-ink/15 px-4 text-[12px] font-medium text-ink transition-colors hover:bg-white"
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    type="submit"
                    aria-label="Send message"
                    disabled={!draft.trim()}
                    className="press flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-night disabled:opacity-30"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </form>

              <details className="mt-2">
                <summary className="cursor-pointer list-none text-[10.5px] text-deep/55 transition-colors hover:text-deep/60">
                  Quick questions
                </summary>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {QUICK_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => send(question)}
                      disabled={isBusy}
                      className="press rounded-full border border-ink/10 bg-white px-2.5 py-1 text-[10.5px] text-deep/60 transition-colors hover:border-primary/40 disabled:opacity-50"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
