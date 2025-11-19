"use client";

import { useState, useEffect } from "react";
import bs58 from "bs58";

interface SolanaWalletConnectProps {
  onSuccess: (address: string, signature: string, message: string) => void;
}

export default function SolanaWalletConnect({
  onSuccess,
}: SolanaWalletConnectProps) {
  const [address, setAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).solana) {
      console.log("检测到 Solana 钱包");
    }
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError("");

    try {
      const solana = (window as any).solana;

      if (!solana) {
        throw new Error("未检测到 Solana 钱包，请确保在支持的 app 中打开");
      }

      // 连接钱包
      const response = await solana.connect();
      const publicKey = response.publicKey.toString();
      setAddress(publicKey);

      // 创建签名消息
      const message = `Sign in to app\n\nWallet: ${publicKey}\nTimestamp: ${new Date().toISOString()}`;
      const encodedMessage = new TextEncoder().encode(message);

      // 请求签名
      const signedMessage = await solana.signMessage(encodedMessage, "utf8");
      const signature = bs58.encode(signedMessage.signature);

      console.log("Solana 签名成功:", { address: publicKey, signature });

      onSuccess(publicKey, signature, message);
    } catch (err: any) {
      console.error("连接失败:", err);
      setError(err.message || "连接失败");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold">连接 Solana 钱包</h2>

      {address ? (
        <div className="text-center">
          <p className="text-green-600 mb-2">✓ 已连接</p>
          <p className="text-sm text-gray-600 break-all">{address}</p>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
        >
          {isConnecting ? "连接中..." : "连接 Solana 钱包"}
        </button>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
