"use client";

import { useState } from "react";
import CustomWalletConnect from "@/components/custom-wallet-connect";
import WalletActions from "@/components/wallet-actions";
import SolanaWalletConnect from "@/components/solana-wallet-connect";
import SolanaWalletActions from "@/components/solana-wallet-actions";

type Chain = "ethereum" | "solana";

export default function MultiChainPage() {
  const [selectedChain, setSelectedChain] = useState<Chain>("ethereum");
  const [ethVerified, setEthVerified] = useState(false);
  const [ethAddress, setEthAddress] = useState("");
  const [solVerified, setSolVerified] = useState(false);
  const [solAddress, setSolAddress] = useState("");

  const handleEthSuccess = (
    address: string,
    signature: string,
    message: string
  ) => {
    console.log("以太坊连接成功:", { address, signature, message });
    setEthAddress(address);
    setEthVerified(true);
  };

  const handleSolSuccess = (
    address: string,
    signature: string,
    message: string
  ) => {
    console.log("Solana 连接成功:", { address, signature, message });
    setSolAddress(address);
    setSolVerified(true);
  };

  const resetEth = () => {
    setEthVerified(false);
    setEthAddress("");
  };

  const resetSol = () => {
    setSolVerified(false);
    setSolAddress("");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">多链钱包连接</h1>

        {/* 链选择器 */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => setSelectedChain("ethereum")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedChain === "ethereum"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            以太坊
          </button>
          <button
            onClick={() => setSelectedChain("solana")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedChain === "solana"
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Solana
          </button>
        </div>

        {/* 以太坊部分 */}
        {selectedChain === "ethereum" && (
          <div className="space-y-4">
            {!ethVerified ? (
              <CustomWalletConnect onSuccess={handleEthSuccess} />
            ) : (
              <>
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <h2 className="text-2xl font-bold text-green-600 mb-4">
                    ✓ 以太坊钱包已连接
                  </h2>
                  <p className="text-gray-600 mb-2">地址：</p>
                  <p className="text-sm font-mono bg-gray-100 p-3 rounded break-all">
                    {ethAddress}
                  </p>
                  <button
                    onClick={resetEth}
                    className="mt-4 text-blue-600 hover:underline"
                  >
                    断开连接
                  </button>
                </div>
                <WalletActions address={ethAddress} />
              </>
            )}
          </div>
        )}

        {/* Solana 部分 */}
        {selectedChain === "solana" && (
          <div className="space-y-4">
            {!solVerified ? (
              <SolanaWalletConnect onSuccess={handleSolSuccess} />
            ) : (
              <>
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <h2 className="text-2xl font-bold text-green-600 mb-4">
                    ✓ Solana 钱包已连接
                  </h2>
                  <p className="text-gray-600 mb-2">地址：</p>
                  <p className="text-sm font-mono bg-gray-100 p-3 rounded break-all">
                    {solAddress}
                  </p>
                  <button
                    onClick={resetSol}
                    className="mt-4 text-purple-600 hover:underline"
                  >
                    断开连接
                  </button>
                </div>
                <SolanaWalletActions address={solAddress} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
