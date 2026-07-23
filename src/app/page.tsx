"use client";

import { motion } from "framer-motion";
import { useChain } from "@/lib/useChain";
import Metronome from "@/components/Metronome";
import ComparisonGrid from "@/components/ComparisonGrid";
import WalletChip from "@/components/WalletChip";

const fade = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

function Barcode({ seed = 0 }: { seed?: number }) {
  const widths = ["w", "w2", "w", "w3", "w", "w", "w2", "w3", "w", "w2", "w", "w"];
  return (
    <div className="barcode" aria-hidden>
      {widths.map((w, i) => (
        <i
          key={i}
          className={`${w === "w" ? "" : w} ${(i + seed) % 7 === 3 ? "red" : ""}`}
        />
      ))}
    </div>
  );
}

export default function Page() {
  const { sample, error, displayBlock } = useChain(3000);

  const blockStr =
    displayBlock > 0
      ? Math.floor(displayBlock).toLocaleString("en-US")
      : "---";

  return (
    <main className="min-h-screen bg-paper text-ink">
      {/* top rule / header */}
      <header className="flex items-center justify-between border-b border-ink px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="regmark" aria-hidden />
          <span className="font-display text-sm uppercase tracking-tightest">
            Hundred
          </span>
          <span className="font-mono text-[10px] tracking-widest2 uppercase text-ash">
            rev 1.0
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Barcode />
          <WalletChip />
        </div>
      </header>

      {/* hero */}
      <motion.section {...fade} className="relative overflow-hidden px-4 pt-10">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[10px] tracking-widest2 uppercase text-ash">
            [ block height, live ]
          </span>
          <span className="font-mono text-[10px] tracking-widest2 uppercase text-hazard">
            robinhood chain
          </span>
        </div>
        <h1
          className="font-display uppercase leading-[0.85] tracking-tightest text-ink"
          style={{ fontSize: "clamp(4rem, 14vw, 16rem)", marginLeft: "-0.06em" }}
        >
          {blockStr}
        </h1>
        <div className="mt-4 flex items-end justify-between border-t border-ink pt-3 pb-2">
          <p className="font-display text-2xl uppercase tracking-tightest md:text-4xl">
            one hundred milliseconds<span className="text-hazard">.</span>
          </p>
          <div className="flex items-center gap-2 pb-1">
            <span className="h-2 w-2 bg-hazard live-dot" />
            <span className="font-mono text-[10px] tracking-widest2 uppercase text-ash">
              {error ? "rpc offline" : "live"}
            </span>
          </div>
        </div>
      </motion.section>

      {/* metronome */}
      <motion.section {...fade} className="mt-6">
        <Metronome
          avgBlockMs={sample?.avgBlockMs ?? null}
          confirmedAt={sample?.receivedAt ?? null}
        />
      </motion.section>

      {/* readouts */}
      <motion.section
        {...fade}
        className="mt-0 grid grid-cols-2 border-b border-ink bg-ink md:grid-cols-4"
        style={{ gap: 1 }}
      >
        {[
          {
            k: "block",
            v: sample ? sample.blockNumber.toLocaleString("en-US") : "---",
          },
          {
            k: "avg block ms",
            v: sample ? `${sample.avgBlockMs}` : "---",
            red: true,
          },
          {
            k: "gas used %",
            v: sample ? `${sample.gasUsedPct.toFixed(1)}` : "---",
          },
          { k: "source", v: "public rpc" },
        ].map((r) => (
          <div key={r.k} className="bg-paper px-4 py-5">
            <div className="font-mono text-[10px] tracking-widest2 uppercase text-ash">
              {r.k}
            </div>
            <div
              className={`mt-2 font-mono text-xl font-bold uppercase tracking-widest ${
                r.red ? "text-hazard" : ""
              }`}
            >
              {r.v}
            </div>
          </div>
        ))}
      </motion.section>

      {/* comparison */}
      <motion.section {...fade} className="px-4 py-12">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-widest2 uppercase text-ash">
            [ against the old clocks ]
          </span>
          <Barcode seed={3} />
        </div>
        <ComparisonGrid robinhoodMs={sample?.avgBlockMs ?? null} />
        <p className="mt-4 max-w-xl font-mono text-[11px] leading-relaxed tracking-wider uppercase text-ash">
          finance settled in days, then in seconds. this page reads the chain
          itself and reports what it finds. the figure on the robinhood row is
          measured across the last twenty blocks, not taken from a slide deck.
        </p>
      </motion.section>

      {/* footer */}
      <footer className="border-t border-ink px-4 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[10px] tracking-widest2 uppercase text-ash">
            measured live from the public rpc. the 100ms figure is theirs; the
            number above is yours.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-widest2 uppercase text-ash">
              hundred / rev 1.0
            </span>
            <div className="regmark" aria-hidden />
          </div>
        </div>
      </footer>
    </main>
  );
}
