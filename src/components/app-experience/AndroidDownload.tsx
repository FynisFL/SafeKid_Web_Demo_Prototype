import { Download, LoaderCircle, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import type { RefObject } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const repo = "FynisFL/SafeKid-Parent-App-";
const releaseTag = "V0.11.3";
const releaseUrl = `https://github.com/${repo}/releases/tag/${releaseTag}`;
const releaseApi = `https://api.github.com/repos/${repo}/releases/tags/${releaseTag}`;

type Asset = { name: string; size: number; state: string };
type DownloadState =
  | { status: "loading" }
  | { status: "ready"; assets: Asset[] }
  | { status: "unavailable" | "error" };

function DownloadOptions() {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<DownloadState>({ status: "loading" });

  useEffect(() => {
    const request = new AbortController();
    const timeout = window.setTimeout(() => {
      setState({ status: "error" });
      request.abort();
    }, 8_000);

    async function checkRelease() {
      try {
        const response = await fetch(releaseApi, { signal: request.signal });
        if (response.status === 404) {
          if (!request.signal.aborted) setState({ status: "unavailable" });
          return;
        }
        if (!response.ok) throw new Error(`Release lookup failed (${response.status})`);

        const release = await response.json() as { draft: boolean; assets: Asset[] };
        const assets = release.draft ? [] : release.assets.filter((asset) =>
          asset.state === "uploaded" && asset.size > 0 && /\.apk$/i.test(asset.name),
        );
        if (!request.signal.aborted) {
          setState(assets.length ? { status: "ready", assets } : { status: "unavailable" });
        }
      } catch {
        if (!request.signal.aborted) setState({ status: "error" });
      } finally {
        window.clearTimeout(timeout);
      }
    }

    void checkRelease();
    return () => {
      window.clearTimeout(timeout);
      request.abort();
    };
  }, [attempt]);

  function retry() {
    setState({ status: "loading" });
    setAttempt((current) => current + 1);
  }

  if (state.status === "loading") {
    return (
      <div className="sk-download__status" role="status">
        <LoaderCircle size={18} className="sk-download__spinner" aria-hidden="true" />
        Checking the GitHub release…
      </div>
    );
  }

  if (state.status === "ready") {
    return (
      <div className="sk-download__status">
        <p role="status">Version {releaseTag} is ready to download.</p>
        {state.assets.map(({ name, size }) => (
          <Button asChild variant="brand" key={name} className="sk-download__file">
            <a href={`https://github.com/${repo}/releases/download/${releaseTag}/${encodeURIComponent(name)}`}>
              <Download aria-hidden="true" />
              <span>{name}</span>
              <span className="sk-download__size">{(size / (1024 * 1024)).toFixed(1)} MB</span>
            </a>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="sk-download__status">
      <p role="status">
        {state.status === "error"
          ? "The release could not be checked. You can try again or view it on GitHub."
          : "This release does not have an APK attached yet. You can still try the Web App."}
      </p>
      <div className="sk-download__actions">
        {state.status === "error" && <Button variant="outline" onClick={retry}>Try again</Button>}
        <Button asChild variant="outline"><a href={releaseUrl}>View GitHub release</a></Button>
      </div>
    </div>
  );
}

export function AndroidDownload({ open, onOpenChange, trigger }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sk-download" onCloseAutoFocus={(event) => {
        if (!trigger.current) return;
        event.preventDefault();
        trigger.current.focus();
      }}>
        <span className="sk-download__icon"><Smartphone size={22} aria-hidden="true" /></span>
        <DialogTitle>Download for Android</DialogTitle>
        <DialogDescription>Install the SafeKid Parent App test build from GitHub.</DialogDescription>
        <DownloadOptions />
      </DialogContent>
    </Dialog>
  );
}
