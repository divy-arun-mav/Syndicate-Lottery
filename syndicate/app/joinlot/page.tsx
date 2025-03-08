"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useWeb3 } from "@/context/Web3Provider";
import { ethers } from "ethers";

export default function ActiveLotteries() {
  const router = useRouter();
  const { contract } = useWeb3();
  const [lotteries, setLotteries] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLotteries = async () => {
      if (!contract) return;
      try {
        setLoading(true);
        const count = await contract.lotteryCount();
        const totalLotteries = count.toNumber(); // Convert BigNumber to number
        const fetchedLotteries = [];

        for (let i = 1; i <= totalLotteries; i++) {
          const lottery = await contract.lotteries(i); 
          console.log(lottery);
          fetchedLotteries.push({
            id: i,
            // name: lottery.name,
            prizePool: `${ethers.utils.formatEther(lottery.prizePool)}`,
            entryFee: ` ${ethers.utils.formatEther(lottery.entryFee)}`,
            timeLeft: `${lottery.timeLeft.toNumber()} seconds`,
          });
        }

        setLotteries(fetchedLotteries);
      } catch (error) {
        console.error("Error fetching lotteries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLotteries();
  }, [contract]);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">🎟 Active Lotteries</h1>

      {loading ? (
        <p className="text-center">⏳ Loading lotteries...</p>
      ) : lotteries.length === 0 ? (
        <p className="text-center">❌ No active lotteries found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lotteries.map((lottery) => (
            <Card
              key={lottery.id}
              className="p-4 cursor-pointer transition-all hover:shadow-lg border border-gray-200 rounded-lg"
              onClick={() => router.push(`/joinlot/${lottery.id}`)}
            >
              <h2 className="text-xl font-semibold">{lottery.name}</h2>
              <p className="text-sm text-gray-600">💰 Prize Pool: <strong>{lottery.prizePool}</strong></p>
              <p className="text-sm text-gray-600">🎟 Entry Fee: <strong>{lottery.entryFee}</strong></p>
              <p className="text-sm text-red-500 font-semibold">⏳ {lottery.timeLeft} left</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}