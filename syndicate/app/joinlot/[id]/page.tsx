"use client";

import { useParams } from "next/navigation";
import JoinLottery from "@/components/JoinLottery";

export default function JoinLotteryPage() {
  const { id } = useParams(); // Get lottery ID from the URL

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-lg">
        <JoinLottery lotteryId={id as string} />
      </div>
    </div>
  );
}
