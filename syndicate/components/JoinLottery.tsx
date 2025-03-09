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
    <>
      <div className="join-lottery-page">
        <div className="lottery-container">
          <h2 className="heading">
            🎟 Select Your Lottery Ticket
          </h2>
          <p className="subheading">Choose your lucky number!</p>

          {/* Lottery Ticket Info */}
          {lottery ? (
            <Card className="lottery-card">
              <h3 className="card-heading">Lottery #{id}</h3>
              <p className="card-text">
                Prize Pool: <strong>{lottery.prizePool}</strong>
              </p>
              <p className="card-text">
                Entry Fee: <strong>{lottery.entryFee} ETH</strong>
              </p>
              <p className="card-timer">
                ⏳ Time Left: {countdown}
              </p>
            </Card>
          ) : (
            <p>Loading lottery details...</p>
          )}

          {/* Ticket Selection Grid */}
          <div className="ticket-section">
            <label className="ticket-label">
              Select Your Ticket Number
            </label>
            <div className="ticket-grid">
              {tickets.map((ticket) => (
                <div
                  key={ticket}
                  className={`ticket 
                    ${
                      unavailableTickets.includes(ticket)
                        ? "ticket-unavailable"
                        : selectedTicket === ticket
                        ? "ticket-selected"
                        : "ticket-available"
                    }`}
                  onClick={() => toggleTicketSelection(ticket)}
                >
                  {ticket}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Ticket & Price */}
          <div className="ticket-summary">
            Selected Ticket:{" "}
            <span className="summary-highlight">
              {selectedTicket || "None"}
            </span>
          </div>
          <div className="ticket-summary">
            Total Cost: <span className="text-green-500">{selectedTicket ? lottery?.entryFee : "0.00"}</span> ETH
          </div>

          {/* Purchase Ticket Button */}
          <Button
            onClick={handlePurchase}
            className="purchase-button"
            disabled={!selectedTicket}
          >
            🎫 Purchase Ticket
          </Button>
        </div>
      </div>
      <style jsx>{`
        /* Overall Page Styling */
        .join-lottery-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #1A1A2E; /* Dark primary background */
          font-family: 'Roboto', sans-serif;
          padding: 1rem;
        }
        
        /* Container Styling */
        .lottery-container {
          background-color: #F5F5F5; /* Off-white background */
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          text-align: center;
          width: 100%;
          max-width: 400px;
          animation: fadeIn 1s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        /* Headings and Subheadings */
        .heading {
          font-size: 2.5rem;
          font-weight: bold;
          color: #FFD700; /* Gold accent */
          margin-bottom: 0.5rem;
          font-family: 'Montserrat', sans-serif;
          text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
          animation: slideIn 1s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .subheading {
          font-size: 1rem;
          color: #555;
          margin-bottom: 1rem;
        }

        /* Card (Lottery Ticket Info) Styling */
        .lottery-card {
          background: linear-gradient(45deg, #4B79A1, #283E51);
          color: #fff;
          padding: 1rem;
          border-radius: 1rem;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          margin: 1rem 0;
        }
        .card-heading {
          font-size: 1.5rem;
          font-weight: bold;
        }
        .card-text {
          font-size: 0.9rem;
          margin: 0.25rem 0;
        }
        .card-timer {
          font-size: 1.1rem;
          font-weight: 600;
          color: #FFD700;
        }
        
        /* Ticket Selection Section */
        .ticket-section {
          margin-top: 1rem;
          text-align: left;
        }
        .ticket-label {
          display: block;
          font-size: 1rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
        }
        .ticket-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.5rem;
        }
        .ticket {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.375rem;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .ticket-available {
          background-color: #4B5563; /* Gray-700 */
          color: #fff;
        }
        .ticket-available:hover {
          background-color: #3B82F6; /* Blue-500 */
        }
        .ticket-selected {
          background-color: #3B82F6; /* Blue-500 */
          color: #fff;
        }
        .ticket-unavailable {
          background-color: #4B5563; /* Gray-600 */
          color: #9CA3AF; /* Gray-400 */
          cursor: not-allowed;
        }
        
        /* Summary Styling */
        .ticket-summary {
          margin-top: 1rem;
          font-size: 1rem;
          font-weight: 600;
          color: #333;
        }
        .summary-highlight {
          color: #FACC15; /* Yellow-300 */
        }
        .cost-highlight {
          color: #10B981; /* Green-400 */
        }
        
        /* Purchase Button Styling */
        .purchase-button {
          margin-top: 1.5rem;
          width: 100%;
          background: linear-gradient(45deg, #FFD700, #C70039); /* Gold to deep red */
          color: #1A1A2E;
          font-family: 'Montserrat', sans-serif;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .purchase-button:hover {
          background: linear-gradient(45deg, #FFC107, #D32F2F);
          transform: scale(1.02);
        }
        
        /* Link Styling (if any links are added later) */
        a {
          color: #00BFFF;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        a:hover {
          color: #FFD700;
        }
        
        /* Override text color to gold for h2, h3, and p within the lottery container */
        .lottery-container h2,
        .lottery-container h3,
        .lottery-container p {
          color: #ffd700 !important;
        }
      `}</style>
    </>
  );
}
