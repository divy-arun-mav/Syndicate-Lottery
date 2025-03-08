"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Simulated Participants Data
const mockParticipants = [
  { name: "Alice", ticket: "A1" },
  { name: "Bob", ticket: "B2" },
  { name: "Charlie", ticket: "C3" },
  { name: "David", ticket: "A3" },
];

export default function LotteryDashboard() {
  const { id } = useParams();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(10); // 1 hour in seconds

  // Countdown Timer Logic
  useEffect(() => {
    if (timeLeft <= 0) {
      router.push(`/result/${id}`); // Navigate to results page
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, router, id]);

  // Format countdown into HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg text-center mx-auto mt-10">
      <h2 className="text-4xl font-bold text-blue-500">🎉 Lottery #{id} Dashboard</h2>
      <p className="text-lg text-gray-500 mt-2">See the prize pool, participants, and result time!</p>

      {/* Prize Pool */}
      <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-lg shadow-lg mt-6">
        <h3 className="text-2xl font-bold">💰 Prize Pool: 5 ETH</h3>
      </Card>

      {/* Countdown Timer */}
      <div className="text-2xl font-bold text-orange-500 mt-6">
        ⏳ Result in: {timeLeft > 0 ? formatTime(timeLeft) : "🎉 Winner Announced!"}
      </div>

      {/* Participants List */}
      <div className="mt-6 text-left">
        <h3 className="text-2xl font-semibold text-gray-700">👥 Participants</h3>
        <div className="bg-gray-100 p-4 rounded-lg mt-2 max-h-60 overflow-y-auto">
          {mockParticipants.map((user, index) => (
            <div key={index} className="flex items-center gap-4 border-b p-2 last:border-b-0">
              <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full text-lg font-bold">
                {user.name[0]}
              </div>
              <div>
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-md text-gray-500">Ticket #{user.ticket}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <Button onClick={() => router.push("/joinlot")} className="mt-8 w-full">
        🔙 Back to Home
      </Button>
    </div>
  );
}
