import { useCallback, useEffect, useRef, useState } from "react";

export type ChatRole = "assistant" | "user" | "agent" | "system" | "thought";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  steps?: string[];
  working?: boolean;
  offerHandoff?: boolean;
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
  "I need help from a person.",
];

export const QUICK_QUESTIONS = [
  "What is SafeKid?",
  "What can I ask here?",
  "Tell me about the Zodiac collection.",
  "Which SafeKid pages can I explore?",
  "Can I place an order?",
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
      "Hi, I'm the SafeKid assistant. Ask about the SafeKid concept, the Zodiac collection, or what this prototype can help with.",
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
  if (/\b(zodiac|collection|edition|editions|animal|animals)\b/.test(query)) {
    return {
      answer:
        "The SafeKid collection presents 12 visual designs inspired by the Vietnamese Zodiac. They are editions of the same watch concept; live product availability has not been confirmed.",
    };
  }
  if (
    /\b(feature|features|watch|device|location|calling|call|safe zone|sos|gps|tracking|app)\b/.test(
      query
    )
  ) {
    return {
      answer:
        "SafeKid's watch, parent-app, location, calling, safe-zone and SOS elements are presented as product concepts. This website is not connected to a live watch, account, location service or app.",
    };
  }
  if (
    /\b(order|orders|buy|purchase|payment|pay|price|shipping|delivery|return|warranty|available|availability)\b/.test(
      query
    )
  ) {
    return {
      offerHandoff: true,
      answer:
        "This concept website does not process orders or payments. Pricing, availability, shipping, delivery, return and warranty policies have not been confirmed here, so I won't guess.",
    };
  }
  if (/\b(contact|email|reach|team)\b/.test(query)) {
    return {
      answer:
        "The SafeKid site lists safekid.digibabi@gmail.com as its contact email. The Contact page opens an email draft; it does not send a message automatically.",
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
        "You can explore the Support, Zodiac collection and Contact pages from the navigation. Those pages describe the SafeKid concept and offer a prototype contact route.",
    };
  }
  if (/\b(what is|about|concept|safekid)\b/.test(query)) {
    return {
      answer:
        "SafeKid is presented on this website as a product concept for a child-focused watch and a playful collection inspired by the Vietnamese Zodiac. No live product or connected service is represented.",
    };
  }
  return {
    offerHandoff: true,
    answer:
      "I can only answer from information shown on the SafeKid concept website, and I can't verify this question from that content. I won't make up an answer. You can preview a human handoff or email safekid.digibabi@gmail.com.",
  };
}

const HANDOFF_AGENT_REPLY =
  "This is a simulated support-agent reply for the demo. No live representative is connected, and I can't access or change orders.";

export function useLocalChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [greeting()]);
  const [layer, setLayer] = useState<ChatLayer>("assistant");
  const [isBusy, setIsBusy] = useState(false);
  const timers = useRef<number[]>([]);

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

      if (layer === "agent") {
        setIsBusy(true);
        schedule(() => {
          setIsBusy(false);
          append({
            role: "agent",
            content:
              "This demo can show the conversation flow, but it can't check a real account or send your message to the SafeKid team.",
          });
        }, 900);
        return;
      }

      const result = resolveQuestion(text);
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
        append({ role: "assistant", content: result.answer, offerHandoff: result.offerHandoff });

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
  }, [clearTimers]);

  return { messages, layer, isBusy, send, stop, reset, requestHandoff };
}
