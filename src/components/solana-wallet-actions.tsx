"use client";

import { useState } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

interface SolanaWalletActionsProps {
  address: string;
}

export default function SolanaWalletActions({
  address,
}: SolanaWalletActionsProps) {
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState("");
  const [error, setError] = useState("");
  const [balance, setBalance] = useState<number | null>(null);

  // RPC 连接（使用 devnet）
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  // 查询余额
  const getBalance = async () => {
    setLoading(true);
    setError("");

    try {
      const solana = (window as any).solana;
      if (!solana) throw new Error("未检测到钱包");

      const publicKey = new PublicKey(address);
      const balance = await connection.getBalance(publicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;

      setBalance(solBalance);
      console.log("余额:", solBalance, "SOL");
    } catch (err: any) {
      setError(err.message);
      console.error("查询余额失败:", err);
    } finally {
      setLoading(false);
    }
  };

  // 发送 SOL
  const sendTransaction = async () => {
    setLoading(true);
    setError("");
    setTxSignature("");

    try {
      const solana = (window as any).solana;
      if (!solana) throw new Error("未检测到钱包");

      const fromPubkey = new PublicKey(address);
      const toPubkey = new PublicKey(
        "9B5XszUGdMaxCZ7uSQhPzdks5ZQSmWxrmzCSvtJ6Ns6g" // 示例地址
      );

      // 创建转账交易
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: 0.001 * LAMPORTS_PER_SOL, // 0.001 SOL
        })
      );

      // 获取最新区块哈希
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      // 签名并发送
      const signed = await solana.signAndSendTransaction(transaction);
      setTxSignature(signed.signature);

      console.log("交易签名:", signed.signature);
    } catch (err: any) {
      setError(err.message);
      console.error("交易失败:", err);
    } finally {
      setLoading(false);
    }
  };

  // 签名交易（不发送）
  const signTransaction = async () => {
    setLoading(true);
    setError("");

    try {
      const solana = (window as any).solana;
      if (!solana) throw new Error("未检测到钱包");

      const fromPubkey = new PublicKey(address);
      const toPubkey = new PublicKey(
        "9B5XszUGdMaxCZ7uSQhPzdks5ZQSmWxrmzCSvtJ6Ns6g"
      );

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: 0.001 * LAMPORTS_PER_SOL,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      // 只签名，不发送
      const signedTx = await solana.signTransaction(transaction);
      console.log("交易已签名:", signedTx);
      alert("交易已签名（未发送）");
    } catch (err: any) {
      setError(err.message);
      console.error("签名失败:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Solana 钱包操作</h3>

      <div className="space-y-3">
        <button
          onClick={getBalance}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "查询中..." : "查询余额"}
        </button>

        {balance !== null && (
          <div className="p-3 bg-blue-50 rounded text-center">
            <p className="text-lg font-bold text-blue-800">
              {balance.toFixed(4)} SOL
            </p>
          </div>
        )}

        <button
          onClick={sendTransaction}
          disabled={loading}
          className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
        >
          {loading ? "处理中..." : "发送 0.001 SOL"}
        </button>

        <button
          onClick={signTransaction}
          disabled={loading}
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "处理中..." : "签名交易（不发送）"}
        </button>
      </div>

      {txSignature && (
        <div className="mt-4 p-3 bg-green-50 rounded">
          <p className="text-sm text-green-800">交易成功！</p>
          <p className="text-xs font-mono break-all mt-1">{txSignature}</p>
          <a
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-xs hover:underline mt-2 block"
          >
            在 Solana Explorer 查看
          </a>
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
