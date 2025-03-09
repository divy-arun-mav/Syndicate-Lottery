"use client";
import CreateLottery from "@/components/CreateLottery";

export default function Dashboard() {
  const handleLotteryCreate = (lotteryData: any) => {
    console.log("Lottery Created:", lotteryData);
    // Implement your logic to handle the created lottery data
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6"
      style={{ backgroundColor: "rgba(25, 25, 164, 0.95)" }}
    >
      <div className="w-full max-w-lg">
        <CreateLottery onCreate={handleLotteryCreate} />
      </div>
    </div>
  );
}
