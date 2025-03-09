"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Define Types for Lotteries
interface Lottery {
  name: string;
  epoch?: number;
  users?: number;
  prizePool: string;
  timeLeft: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"created" | "purchased">("created");
  const [userLotteries, setUserLotteries] = useState<Lottery[]>([]);
  const [purchasedLotteries, setPurchasedLotteries] = useState<Lottery[]>([]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userCreated: Lottery[] = await fetchCreatedLotteries();
        const userPurchased: Lottery[] = await fetchPurchasedLotteries();
        setUserLotteries(userCreated);
        setPurchasedLotteries(userPurchased);
      } catch (error) {
        console.error("Error fetching lottery data", error);
      }
    }
    fetchUserData();
  }, []);

  return (
    <>
      <div className="flex min-h-screen bg-white text-gray-900">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-gray-100 p-6 shadow-md h-screen fixed">
          <h2 className="text-2xl font-bold mb-4">📊 Dashboard</h2>
          <Button 
            onClick={() => setTab("created")} 
            className={`w-full mb-2 text-left rounded-lg p-3 transition ${
              tab === "created" ? "bg-yellow-400 text-gray-900 font-bold" : "bg-gray-200 text-gray-700"
            }`}
          >
            🎟️ Created Lotteries
          </Button>
          <Button 
            onClick={() => setTab("purchased")} 
            className={`w-full text-left rounded-lg p-3 transition ${
              tab === "purchased" ? "bg-yellow-400 text-gray-900 font-bold" : "bg-gray-200 text-gray-700"
            }`}
          >
            🛒 Purchased Lotteries
          </Button>
        </div>

        {/* Main Dashboard Content */}
        <div className="flex-1 p-10 ml-64">
          {tab === "created" ? (
            <div>
              <h1 className="text-4xl font-bold text-center mb-6">🏆 Created Lottery Stats</h1>
              <div className="grid grid-cols-2 gap-6">
                <Card className="p-6 bg-gray-50 rounded-lg shadow">
                  <h3 className="text-xl font-semibold">Total Investment</h3>
                  <p className="text-2xl font-bold text-blue-600">Ξ 15.2 ETH</p>
                </Card>
                <Card className="p-6 bg-gray-50 rounded-lg shadow">
                  <h3 className="text-xl font-semibold">Total Earnings</h3>
                  <p className="text-2xl font-bold text-green-500">Ξ 28.7 ETH</p>
                </Card>
              </div>

              {/* Created Lotteries List */}
              <h3 className="text-xl font-semibold mt-6">📜 Created Lotteries</h3>
              <div className="mt-3 p-4 bg-gray-50 rounded-lg shadow max-h-60 overflow-y-auto">
                {userLotteries.map((lottery, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg mb-2 shadow-sm">
                    <p className="text-lg font-semibold">{lottery.name} (Epoch {lottery.epoch})</p>
                    <p>👥 {lottery.users} Users | 💰 {lottery.prizePool} | ⏳ {lottery.timeLeft}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-4xl font-bold text-center mb-6">🎟️ Purchased Lottery Stats</h1>
              <div className="grid grid-cols-2 gap-6">
                <Card className="p-6 bg-gray-50 rounded-lg shadow">
                  <h3 className="text-xl font-semibold">Total Tickets</h3>
                  <p className="text-2xl font-bold text-blue-600">42</p>
                </Card>
                <Card className="p-6 bg-gray-50 rounded-lg shadow">
                  <h3 className="text-xl font-semibold">Potential Winnings</h3>
                  <p className="text-2xl font-bold text-yellow-500">Ξ 3.5 ETH</p>
                </Card>
                <Card className="p-6 bg-gray-50 rounded-lg shadow col-span-2">
                  <h3 className="text-xl font-semibold">Total Investment</h3>
                  <p className="text-2xl font-bold text-red-500">Ξ 10 ETH</p>
                </Card>
              </div>

              {/* Purchased Lotteries List */}
              <h3 className="text-xl font-semibold mt-6">🛒 Purchased Lotteries</h3>
              <div className="mt-3 p-4 bg-gray-50 rounded-lg shadow max-h-60 overflow-y-auto">
                {purchasedLotteries.map((lottery, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg mb-2 shadow-sm">
                    <p className="text-lg font-semibold">{lottery.name}</p>
                    <p>💰 {lottery.prizePool} | ⏳ {lottery.timeLeft}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        /* Overall Page Styling */
        .flex.min-h-screen {
          background: #1A1A2E !important;
          color: #F5F5F5;
          font-family: "Roboto", sans-serif;
        }
        /* Sidebar Styling */
        .w-64.bg-gray-100 {
          background: #F5F5F5 !important;
          color: #1A1A2E;
        }
        .w-64 h2 {
          font-family: "Montserrat", sans-serif;
          color: #FFD700;
        }
        .w-64 button {
          font-family: "Roboto", sans-serif;
        }
        /* Main Dashboard Content */
        .flex-1.p-10.ml-64 {
          background:rgb(147, 162, 13);
        }
        /* Headings */
        h1.text-4xl {
          font-family: "Montserrat", sans-serif;
          color: #1A1A2E;
        }
        h3.text-xl {
          font-family: "Montserrat", sans-serif;
          color: #1A1A2E;
        }
        /* Card Overrides */
        .shadow,
        .shadow-md,
        .shadow-lg,
        .shadow-sm {
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
        }
        /* Lottery List Items */
        .p-3.bg-white {
          background:rgb(127, 144, 14);
          border: 1px solid #ccc;
        }
        /* Scrollbar Styles for Lottery Lists */
        .max-h-60.overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        .max-h-60.overflow-y-auto::-webkit-scrollbar-track {
          background: #ddd;
          border-radius: 4px;
        }
        .max-h-60.overflow-y-auto::-webkit-scrollbar-thumb {
          background: #aaa;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
}

// Mock API functions (Replace with actual blockchain API calls)
async function fetchCreatedLotteries(): Promise<Lottery[]> {
  return [
    { name: "Mega Jackpot", epoch: 24, users: 120, prizePool: "Ξ 20 ETH", timeLeft: "2h 15m" },
    { name: "Lucky Spin", epoch: 10, users: 50, prizePool: "Ξ 5 ETH", timeLeft: "1h 30m" }
  ];
}

async function fetchPurchasedLotteries(): Promise<Lottery[]> {
  return [
    { name: "Daily Draw", prizePool: "Ξ 3 ETH", timeLeft: "1h 45m" },
    { name: "Flash Lottery", prizePool: "Ξ 1.2 ETH", timeLeft: "3h 20m" }
  ];
}
