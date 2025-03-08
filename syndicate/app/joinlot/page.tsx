"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

const lotteries = [
  { id: "1024", name: "Mega Jackpot", prizePool: "Ξ 20 ETH", entryFee: "Ξ 0.05", timeLeft: "2h 15m" },
  { id: "1025", name: "Lucky Spin", prizePool: "Ξ 5 ETH", entryFee: "Ξ 0.02", timeLeft: "1h 30m" },
  { id: "1026", name: "Weekly Draw", prizePool: "Ξ 10 ETH", entryFee: "Ξ 0.03", timeLeft: "5h 10m" },
  { id: "1027", name: "Crypto Raffle", prizePool: "Ξ 50 ETH", entryFee: "Ξ 0.1", timeLeft: "12h 00m" }
];

export default function ActiveLotteries() {
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">🎟 Active Lotteries</h1>

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
    </div>
  );
}
