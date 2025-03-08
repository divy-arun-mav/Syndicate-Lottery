"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Ticket configuration
const ticketPrice = 0.05; // Entry fee per ticket
const unavailableTickets = ["A3", "B1", "B7", "C2"]; // Simulating sold tickets

// Generate all ticket names (A1, A2, A3, B1, etc.)
const generateTickets = (): string[] => {
  const series = ["A", "B", "C"];
  const numbers = [1, 2, 3];
  let tickets: string[] = [];
  series.forEach((s) => {
    numbers.forEach((n) => {
      tickets.push(`${s}${n}`);
    });
  });
  return tickets;
};

export default function JoinLottery({ lotteryId }: { lotteryId: string }) {
  const router = useRouter();
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<string>("--:--:--");

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

  const toggleTicketSelection = (ticket: string) => {
    if (unavailableTickets.includes(ticket)) return;

    setSelectedNumbers((prev) =>
      prev.includes(ticket) ? prev.filter((num) => num !== ticket) : [...prev, ticket]
    );
  };

  const handlePurchase = () => {
    if (selectedNumbers.length === 0) {
      alert("Please select at least one ticket!");
      return;
    }

    alert(`✅ Ticket(s) Purchased Successfully: ${selectedNumbers.join(", ")}`);

    // ✅ Redirect to the lottery's main page
    router.push(`/lot/${lotteryId}`);
  };

  const tickets = generateTickets(); // Get all tickets

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
      <h2 className="text-3xl font-bold text-blue-500">🎟 Select Your Lottery Ticket</h2>
      <p className="text-sm text-gray-500">Choose your lucky number!</p>

      {/* Lottery Ticket Info */}
      <Card className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-4 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold">Lottery #{lotteryId}</h3>
        <p className="text-sm">Prize Pool: <strong>5 ETH</strong></p>
        <p className="text-sm">Entry Fee: <strong>{ticketPrice} ETH</strong></p>
        <p className="text-lg font-semibold text-yellow-300">⏳ Time Left: {countdown}</p>
      </Card>

      {/* Ticket Selection Grid */}
      <div className="mt-4 text-left">
        <label className="block text-md font-semibold text-gray-700">Select Your Ticket Number</label>
        <div className="grid grid-cols-5 gap-3 mt-2">
          {tickets.map((ticket) => (
            <div
              key={ticket}
              className={`w-10 h-10 flex items-center justify-center rounded-md font-bold cursor-pointer transition-all
              ${
                unavailableTickets.includes(ticket)
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : selectedNumbers.includes(ticket)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-blue-400 hover:text-white"
              }`}
              onClick={() => toggleTicketSelection(ticket)}
            >
              {ticket}
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
