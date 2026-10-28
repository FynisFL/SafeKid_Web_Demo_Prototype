import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon } from "@hugeicons/core-free-icons";
import "./ChatComposer.css";

export default function ChatComposer({
  busy = false,
  onSend,
  onStop,
  placeholder = "Ask about SafeKid…",
  faqTrigger,
}) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (busy || !text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey && !busy) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-composer-shell">
      <textarea
        className="chat-composer-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        disabled={busy}
        rows={1}
        maxLength={2000}
        aria-label={busy ? "Response in progress" : placeholder}
        onKeyDown={handleKeyDown}
      />
      <div className="chat-composer-toolbar">
        <div className="chat-composer-faq">
          {faqTrigger}
        </div>
        {busy ? (
          <button
            className="chat-composer-btn chat-composer-btn--stop"
            type="button"
            aria-label="Stop response"
            onClick={onStop}
          >
            ⏹
          </button>
        ) : (
          <button
            className="chat-composer-btn chat-composer-btn--send"
            type="button"
            aria-label="Send message (Enter)"
            disabled={!text.trim()}
            onClick={handleSend}
          >
            <HugeiconsIcon icon={ArrowUp01Icon} size="18" strokeWidth={2.2} />
          </button>
        )}
      </div>
    </div>
  );
}
