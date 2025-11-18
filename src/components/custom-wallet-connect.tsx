"use client";

import { useState, useEffect } from "react";

interface CustomWalletConnectProps {
  onSuccess: (address: string, signature: string, message: string) => void;
}

export default function CustomWalletConnect({
  onSuccess,
}: CustomWalletConnectProps) {
  const [address, setAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      console.log("检测到钱包");
    }
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError("");

    try {
      const ethereum = (window as any).ethereum;

      if (!ethereum) {
        throw new Error("未检测到钱包，请确保在支持的 app 中打开");
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const walletAddress = accounts[0];
      setAddress(walletAddress);

      // 创建符合 SIWE 格式的消息
      const domain = window.location.host;
      const origin = window.location.origin;
      const nonce = Math.random().toString(36).substring(2, 15);
      const issuedAt = new Date().toISOString();

      const messageToSign = `${domain} wants you to sign in with your Ethereum account:
${walletAddress}

Sign in with Ethereum to the app.

URI: ${origin}
Version: 1
Chain ID: 1
Nonce: ${nonce}
Issued At: ${issuedAt}`;

      console.log("要签名的消息:", messageToSign);

      // 请求签名
      const signature = await ethereum.request({
        method: "personal_sign",
        params: [messageToSign, walletAddress],
      });

      console.log("签名成功:", { address: walletAddress, signature });

      onSuccess(walletAddress, signature, messageToSign);
    } catch (err: any) {
      console.error("连接失败:", err);
      setError(err.message || "连接失败");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold">连接钱包</h2>

      {address ? (
        <div className="text-center">
          <p className="text-green-600 mb-2">✓ 已连接</p>
          <p className="text-sm text-gray-600 break-all">{address}</p>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isConnecting ? "连接中..." : "连接 App 钱包"}
        </button>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
