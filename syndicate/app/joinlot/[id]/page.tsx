"use client";
import JoinLottery from "@/components/ui/JoinLottery";

export default function Dashboard() {
  const handlePurchase = (lotteryData: any) => {
    console.log("Lottery Created:", lotteryData);
    // Implement your logic to handle the created lottery data
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-lg">
        <JoinLottery onPurchase={handlePurchase} />
      </div>
    </div>
  );
}
