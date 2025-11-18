"use client";

import { useState } from "react";
import CustomWalletConnect from "@/components/custom-wallet-connect";

export default function WalletConnectPage() {
  const [verified, setVerified] = useState(false);
  const [userAddress, setUserAddress] = useState("");

  const handleSuccess = async (
    address: string,
    signature: string,
    message: string
  ) => {
    console.log("钱包连接成功，开始验证...");
    console.log("地址:", address);
    console.log("签名:", signature);
    console.log("消息:", message);

    // 这里可以调用后端 API 验证签名
    // const response = await fetch("/api/verify-siwe", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ message, signature }),
    // });

    setUserAddress(address);
    setVerified(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {!verified ? (
          <CustomWalletConnect onSuccess={handleSuccess} />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              ✓ 验证成功
            </h2>
            <p className="text-gray-600 mb-2">已连接地址：</p>
            <p className="text-sm font-mono bg-gray-100 p-3 rounded break-all">
              {userAddress}
            </p>
            <button
              onClick={() => {
                setVerified(false);
                setUserAddress("");
              }}
              className="mt-4 text-blue-600 hover:underline"
            >
              断开连接
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
