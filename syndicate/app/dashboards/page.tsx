"use client";
import CreateLottery  from "@/components/ui/CreateLottery";

export default function Dashboard() {
  const handleLotteryCreate = (lotteryData: any) => {
    console.log("Lottery Created:", lotteryData);
    // Implement your logic to handle the created lottery data
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
      <CreateLottery onCreate={handleLotteryCreate} />
    </div>
  );
}
