"use client";

import { useEffect, useRef, useState } from "react";

export type ChainSample = {
  blockNumber: number;
  blockTimestamp: number;
  avgBlockMs: number;
  gasUsedPct: number;
  serverTime: number;
  receivedAt: number;
};

export function useChain(pollMs = 3000) {
  const [sample, setSample] = useState<ChainSample | null>(null);
  const [prev, setPrev] = useState<ChainSample | null>(null);
  const [error, setError] = useState<string | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    let timer: ReturnType<typeof setTimeout>;

    async function tick() {
      try {
        const res = await fetch("/api/chain", { cache: "no-store" });
        if (!res.ok) throw new Error(`api ${res.status}`);
        const json = await res.json();
        if (!alive.current) return;
        setSample((cur) => {
          setPrev(cur);
          return { ...json, receivedAt: Date.now() };
        });
        setError(null);
      } catch (e) {
        if (alive.current) setError(String(e));
      } finally {
        if (alive.current) timer = setTimeout(tick, pollMs);
      }
    }
    tick();
    return () => {
      alive.current = false;
      clearTimeout(timer);
    };
  }, [pollMs]);

  // Interpolated display block: flows forward at the measured cadence
  // between polls so the counter keeps moving.
  const [displayBlock, setDisplayBlock] = useState<number>(0);
  useEffect(() => {
    let raf: number;
    function frame() {
      setDisplayBlock(() => {
        if (!sample) return 0;
        const elapsed = Date.now() - sample.receivedAt;
        const cadence = sample.avgBlockMs > 0 ? sample.avgBlockMs : 100;
        const projected = sample.blockNumber + elapsed / cadence;
        // never run more than a few blocks ahead of the last confirmed sample
        const cap = sample.blockNumber + (pollMs / cadence) * 1.5;
        return Math.min(projected, cap);
      });
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [sample, pollMs]);

  return { sample, prev, error, displayBlock };
}
