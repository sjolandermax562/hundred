"use client";

import { useCallback, useEffect, useState } from "react";

const CHAIN_ID = "0x1237";
const CHAIN_PARAMS = {
  chainId: CHAIN_ID,
  chainName: "Robinhood Chain",
  rpcUrls: ["https://rpc.mainnet.chain.robinhood.com"],
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  blockExplorerUrls: ["https://robinhoodchain.blockscout.com"],
};

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>;
      on: (event: string, cb: (...args: unknown[]) => void) => void;
      removeListener: (event: string, cb: (...args: unknown[]) => void) => void;
    };
  }
}

export type WalletState = {
  account: string | null;
  chainId: string | null;
  wrongNetwork: boolean;
  hasProvider: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
};

export function useEvmWallet(): WalletState {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const hasProvider = typeof window !== "undefined" && !!window.ethereum;

  const connect = useCallback(async () => {
    const eth = window.ethereum;
    if (!eth) return;
    setConnecting(true);
    try {
      const accounts = (await eth.request({
        method: "eth_requestAccounts",
      })) as string[];
      if (accounts && accounts[0]) setAccount(accounts[0]);

      try {
        await eth.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: CHAIN_ID }],
        });
        setChainId(CHAIN_ID);
      } catch (switchErr: unknown) {
        const code = (switchErr as { code?: number })?.code;
        if (code === 4902) {
          await eth.request({
            method: "wallet_addEthereumChain",
            params: [CHAIN_PARAMS],
          });
          setChainId(CHAIN_ID);
        }
      }
      const cid = (await eth.request({ method: "eth_chainId" })) as string;
      setChainId(cid);
    } catch {
      // user rejected or provider failed; stay a spectator
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAccount(null);
  }, []);

  useEffect(() => {
    const eth = window.ethereum;
    if (!eth) return;
    const onAccounts = (accs: unknown) => {
      const list = accs as string[];
      setAccount(list && list[0] ? list[0] : null);
    };
    const onChain = (cid: unknown) => setChainId(cid as string);
    eth.on("accountsChanged", onAccounts);
    eth.on("chainChanged", onChain);
    eth
      .request({ method: "eth_chainId" })
      .then((cid) => setChainId(cid as string))
      .catch(() => {});
    return () => {
      eth.removeListener("accountsChanged", onAccounts);
      eth.removeListener("chainChanged", onChain);
    };
  }, []);

  return {
    account,
    chainId,
    wrongNetwork: !!account && !!chainId && chainId.toLowerCase() !== CHAIN_ID,
    hasProvider,
    connecting,
    connect,
    disconnect,
  };
}
