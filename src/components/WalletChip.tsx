"use client";

import { useEvmWallet } from "@/lib/useEvmWallet";

export default function WalletChip() {
  const w = useEvmWallet();

  if (!w.hasProvider) {
    return (
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 bg-dim" />
        <span className="font-mono text-[10px] tracking-widest2 uppercase text-ash">
          spectator mode
        </span>
      </div>
    );
  }

  if (!w.account) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={w.connect}
          disabled={w.connecting}
          className="border border-ink px-4 py-2 font-mono text-[10px] tracking-widest2 uppercase hover:bg-ink hover:text-paper transition-colors duration-150"
        >
          {w.connecting ? "connecting" : "connect"}
        </button>
        <span className="font-mono text-[10px] tracking-widest2 uppercase text-ash">
          spectator mode
        </span>
      </div>
    );
  }

  const short = `${w.account.slice(0, 6)}...${w.account.slice(-4)}`;
  return (
    <div className="flex items-center gap-3">
      <span className="h-2 w-2 bg-hazard live-dot" />
      <span className="border border-ink px-4 py-2 font-mono text-[10px] tracking-widest2 uppercase">
        observer {short}
      </span>
      <button
        onClick={w.disconnect}
        className="font-mono text-[10px] tracking-widest2 uppercase text-ash hover:text-ink transition-colors duration-150"
      >
        disconnect
      </button>
      {w.wrongNetwork && (
        <span className="font-mono text-[10px] tracking-widest uppercase text-dim">
          wrong network
        </span>
      )}
    </div>
  );
}
