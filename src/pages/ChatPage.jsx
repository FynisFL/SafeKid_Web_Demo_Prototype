import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import SafeKidLogo from "../assets/brand/Logo_SafeKid.png";
import ChatComposer from "../components/ChatComposer.jsx";
import ThoughtLine from "../components/react-bits/ThoughtLine.jsx";
import "../styles/chat-page.css";

const STARTER_PROMPTS = [
  "What is SafeKid?",
  "Tell me about the Zodiac collection.",
  "What can I ask here?",
];

const QUICK_QUESTION_GROUPS = [
  {
    label: "Start here",
    questions: ["What is SafeKid?", "What can I ask here?"],
  },
  {
    label: "Explore",
    questions: ["Tell me about the Zodiac collection.", "Which SafeKid pages can I explore?"],
  },
  {
    label: "Support",
    questions: ["Can I place an order?", "I need help from a person."],
  },
];

const THOUGHT_STEPS = ["Reviewing your question", "Checking SafeKid information", "Preparing a reply"];

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `chat-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createMessage(role, content, extra = {}) {
  const now = new Date();
  return {
    id: createId(),
    role,
    content,
    time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    timestamp: now.toISOString(),
    ...extra,
  };
}

function greetingMessage() {
  return createMessage(
    "assistant",
    "Hi, I’m the SafeKid assistant. Ask about the SafeKid concept, the Zodiac collection, or what this prototype can help with."
  );
}

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s#@.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveQuestion(text) {
  const query = normalize(text);
  const requestsHuman = /\b(human|agent|representative|person|staff|complaint|complain|refund|compensation)\b/.test(query)
    || ["talk to someone", "speak to someone", "talk to a person", "speak to a person", "real person", "order problem", "wrong order"].some((phrase) => query.includes(phrase));

  if (requestsHuman) {
    return { handoff: true, answer: "That needs case-specific support. I’ll show the human handoff flow in this prototype; no live support agent is connected." };
  }
  if (/\b(zodiac|collection|edition|editions|animal|animals)\b/.test(query)) {
    return { answer: "The SafeKid collection presents 12 visual designs inspired by the Vietnamese Zodiac. They are editions of the same watch concept; live product availability has not been confirmed." };
  }
  if (/\b(feature|features|watch|device|location|calling|call|safe zone|sos|gps|tracking|app)\b/.test(query)) {
    return { answer: "SafeKid’s watch, parent-app, location, calling, safe-zone, and SOS elements are presented as product concepts. This website is not connected to a live watch, account, location service, or app." };
  }
  if (/\b(order|orders|buy|purchase|payment|pay|price|shipping|delivery|return|warranty|available|availability)\b/.test(query)) {
    return { answer: "This concept website does not process orders or payments. Pricing, availability, shipping, delivery, return, and warranty policies have not been confirmed here, so I won’t guess.", offerHandoff: true };
  }
  if (/\b(contact|email|reach|team)\b/.test(query)) {
    return { answer: "The SafeKid site lists support@safekid.com as its contact email. The Contact page opens an email draft; it does not send a message automatically." };
  }
  if (/\b(prototype|help|support)\b/.test(query) || query.includes("what can i ask here")) {
    return { answer: "This local prototype can explain information shown on the SafeKid concept website, preview an AI-style support flow, and demonstrate a simulated human handoff. It cannot access accounts, process orders, or contact a real support team." };
  }
  if (/\b(page|pages|explore)\b/.test(query)) {
    return { answer: "You can explore the Support, Zodiac collection, and Contact pages from the sidebar. Those pages describe the SafeKid concept and offer a prototype contact route." };
  }
  if (/\b(what is|about|concept|safekid)\b/.test(query)) {
    return { answer: "SafeKid is presented on this website as a product concept for a child-focused watch and a playful collection inspired by the Vietnamese Zodiac. No live product or connected service is represented." };
  }
  return { answer: "I can only answer from information shown on the SafeKid concept website, and I can’t verify this question from that content. I won’t make up an answer. You can preview a human handoff or email support@safekid.com.", offerHandoff: true };
}

function isFirstUserMessage(messages) {
  return !messages.some((message) => message.role === "user");
}

function AssistantMark() {
  return <span className="chat-mark chat-mark--assistant" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3.5 14.2 9.8 20.5 12l-6.3 2.2L12 20.5l-2.2-6.3L3.5 12l6.3-2.2L12 3.5Z" /><path d="m18.5 3 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" /></svg></span>;
}

function UserMark() {
  return <span className="chat-mark chat-mark--user" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.25" /><path d="M5.5 20c.5-3.6 2.7-5.4 6.5-5.4s6 1.8 6.5 5.4" /></svg></span>;
}

function AgentMark() {
  return <span className="chat-mark chat-mark--agent" aria-hidden="true">A</span>;
}

function Chevron({ open }) {
  return <svg className="chat-quick-chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true" data-open={open ? "" : undefined}><path d="m4 6 4 4 4-4" /></svg>;
}

function QuickQuestionPicker({ className = "", open, disabled, onToggle, onPick }) {
  return (
    <div className={`chat-quick-questions ${className}`}>
      <button className="chat-quick-trigger" type="button" aria-haspopup="menu" aria-expanded={open} disabled={disabled} onClick={onToggle}>
        <span className="chat-quick-trigger-icon" aria-hidden="true">?</span>
        <span>FAQ</span>
        <Chevron open={open} />
      </button>

      {open && (
        <div className="chat-quick-menu" role="menu" aria-label="Quick questions">
          <div className="chat-quick-menu-head">
            <span>Quick questions</span>
            <small>Choose a question to send</small>
          </div>
          {QUICK_QUESTION_GROUPS.map((group) => (
            <div className="chat-quick-group" key={group.label}>
              <p>{group.label}</p>
              {group.questions.map((question) => (
                <button type="button" role="menuitem" key={question} disabled={disabled} onClick={() => onPick(question)}>
                  <span>{question}</span><i aria-hidden="true">↗</i>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState(() => [greetingMessage()]);
  const [layer, setLayer] = useState("assistant");
  const [isBusy, setIsBusy] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickQuestionsOpen, setQuickQuestionsOpen] = useState(false);
  const [composerVersion, setComposerVersion] = useState(0);
  const [conversationTitle, setConversationTitle] = useState("New conversation");
  const messageListRef = useRef(null);
  const timersRef = useRef([]);
  const thoughtIdRef = useRef(null);
  const busyKindRef = useRef("");

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const schedule = useCallback((callback, delay) => {
    const timer = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((item) => item !== timer);
      callback();
    }, delay);
    timersRef.current.push(timer);
    return timer;
  }, []);

  const appendMessage = useCallback((role, content, extra = {}) => {
    setMessages((current) => [...current, createMessage(role, content, extra)]);
  }, []);

  const updateThought = useCallback((id, changes) => {
    setMessages((current) => current.map((message) => message.id === id ? { ...message, ...changes } : message));
  }, []);

  useLayoutEffect(() => {
    const list = messageListRef.current;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages, isBusy, layer]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(() => {
    if (!quickQuestionsOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!(event.target instanceof Element) || !event.target.closest(".chat-quick-questions, .chat-composer-faq")) setQuickQuestionsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setQuickQuestionsOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [quickQuestionsOpen]);

  const finishHandoff = useCallback(() => {
    setLayer("agent");
    setIsBusy(false);
    busyKindRef.current = "";
    appendMessage("agent", "This is a simulated support-agent reply for the demo. No live representative is connected, and I can’t access or change orders.");
  }, [appendMessage]);

  const beginHandoff = useCallback(() => {
    if (layer === "handoff" || layer === "agent") return;
    setSidebarOpen(false);
    setQuickQuestionsOpen(false);
    setLayer("handoff");
    setIsBusy(true);
    busyKindRef.current = "handoff";
    appendMessage("system", "Demo handoff started. The conversation remains visible, but no live team is being contacted.");
    clearTimers();
    schedule(finishHandoff, 850);
  }, [appendMessage, clearTimers, finishHandoff, layer, schedule]);

  const handlePromptSend = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;
    setSidebarOpen(false);
    setQuickQuestionsOpen(false);
    if (isFirstUserMessage(messages)) setConversationTitle(trimmed.length > 30 ? `${trimmed.slice(0, 30).trimEnd()}…` : trimmed);
    appendMessage("user", trimmed);

    if (layer === "agent") {
      setIsBusy(true);
      busyKindRef.current = "agent";
      schedule(() => {
        setIsBusy(false);
        busyKindRef.current = "";
        appendMessage("agent", "This demo can show the conversation flow, but it can’t check a real account or send your message to the SafeKid team.");
      }, 750);
      return;
    }

    const result = resolveQuestion(trimmed);
    const thoughtId = createId();
    thoughtIdRef.current = thoughtId;
    setIsBusy(true);
    busyKindRef.current = "assistant";
    setMessages((current) => [...current, createMessage("thought", "", { id: thoughtId, working: true, steps: [THOUGHT_STEPS[0]] })]);

    const randomDuration = Math.floor(Math.random() * 2001) + 1000;
    const step1Delay = Math.floor(randomDuration * 0.3);
    const step2Delay = Math.floor(randomDuration * 0.65);

    schedule(() => {
      if (thoughtIdRef.current !== thoughtId) return;
      updateThought(thoughtId, { steps: THOUGHT_STEPS.slice(0, 2) });
    }, step1Delay);
    schedule(() => {
      if (thoughtIdRef.current !== thoughtId) return;
      updateThought(thoughtId, { steps: THOUGHT_STEPS });
    }, step2Delay);
    schedule(() => {
      if (thoughtIdRef.current !== thoughtId) return;
      updateThought(thoughtId, { working: false, steps: THOUGHT_STEPS });
      thoughtIdRef.current = null;
      setIsBusy(false);
      busyKindRef.current = "";
      appendMessage("assistant", result.answer, { offerHandoff: result.offerHandoff });
      if (result.handoff) {
        appendMessage("system", "The handoff shown here is simulated; no employee has joined this chat.");
        setLayer("handoff");
        setIsBusy(true);
        busyKindRef.current = "handoff";
        schedule(finishHandoff, 850);
      }
    }, randomDuration);
  }, [appendMessage, finishHandoff, isBusy, layer, messages, schedule, updateThought]);

  const stopResponse = useCallback(() => {
    clearTimers();
    setIsBusy(false);
    const pendingKind = busyKindRef.current;
    busyKindRef.current = "";
    if (thoughtIdRef.current) {
      updateThought(thoughtIdRef.current, { working: false, steps: THOUGHT_STEPS });
      thoughtIdRef.current = null;
    }
    if (pendingKind === "handoff") {
      setLayer("assistant");
      appendMessage("system", "The simulated handoff was stopped. No live support team was contacted.");
    } else {
      appendMessage("system", "The demo response was stopped.");
    }
  }, [appendMessage, clearTimers, updateThought]);

  const startNewConversation = useCallback(() => {
    clearTimers();
    setMessages([greetingMessage()]);
    setLayer("assistant");
    setIsBusy(false);
    setSidebarOpen(false);
    setQuickQuestionsOpen(false);
    setConversationTitle("New conversation");
    setComposerVersion((version) => version + 1);
    thoughtIdRef.current = null;
    busyKindRef.current = "";
  }, [clearTimers]);

  const requestHandoff = useCallback(() => beginHandoff(), [beginHandoff]);
  const handleStarter = useCallback((prompt) => handlePromptSend(prompt), [handlePromptSend]);
  const handleQuickQuestion = useCallback((question) => handlePromptSend(question), [handlePromptSend]);
  const freshConversation = isFirstUserMessage(messages) && !isBusy && layer === "assistant";
  const status = layer === "assistant" ? "Demo assistant" : layer === "handoff" ? "Handoff preview" : "Demo agent";

  return (
    <div className="chat-page">
      <aside id="chat-sidebar" className={`chat-sidebar${sidebarOpen ? " is-open" : ""}`} aria-label="Chat navigation">
        <a href="#/" className="chat-sidebar-brand" aria-label="SafeKid home">
          <img src={SafeKidLogo} alt="" />
          <span>SafeKid</span><span className="chat-brand-divider" aria-hidden="true" /><span className="chat-brand-section">Support</span>
        </a>

        <button className="chat-new-button" type="button" onClick={startNewConversation}>
          <span aria-hidden="true">＋</span><span>New conversation</span>
        </button>

        <div className="chat-sidebar-section">
          <p className="chat-sidebar-label">Conversations</p>
          <div className="chat-conversation-item" aria-current="page"><span className="chat-conversation-mark" aria-hidden="true" /><span className="chat-conversation-name">{conversationTitle}</span></div>
        </div>

        <div className="chat-sidebar-section chat-sidebar-links">
          <p className="chat-sidebar-label">Explore SafeKid</p>
          <a href="#/support" onClick={() => setSidebarOpen(false)}><span className="chat-nav-glyph" aria-hidden="true">?</span><span>Support information</span></a>
          <a href="#/zodiac" onClick={() => setSidebarOpen(false)}><span className="chat-nav-glyph chat-nav-glyph--grid" aria-hidden="true"><i /><i /><i /><i /></span><span>Zodiac collection</span></a>
          <a href="#/contact" onClick={() => setSidebarOpen(false)}><span className="chat-nav-glyph chat-nav-glyph--mail" aria-hidden="true">@</span><span>Contact the team</span></a>
        </div>

        <div className="chat-sidebar-bottom"><a href="mailto:support@safekid.com">support@safekid.com</a></div>
      </aside>

      {sidebarOpen && <button className="chat-sidebar-backdrop" type="button" aria-label="Close chat navigation" onClick={() => setSidebarOpen(false)} />}

      <main className="chat-main">
        <header className="chat-topbar">
          <button className="chat-menu-button" type="button" aria-label="Open chat navigation" aria-controls="chat-sidebar" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen((open) => !open)}>
            <span /><span /><span />
          </button>
          <div className="chat-topbar-title"><h1>Support chat</h1><span className="chat-topbar-status"><i aria-hidden="true" />{status}</span></div>
        </header>

        <section className="chat-session" aria-label="SafeKid support conversation">
          <div className="chat-history" ref={messageListRef} role="log" aria-live="polite" aria-relevant="additions text">
            <div className={`chat-message-column${freshConversation ? " is-fresh" : ""}`}>
              {messages.map((message) => {
                if (message.role === "thought") {
                  return <div className="chat-thought-row" key={message.id}><ThoughtLine working={message.working} steps={message.steps} label="Checking SafeKid information…" doneLabel="Checked SafeKid information" glyph="sparkle" fontSize={13} breathPeriod={1.6} breathDepth={0.32} settleDuration={350} settleBlur={2} collapsible collapseOnSettle showTimer color="#315965" glyphColor="#0aa4a8" className="chat-thoughtline" /></div>;
                }
                if (message.role === "system") return <div className="chat-system-row" key={message.id}><span>{message.content}</span></div>;

                const isUser = message.role === "user";
                const isAgent = message.role === "agent";
                const roleLabel = isUser ? "You" : isAgent ? "Demo agent" : "SafeKid assistant";
                return (
                  <article className={`chat-entry${isUser ? " is-user" : ""}${isAgent ? " is-agent" : ""}`} key={message.id}>
                    <div className="chat-entry-mark">{isUser ? <UserMark /> : isAgent ? <AgentMark /> : <AssistantMark />}</div>
                    <div className="chat-entry-content">
                      <div className="chat-entry-meta"><span>{roleLabel}</span><time dateTime={message.timestamp}>{message.time}</time></div>
                      <div className="chat-bubble">
                        <p>{message.content}</p>
                        {message.offerHandoff && layer === "assistant" && <button className="chat-handoff-button" type="button" onClick={requestHandoff}>Preview human handoff<span aria-hidden="true">→</span></button>}
                      </div>
                    </div>
                  </article>
                );
              })}

              {isBusy && layer === "agent" && <div className="chat-agent-typing" role="status" aria-label="Demo agent is typing"><AgentMark /><span><i /><i /><i /></span></div>}

              {freshConversation && (
                <div className="chat-starters" aria-label="Suggested questions">
                  <p>Try asking</p>
                  <div>{STARTER_PROMPTS.map((prompt) => <button key={prompt} type="button" onClick={() => handleStarter(prompt)}>{prompt}</button>)}</div>
                </div>
              )}
            </div>
          </div>

          <div className="chat-composer-dock">
            <div className="chat-composer-wrap">
              <ChatComposer key={composerVersion} placeholder={layer === "agent" ? "Message the simulated agent…" : "Ask about SafeKid…"} busy={isBusy} onSend={handlePromptSend} onStop={stopResponse} faqTrigger={<QuickQuestionPicker className="chat-quick-questions" open={quickQuestionsOpen} disabled={isBusy} onToggle={() => setQuickQuestionsOpen((open) => !open)} onPick={handleQuickQuestion} />} />
              <div className="chat-composer-footnote">
                <span className="chat-composer-shortcut">Enter to send <i aria-hidden="true">·</i> Shift + Enter for a new line</span>
                <span className="chat-composer-disclosure">Demo only — replies are simulated; no live agent is connected.</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
