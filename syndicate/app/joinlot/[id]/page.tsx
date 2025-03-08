"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const ticketPrice = 0.05; // Entry fee per ticket
const unavailableTickets = [3, 7, 15, 18]; // Simulating sold tickets

export default function LotteryPurchase() {
  const { id } = useParams(); // Get lottery ID from the URL
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [countdown, setCountdown] = useState<string>("--:--:--");

  // Fetch Lottery Data (Simulated)
  const lottery = {
    name: `Lottery #${id}`,
    prizePool: "Ξ 5 ETH",
    entryFee: `Ξ ${ticketPrice}`,
    timeLeft: "1h 30m"
  };

  // Countdown Timer Logic
  useEffect(() => {
    let time = 3600; // 1 hour countdown
    const interval = setInterval(() => {
      if (time <= 0) {
        setCountdown("🎉 Lottery Ended!");
        clearInterval(interval);
        return;
      }
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = time % 60;
      setCountdown(`${hours}:${minutes}:${seconds}`);
      time--;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleTicketSelection = (ticketNum: number) => {
    if (unavailableTickets.includes(ticketNum)) return;

    setSelectedNumbers((prev) =>
      prev.includes(ticketNum) ? prev.filter((num) => num !== ticketNum) : [...prev, ticketNum]
    );
  };

  const handlePurchase = () => {
    if (selectedNumbers.length === 0) {
      alert("Please select at least one ticket!");
      return;
    }
    alert(`✅ Ticket(s) Purchased Successfully for ${lottery.name}: ${selectedNumbers.join(", ")}`);
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg text-center mx-auto mt-10">
      <h2 className="text-3xl font-bold text-blue-500">🎟 {lottery.name}</h2>
      <p className="text-sm text-gray-500">Choose your lucky number!</p>

      {/* Lottery Ticket Info */}
      <Card className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-4 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold">{lottery.name}</h3>
        <p className="text-sm">Prize Pool: <strong>{lottery.prizePool}</strong></p>
        <p className="text-sm">Entry Fee: <strong>{lottery.entryFee}</strong></p>
        <p className="text-lg font-semibold text-yellow-300">⏳ Time Left: {countdown}</p>
      </Card>

      {/* Ticket Selection Grid */}
      <div className="mt-4 text-left">
        <label className="block text-md font-semibold text-gray-700">Select Your Ticket Number</label>
        <div className="grid grid-cols-5 gap-3 mt-2">
          {Array.from({ length: 25 }, (_, i) => i + 1).map((ticketNum) => (
            <div
              key={ticketNum}
              className={`w-10 h-10 flex items-center justify-center rounded-md font-bold cursor-pointer transition-all
              ${
                unavailableTickets.includes(ticketNum)
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : selectedNumbers.includes(ticketNum)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-blue-400 hover:text-white"
              }`}
              onClick={() => toggleTicketSelection(ticketNum)}
            >
              {ticketNum}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Tickets & Price */}
      <div className="mt-4 text-lg font-semibold text-gray-700">
        Selected Tickets: <span className="text-blue-500">{selectedNumbers.length > 0 ? selectedNumbers.join(", ") : "None"}</span>
      </div>
      <div className="mt-2 text-lg font-semibold text-gray-700">
        Total Cost: <span className="text-green-500">{(selectedNumbers.length * ticketPrice).toFixed(2)}</span> ETH
      </div>

      {/* Purchase Ticket Button */}
      <Button onClick={handlePurchase} className="mt-6 w-full">
        🎫 Purchase Ticket
      </Button>
    </div>
  );
}
