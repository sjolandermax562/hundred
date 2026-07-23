"use client";

type Row = {
  name: string;
  ms: number | null;
  label: string;
  highlight?: boolean;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export default function ComparisonGrid({
  robinhoodMs,
}: {
  robinhoodMs: number | null;
}) {
  const rows: Row[] = [
    {
      name: "Robinhood Chain",
      ms: robinhoodMs,
      label: robinhoodMs != null ? `${robinhoodMs} ms measured` : "measuring",
      highlight: true,
    },
    { name: "Solana", ms: 400, label: "400 ms claimed" },
    { name: "Ethereum", ms: 12000, label: "12 s" },
    { name: "NYSE settlement", ms: DAY_MS, label: "T+1, one day" },
  ];

  const maxLog = Math.log10(DAY_MS);
  const minLog = Math.log10(50);
  const scale = (ms: number) =>
    Math.max(2, ((Math.log10(Math.max(ms, 1)) - minLog) / (maxLog - minLog)) * 100);

  return (
    <div className="border border-ink bg-ink" style={{ display: "grid", gap: 1 }}>
      <div className="grid grid-cols-12 bg-paper">
        <div className="col-span-4 px-3 py-2 font-mono text-[10px] tracking-widest2 uppercase text-ash">
          [ ledger of clocks ]
        </div>
        <div className="col-span-8 px-3 py-2 text-right font-mono text-[10px] tracking-widest2 uppercase text-ash">
          bars on log scale
        </div>
      </div>
      {rows.map((r) => (
        <div
          key={r.name}
          className={`grid grid-cols-12 items-center bg-paper ${
            r.highlight ? "outline outline-1 outline-hazard -outline-offset-1" : ""
          }`}
        >
          <div className="col-span-4 border-r border-ink px-3 py-4">
            <div
              className={`font-mono text-[11px] tracking-widest uppercase ${
                r.highlight ? "text-hazard font-bold" : ""
              }`}
            >
              {r.name}
            </div>
            <div className="font-mono text-[10px] tracking-widest uppercase text-ash">
              {r.label}
            </div>
          </div>
          <div className="col-span-8 px-3 py-4">
            <div
              className={`h-4 ${r.highlight ? "bg-hazard" : "bg-ink"}`}
              style={{ width: r.ms != null ? `${scale(r.ms)}%` : "2%" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
