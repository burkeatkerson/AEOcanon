import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import type { WriteupRequest } from "@/lib/scorecard/types";

/**
 * Streams the short personalized read from /api/scorecard/writeup with honest
 * loading states, so something appears quickly. The stream is decorative: if it
 * fails, a graceful static fallback takes its place and the result still reads
 * well. The POST payload (branch + answers/offsite + site-read) is passed in.
 */
export function Writeup({
  payload,
  fallback,
}: {
  payload: WriteupRequest;
  fallback: string;
}) {
  const [text, setText] = useState("");
  const [state, setState] = useState<"loading" | "done" | "error">("loading");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch("/api/scorecard/writeup", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) throw new Error("no stream");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setText(acc);
        }
        setState("done");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setState("error");
      }
    })();

    return () => controller.abort();
  }, [payload]);

  return (
    <div className="border-line bg-paper rounded-2xl border p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Sparkles className="text-accent size-4" aria-hidden />
        <span className="text-muted font-mono text-[11px] tracking-[0.1em] uppercase">
          Your personalized read
        </span>
      </div>
      <div className="text-ink-2 mt-3 space-y-3 text-[15px] leading-relaxed whitespace-pre-line">
        {state === "error" ? (
          fallback
        ) : text ? (
          text
        ) : (
          <span className="text-faint inline-flex items-center gap-1.5">
            Writing your personalized read
            <span className="inline-flex gap-0.5">
              <Dot /> <Dot delay="0.15s" /> <Dot delay="0.3s" />
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

function Dot({ delay = "0s" }: { delay?: string }) {
  return (
    <span
      className="bg-faint inline-block size-1.5 animate-pulse rounded-full"
      style={{ animationDelay: delay }}
    />
  );
}
