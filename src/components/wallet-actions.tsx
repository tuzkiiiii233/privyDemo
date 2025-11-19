"use client";

import { useState } from "react";
import { ethers } from "ethers";

interface WalletActionsProps {
  address: string;
}

export default function WalletActions({ address }: WalletActionsProps) {
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");

  // 发送 ETH
  const sendTransaction = async () => {
    setLoading(true);
    setError("");
    setTxHash("");

    try {
      const ethereum = (window as any).ethereum;

      const txHash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: address,
            to: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", // 目标地址
            value: ethers.parseEther("0.001").toString(16), // 0.001 ETH
            gas: "0x5208", // 21000
          },
        ],
      });

      setTxHash(txHash);
      console.log("交易哈希:", txHash);
    } catch (err: any) {
      setError(err.message);
      console.error("交易失败:", err);
    } finally {
      setLoading(false);
    }
  };

  // 调用合约方法（示例：ERC20 转账）
  const callContract = async () => {
    setLoading(true);
    setError("");
    setTxHash("");

    try {
      const ethereum = (window as any).ethereum;

      // ERC20 合约地址（示例：USDT）
      const contractAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";

      // ERC20 transfer 方法的 ABI
      const transferAbi = ["function transfer(address to, uint256 amount)"];
      const iface = new ethers.Interface(transferAbi);

      // 编码函数调用
      const data = iface.encodeFunctionData("transfer", [
        "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", // 接收地址
        ethers.parseUnits("1", 6), // 1 USDT (6 decimals)
      ]);

      const txHash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: address,
            to: contractAddress,
            data: data,
            gas: "0x186a0", // 100000
          },
        ],
      });

      setTxHash(txHash);
      console.log("合约调用交易哈希:", txHash);
    } catch (err: any) {
      setError(err.message);
      console.error("合约调用失败:", err);
    } finally {
      setLoading(false);
    }
  };

  // 读取合约数据（示例：查询 ERC20 余额）
  const readContract = async () => {
    setLoading(true);
    setError("");

    try {
      const ethereum = (window as any).ethereum;

      // ERC20 合约地址
      const contractAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";

      // balanceOf 方法的 ABI
      const balanceOfAbi = [
        "function balanceOf(address owner) view returns (uint256)",
      ];
      const iface = new ethers.Interface(balanceOfAbi);

      // 编码函数调用
      const data = iface.encodeFunctionData("balanceOf", [address]);

      const result = await ethereum.request({
        method: "eth_call",
        params: [
          {
            to: contractAddress,
            data: data,
          },
          "latest",
        ],
      });

      // 解码返回值
      const balance = iface.decodeFunctionResult("balanceOf", result)[0];
      console.log("余额:", ethers.formatUnits(balance, 6), "USDT");
      alert(`余额: ${ethers.formatUnits(balance, 6)} USDT`);
    } catch (err: any) {
      setError(err.message);
      console.error("读取失败:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">钱包操作</h3>

      <div className="space-y-3">
        <button
          onClick={sendTransaction}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "处理中..." : "发送 0.001 ETH"}
        </button>

        <button
          onClick={callContract}
          disabled={loading}
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "处理中..." : "调用合约（转账 USDT）"}
        </button>

        <button
          onClick={readContract}
          disabled={loading}
          className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
        >
          {loading ? "处理中..." : "读取合约（查询余额）"}
        </button>
      </div>

      {txHash && (
        <div className="mt-4 p-3 bg-green-50 rounded">
          <p className="text-sm text-green-800">交易成功！</p>
          <p className="text-xs font-mono break-all mt-1">{txHash}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 rounded">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
