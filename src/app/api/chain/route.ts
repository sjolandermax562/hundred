import { NextResponse } from "next/server";

export const revalidate = 3;
export const dynamic = "force-dynamic";

const RPC_URL =
  process.env.ROBINHOOD_RPC_URL || "https://rpc.mainnet.chain.robinhood.com";

async function rpc(method: string, params: unknown[]) {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`rpc http ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error.message || "rpc error");
  return json.result;
}

export async function GET() {
  try {
    const blockHex: string = await rpc("eth_blockNumber", []);
    const latest = parseInt(blockHex, 16);
    const anchor = Math.max(latest - 20, 0);
    const anchorHex = "0x" + anchor.toString(16);

    const [bLatest, bAnchor] = await Promise.all([
      rpc("eth_getBlockByNumber", [blockHex, false]),
      rpc("eth_getBlockByNumber", [anchorHex, false]),
    ]);
    if (!bLatest || !bAnchor) throw new Error("missing block");

    const tLatest = parseInt(bLatest.timestamp, 16);
    const tAnchor = parseInt(bAnchor.timestamp, 16);
    const span = latest - anchor;
    const avgBlockMs =
      span > 0 ? Math.round(((tLatest - tAnchor) * 1000) / span) : 0;

    const gasUsed = parseInt(bLatest.gasUsed, 16);
    const gasLimit = parseInt(bLatest.gasLimit, 16);
    const gasUsedPct =
      gasLimit > 0
        ? Math.round((gasUsed / gasLimit) * 1000) / 10
        : 0;

    return NextResponse.json({
      blockNumber: latest,
      blockTimestamp: tLatest,
      avgBlockMs,
      gasUsedPct,
      serverTime: Math.floor(Date.now() / 1000),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "upstream rpc failure", detail: String(err) },
      { status: 502 }
    );
  }
}
