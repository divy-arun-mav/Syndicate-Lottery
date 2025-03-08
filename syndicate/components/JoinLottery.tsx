"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWeb3 } from "@/context/Web3Provider";
import toast from "react-hot-toast";
import { ethers } from "ethers";

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

// Ticket mapping between names and numbers
const ticketMapping: { [key: string]: number } = {
  A1: 1, A2: 2, A3: 3,
  B1: 4, B2: 5, B3: 6,
  C1: 7, C2: 8, C3: 9,
};

const reverseTicketMapping: { [key: number]: string } = Object.fromEntries(
  Object.entries(ticketMapping).map(([key, value]) => [value, key])
);

export default function JoinLottery() {
  const router = useRouter();
  const { id } = useParams(); // Lottery ID from URL
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<string>("--:--:--");
  const [lottery, setLottery] = useState<any>(null);
  const [unavailableTickets, setUnavailableTickets] = useState<string[]>([]);
  const { contract, walletAddress } = useWeb3();

  // Fetch lottery details and purchased tickets
  useEffect(() => {
    const fetchLotteryDetails = async () => {
      if (!contract) return toast.error("Contract not initialized");
      try {
        const tx = await contract.lotteries(id);
        const startTime = tx.startTime.toNumber();
        const duration = tx.duration.toNumber();
        const entryFee = ethers.utils.formatEther(tx.ticketPrice);
        const prizePool = ethers.utils.formatEther(tx.prizePool);

        setLottery({
          id,
          startTime,
          duration,
          entryFee,
          prizePool,
        });

        startCountdown(startTime + duration);
      } catch (error) {
        console.error("Error fetching lottery:", error);
        toast.error("Failed to load lottery data");
      }
    };

    const fetchPurchasedTickets = async () => {
      if (!contract) return;
      try {
        const [buyers, ticketNumbers] = await contract.getPurchasedTickets(id);
        const purchasedTicketNames = ticketNumbers.map((num: number) => reverseTicketMapping[num]);

        setUnavailableTickets(purchasedTicketNames);
      } catch (error) {
        console.error("Error fetching purchased tickets:", error);
      }
    };

    if (id) {
      fetchLotteryDetails();
      fetchPurchasedTickets();
    }
  }, [contract, id]);

  // Countdown Timer Logic
  const startCountdown = (endTime: number) => {
    const updateCountdown = () => {
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = endTime - now;
      if (timeLeft <= 0) {
        setCountdown("🎉 Lottery Ended!");
        return;
      }

      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      const seconds = timeLeft % 60;
      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  };

  const toggleTicketSelection = (ticket: string) => {
    if (unavailableTickets.includes(ticket)) return;

    // Allow only one ticket selection at a time
    setSelectedTicket(ticket === selectedTicket ? null : ticket);
  };

  const handlePurchase = async () => {
    if (!selectedTicket) {
      return toast.error("Please select a ticket!");
    }
    if (!contract) {
      return toast.error("Contract not initialized");
    }

    try {
      const ticketNumber = ticketMapping[selectedTicket]; // Get mapped number
      if (ticketNumber === undefined) {
        return toast.error("Invalid ticket selection");
      }

      const totalCost = ethers.utils.parseEther(lottery.entryFee);

      const tx = await contract.buyTicket(id, ticketNumber, { value: totalCost });
      await tx.wait();

      toast.success(`✅ Ticket Purchased: ${selectedTicket}`);
      setUnavailableTickets((prev) => [...prev, selectedTicket]);
      setSelectedTicket(null);
      router.push(`/lot/${id}`);
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("Failed to purchase ticket");
    }
  };

  const tickets = generateTickets(); // Get all tickets

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
      <h2 className="text-3xl font-bold text-blue-500">🎟 Select Your Lottery Ticket</h2>
      <p className="text-sm text-gray-500">Choose your lucky number!</p>

      {/* Lottery Ticket Info */}
      {lottery ? (
        <Card className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold">Lottery #{id}</h3>
          <p className="text-sm">Prize Pool: <strong>{lottery.prizePool} ETH</strong></p>
          <p className="text-sm">Entry Fee: <strong>{lottery.entryFee} ETH</strong></p>
          <p className="text-lg font-semibold text-yellow-300">⏳ Time Left: {countdown}</p>
        </Card>
      ) : (
        <p>Loading lottery details...</p>
      )}

      {/* Ticket Selection Grid */}
      <div className="mt-4 text-left">
        <label className="block text-md font-semibold text-gray-700">Select Your Ticket Number</label>
        <div className="grid grid-cols-5 gap-3 mt-2">
          {tickets.map((ticket) => (
            <div
              key={ticket}
              className={`w-10 h-10 flex items-center justify-center rounded-md font-bold cursor-pointer transition-all
              ${unavailableTickets.includes(ticket)
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : selectedTicket === ticket
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

      {/* Selected Ticket & Price */}
      <div className="mt-4 text-lg font-semibold text-gray-700">
        Selected Ticket: <span className="text-blue-500">{selectedTicket || "None"}</span>
      </div>
      <div className="mt-2 text-lg font-semibold text-gray-700">
        Total Cost: <span className="text-green-500">{selectedTicket ? lottery?.entryFee : "0.00"}</span> ETH
      </div>

      {/* Purchase Ticket Button */}
      <Button onClick={handlePurchase} className="mt-6 w-full" disabled={!selectedTicket}>
        🎫 Purchase Ticket
      </Button>
    </div>
  );
}