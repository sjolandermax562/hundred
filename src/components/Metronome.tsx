"use client";

import { useEffect, useRef } from "react";

type Props = {
  avgBlockMs: number | null;
  confirmedAt: number | null; // Date.now() of last confirmed sample
};

const SPACING_PX = 48;

export default function Metronome({ avgBlockMs, confirmedAt }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ avgBlockMs, confirmedAt });
  stateRef.current = { avgBlockMs, confirmedAt };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const origin = { current: 0 };

    function draw() {
      const c = canvasRef.current;
      if (!c) return;
      const dpr = window.devicePixelRatio || 1;
      const w = c.clientWidth;
      const h = c.clientHeight;
      if (c.width !== w * dpr) {
        c.width = w * dpr;
        c.height = h * dpr;
      }
      const g = c.getContext("2d");
      if (!g) return;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);

      const { avgBlockMs: cadence, confirmedAt: confirmed } = stateRef.current;
      const now = Date.now();
      if (!origin.current) origin.current = now;

      // baseline rule
      g.fillStyle = "#111111";
      g.fillRect(0, Math.floor(h / 2), w, 1);

      if (!cadence || cadence <= 0) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const pxPerMs = SPACING_PX / cadence;

      // synthetic cadence ticks sweeping left, spacing from real measurement
      const first =
        origin.current +
        Math.floor((now - origin.current - w / pxPerMs) / cadence) * cadence;
      for (let t = first; t <= now; t += cadence) {
        const x = w - (now - t) * pxPerMs;
        if (x < -4) continue;
        const isZero = Math.round((t - origin.current) / cadence) % 10 === 0;
        g.fillStyle = "#111111";
        g.fillRect(Math.round(x), isZero ? h / 2 - 14 : h / 2 - 8, 1, isZero ? 28 : 16);
      }

      // red tick: last confirmed block
      if (confirmed) {
        const x = w - (now - confirmed) * pxPerMs;
        if (x > -4 && x < w + 4) {
          g.fillStyle = "#E61919";
          g.fillRect(Math.round(x) - 1, h / 2 - 20, 3, 40);
        }
      }

      // head marker at right edge
      g.fillStyle = "#111111";
      g.fillRect(w - 1, h / 2 - 24, 2, 48);

      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative h-24 w-full border-y border-ink">
      <canvas ref={canvasRef} className="h-full w-full" />
      <span className="absolute left-0 top-2 px-3 font-mono text-[10px] tracking-widest2 uppercase text-ash">
        [ cadence ]
      </span>
      <span className="absolute right-0 top-2 px-3 font-mono text-[10px] tracking-widest2 uppercase text-ash">
        1 tick = 1 block
      </span>
    </div>
  );
}
