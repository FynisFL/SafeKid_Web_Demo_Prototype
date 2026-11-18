import { formatVnd, WATCH_PRICE_VND } from "@/components/shop/shoppingBag";
import { useCallback, useEffect, useRef, useState } from "react";

export type ChatRole = "assistant" | "user" | "agent" | "system" | "thought";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  steps?: string[];
  working?: boolean;
  offerHandoff?: boolean;
  action?: "sos";
  actionLabel?: string;
};

export type ChatLayer = "assistant" | "handoff" | "agent";

export const THOUGHT_STEPS = [
  "Reviewing your question",
  "Checking SafeKid information",
  "Preparing a reply",
];

export const STARTER_PROMPTS = [
  "What is SafeKid?",
  "Tell me about the Zodiac collection.",
  "Can I place an order?",
  "How much does a watch cost?",
  "How can I try the Parent App?",
  "I need help from a person.",
];

export const QUICK_QUESTIONS = [
  "What is SafeKid?",
  "What can I ask here?",
  "Tell me about the Zodiac collection.",
  "Which SafeKid pages can I explore?",
  "Can I place an order?",
  "How much does a watch cost?",
  "How can I try the Parent App?",
  "I need help from a person.",
];

let counter = 0;

function createId() {
  counter += 1;
  return `msg-${Date.now()}-${counter}`;
}

function greeting(): ChatMessage {
  return {
    id: createId(),
    role: "assistant",
    content:
      "Hi, I'm the SafeKid assistant. Ask about the store preview, watch price, Parent App or Zodiac collection.",
  };
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s#@.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type Resolution = {
  answer: string;
  offerHandoff?: boolean;
  handoff?: boolean;
  action?: "sos";
  actionLabel?: string;
};

function resolveQuestion(text: string): Resolution {
  const query = normalize(text);
  const requestsHuman =
    /\b(human|agent|representative|person|staff|complaint|complain|refund|compensation)\b/.test(
      query
    ) ||
    [
      "talk to someone",
      "speak to someone",
      "talk to a person",
      "speak to a person",
      "real person",
      "order problem",
      "wrong order",
    ].some((phrase) => query.includes(phrase));

  if (requestsHuman) {
    return {
      handoff: true,
      answer:
        "That needs case-specific support. I'll show the human handoff flow in this prototype; no live support agent is connected.",
    };
  }

  const asksSos =
    /\bsos\b/.test(query) ||
    /\b(emergency|panic)\s+(feature|button|demo|interaction|alert|function)\b/.test(query) ||
    /\bone[- ]touch\s+(help|alert|button|signal)\b/.test(query) ||
    /\b(tinh nang khan cap|nut khan cap|tin hieu khan cap|tinh huong khan cap|goi cuu giup)\b/.test(query);

  if (asksSos) {
    return {
      action: "sos",
      actionLabel: "Explore SOS Demo",
      answer:
        "SafeKid's SOS page lets you try a local press-and-hold simulation. The demo shows the interaction with sample content. It does not send emergency alerts, share location or contact another person.",
    };
  }

  if (
    /\b(order|orders|buy|purchase|payment|pay|price|cost|costs|shipping|delivery|return|warranty|available|availability)\b/.test(
      query
    )
  ) {
    return {
      offerHandoff: true,
      answer:
        `SafeKid watches are listed at ${formatVnd(WATCH_PRICE_VND)} each. Add an edition to your bag and preview checkout. Confirm payment shows that ordering is closed. Shipping, VAT and platform fees show as Free in the preview; launch rates may differ. Shipping, returns and warranty terms will be published before orders open.`,
    };
  }
  if (/\b(zodiac|collection|edition|editions|animal|animals)\b/.test(query)) {
    return {
      answer:
        "The SafeKid collection presents 12 visual designs inspired by the Vietnamese Zodiac. Open an edition to see its price, add it to your bag and explore checkout. Watch orders are currently closed.",
    };
  }
  if (/\b(app|apk|android|iphone|ios)\b/.test(query)) {
    return {
      answer:
        "Try the SafeKid Parent App at /app. Open the Web App on iPhone, Android or desktop, or check the Android APK test release. Its location view shows the device running the app. Web and Android data are stored separately; live watch pairing and remote emergency alerts are not available.",
    };
  }
  if (
    /\b(feature|features|watch|device|location|calling|call|safe zone|sos|gps|tracking|app)\b/.test(
      query
    )
  ) {
    return {
      answer:
        "The website illustrates planned watch features such as location, calling, safe zones and SOS. The separate Parent App test build is available at /app. Website demos use sample events; live watch pairing and remote emergency alerts are not available.",
    };
  }
  if (/\b(contact|email|reach|team)\b/.test(query)) {
    return {
      answer:
        "You can contact the SafeKid team by email at safekid.digibabi@gmail.com, by phone at 0377 430 400, or through the Facebook page: https://facebook.com/DigiBabi. The Contact page opens an email draft; it does not send a message automatically.",
    };
  }
  if (/\b(prototype|help|support)\b/.test(query) || query.includes("what can i ask here")) {
    return {
      answer:
        "This local prototype can explain information shown on the SafeKid concept website, preview an AI-style support flow, and demonstrate a simulated human handoff. It cannot access accounts, process orders, or contact a real support team.",
    };
  }
  if (/\b(page|pages|explore)\b/.test(query)) {
    return {
      answer:
        "Explore the Zodiac collection, shopping bag, preview checkout, Parent App, Watch Passport, SOS Demo, About and Support pages. Contact opens an email draft for the team.",
    };
  }
  if (/\b(what is|about|concept|safekid)\b/.test(query)) {
    return {
      answer:
        "SafeKid combines twelve Vietnamese Zodiac watch designs, a store preview and a Parent App test build. You can try the app and explore the shopping flow while watch orders remain closed.",
    };
  }
  return {
    offerHandoff: true,
    answer:
      "I can only answer from information shown on the SafeKid concept website, and I can't verify this question from that content. I won't make up an answer. You can preview a human handoff, email safekid.digibabi@gmail.com, call 0377 430 400, or visit https://facebook.com/DigiBabi.",
  };
}

const HANDOFF_AGENT_REPLY =
  "This is a simulated support-agent reply for the demo. No live representative is connected, and I can't access or change orders.";

export function useLocalChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [greeting()]);
  const [layer, setLayer] = useState<ChatLayer>("assistant");
  const [isBusy, setIsBusy] = useState(false);
  const timers = useRef<number[]>([]);
  const sosEntryShown = useRef(false);

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      timers.current = timers.current.filter((item) => item !== timer);
      callback();
    }, delay);
    timers.current.push(timer);
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const append = useCallback((message: Omit<ChatMessage, "id">) => {
    setMessages((current) => [...current, { ...message, id: createId() }]);
  }, []);

  const requestHandoff = useCallback(() => {
    setLayer("handoff");
    setIsBusy(true);
    append({
      role: "system",
      content:
        "Demo handoff started. The conversation remains visible, but no live team is being contacted.",
    });
    schedule(() => {
      setLayer("agent");
      setIsBusy(false);
      append({ role: "agent", content: HANDOFF_AGENT_REPLY });
    }, 1100);
  }, [append, schedule]);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || isBusy) return;

      append({ role: "user", content: text });
      const result = resolveQuestion(text);

      if (layer === "agent") {
        setIsBusy(true);
        schedule(() => {
          setIsBusy(false);
          const showSosEntry = result.action === "sos" && !sosEntryShown.current;
          if (showSosEntry) sosEntryShown.current = true;
          append({
            role: "agent",
            content: showSosEntry
              ? result.answer
              : "This demo can show the conversation flow, but it can't check a real account or send your message to the SafeKid team.",
            ...(showSosEntry ? { action: "sos" as const, actionLabel: result.actionLabel } : {}),
          });
        }, 900);
        return;
      }

      const thoughtId = createId();

      setIsBusy(true);
      setMessages((current) => [
        ...current,
        { id: thoughtId, role: "thought", content: "", working: true, steps: [THOUGHT_STEPS[0]] },
      ]);

      schedule(() => {
        setMessages((current) =>
          current.map((message) =>
            message.id === thoughtId ? { ...message, steps: THOUGHT_STEPS.slice(0, 2) } : message
          )
        );
      }, 520);

      schedule(() => {
        setMessages((current) =>
          current.map((message) =>
            message.id === thoughtId ? { ...message, steps: THOUGHT_STEPS } : message
          )
        );
      }, 980);

      schedule(() => {
        setMessages((current) =>
          current.map((message) =>
            message.id === thoughtId
              ? { ...message, working: false, steps: THOUGHT_STEPS }
              : message
          )
        );
        setIsBusy(false);
        const showSosEntry = result.action === "sos" && !sosEntryShown.current;
        if (showSosEntry) sosEntryShown.current = true;
        append({
          role: "assistant",
          content: result.answer,
          offerHandoff: result.offerHandoff,
          ...(showSosEntry ? { action: "sos", actionLabel: result.actionLabel } : {}),
        });

        if (result.handoff) {
          setLayer("handoff");
          setIsBusy(true);
          append({
            role: "system",
            content: "The handoff shown here is simulated; no employee has joined this chat.",
          });
          schedule(() => {
            setLayer("agent");
            setIsBusy(false);
            append({ role: "agent", content: HANDOFF_AGENT_REPLY });
          }, 1200);
        }
      }, 1500);
    },
    [append, isBusy, layer, schedule]
  );

  const stop = useCallback(() => {
    clearTimers();
    setIsBusy(false);
    setMessages((current) =>
      current.map((message) => (message.working ? { ...message, working: false } : message))
    );
    append({ role: "system", content: "The demo response was stopped." });
  }, [append, clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setMessages([greeting()]);
    setLayer("assistant");
    setIsBusy(false);
    sosEntryShown.current = false;
  }, [clearTimers]);

  return { messages, layer, isBusy, send, stop, reset, requestHandoff };
}
