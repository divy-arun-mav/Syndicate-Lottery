"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWeb3 } from "@/context/Web3Provider";

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
  const { contract } = useWeb3();
  
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
    <div className="join-lottery-page">
      <div className="lottery-container">
        <h2 className="heading">
          🎟 Select Your Lottery Ticket
        </h2>
        <p className="subheading">Choose your lucky number!</p>

        {/* Lottery Ticket Info */}
        <Card className="lottery-card">
          <h3 className="card-heading">Lottery #{lotteryId}</h3>
          <p className="card-text">
            Prize Pool: <strong>5 ETH</strong>
          </p>
          <p className="card-text">
            Entry Fee: <strong>{ticketPrice} ETH</strong>
          </p>
          <p className="card-timer">
            ⏳ Time Left: {countdown}
          </p>
        </Card>

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
                      : selectedNumbers.includes(ticket)
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

        {/* Selected Tickets & Price */}
        <div className="ticket-summary">
          Selected Tickets:{" "}
          <span className="summary-highlight">
            {selectedNumbers.length > 0 ? selectedNumbers.join(", ") : "None"}
          </span>
        </div>
        <div className="ticket-summary">
          Total Cost:{" "}
          <span className="cost-highlight">
            {(selectedNumbers.length * ticketPrice).toFixed(2)}
          </span>{" "}
          ETH
        </div>

        {/* Purchase Ticket Button */}
        <Button
          onClick={handlePurchase}
          className="purchase-button"
        >
          🎫 Purchase Ticket
        </Button>
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
          box-shadow: 0 8px 16px rgba(0,0,0,0.3);
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
      `}</style>
    </div>
  );
}
