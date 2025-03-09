"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWeb3 } from "@/context/Web3Provider";
import toast from "react-hot-toast";
import { BigNumber, ethers } from "ethers";

// Define Types for Lotteries
interface Lottery {
  id: number;
  name: string;
  users: number;
  prizePool: string;
  timeLeft: string;
  duration: number;
}

export default function UserDashboard() {
  const router = useRouter();
  const { contract, walletAddress } = useWeb3();
  const [tab, setTab] = useState<"created" | "purchased">("created");
  const [userLotteries, setUserLotteries] = useState<Lottery[]>([]);
  const [purchasedLotteries, setPurchasedLotteries] = useState<Lottery[]>([]);
  const [potentialWinnings, setPotentialWinnings] = useState<string>("0 ETH");
  const [totalImvestment, setTotalInvestment] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!contract || !walletAddress) return;

    const fetchLotteries = async () => {
      setLoading(true);
      try {
        const count = await contract.callStatic.lotteryCount();
        const lotteryCount = count.toNumber();

        let createdLotteries: Lottery[] = [];
        let purchasedLotteries: Lottery[] = [];

        for (let i = 1; i <= lotteryCount; i++) {
          const lottery = await contract.lotteries(i);
          console.log(lottery);
          const participants = await contract.getParticipants(i); // Get users who purchased tickets
          const startTime = BigNumber.from(lottery.startTime);
          const duration = BigNumber.from(lottery.duration);
          const startTimestamp = startTime.toNumber();
          const durationSeconds = duration.toNumber();
          const endTime = startTimestamp + durationSeconds;
          const prizePoolInETH = ethers.utils.formatEther(lottery.prizePool); // Convert prize pool to ETH
          const timeLeft = Math.max(0, endTime - Math.floor(Date.now() / 1000)); // Calculate time left in seconds

          const lotteryData: Lottery = {
            id: i,
            name: `Lottery ${i}`,
            users: participants.length,
            prizePool: `${prizePoolInETH.toString()} ETH`,
            timeLeft: `${timeLeft}s`,
            duration: durationSeconds,
          };

          console.log(lotteryData);

          // Check if the user created the lottery
          if (walletAddress === lottery.creator) {
            createdLotteries.push(lotteryData);
          }

          // Check if the user participated in the lottery
          if (participants.includes(walletAddress)) {
            purchasedLotteries.push(lotteryData);
          }
        }

        setUserLotteries(createdLotteries);
        setPurchasedLotteries(purchasedLotteries);
      } catch (e) {
        console.error(e);
        toast.error("Error fetching lotteries");
      } finally {
        setLoading(false);
      }
    };

    fetchLotteries();

    const getUserProfitLoss = async () => {
      setLoading(true);
      try {
        const res = await contract.getUserProfitLoss(walletAddress);
        const profits = res.profits.map((profit: BigNumber) => ethers.utils.formatEther(profit));
        const totalProfit = profits.reduce((acc: number, profit: string) => acc + parseFloat(profit), 0);
        const prof = Math.abs(totalProfit);
        setPotentialWinnings(`${prof} ETH`);
      } catch (e) {
        console.error(e);
        toast.error("Error fetching profit/loss data");
      } finally {
        setLoading(false);
      }
    };

    getUserProfitLoss();
  }, [contract, walletAddress]);

  return (
    <>
      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <div className="w-64 sidebar p-6 shadow-md h-screen fixed">
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
        <div className="flex-1 p-10 ml-64 main-content">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
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
                      <p className="text-2xl font-bold text-blue-600">{purchasedLotteries.length}</p>
                    </Card>
                    <Card className="p-6 bg-gray-50 rounded-lg shadow">
                      <h3 className="text-xl font-semibold">Potential Winnings</h3>
                      <p className="text-2xl font-bold text-yellow-500">Ξ {potentialWinnings}</p>
                    </Card>
                    <Card className="p-6 bg-gray-50 rounded-lg shadow col-span-2">
                      <h3 className="text-xl font-semibold">Total Investment</h3>
                      <p className="text-2xl font-bold text-red-500">Ξ 10 ETH</p>
                    </Card>
                  </div>

                  {/* Purchased Lotteries List */}
                  <h3 className="text-xl font-semibold mt-6">🛒 Purchased Lotteries</h3>
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg shadow max-h-60 overflow-y-auto">
                    {purchasedLotteries.length > 0 ? (
                      purchasedLotteries.map((lottery) => (
                        <div key={lottery.id} className="p-3 bg-white rounded-lg mb-2 shadow-sm">
                          <p className="text-lg font-semibold">{lottery.name}</p>
                          <p>💰 {lottery.prizePool} | ⏳ {lottery.timeLeft}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No purchased lotteries found.</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        /* Overall Page Styling */
        .flex.min-h-screen {
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364) !important;
          color: #F5F5F5;
          font-family: "Roboto", sans-serif;
        }
        /* Sidebar Styling */
        .sidebar {
          background: #1a1a2e !important;
          color: #F5F5F5;
        }
        .sidebar h2 {
          font-family: "Montserrat", sans-serif;
          color: #ffd700;
        }
        .sidebar button {
          font-family: "Roboto", sans-serif;
        }
        /* Main Dashboard Content */
        .main-content {
          background: #F5F5F5;
          color: #1a1a2e;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 8px 16px rgba(0,0,0,0.3);
        }
        /* Headings */
        h1.text-4xl, h3.text-xl {
          font-family: "Montserrat", sans-serif;
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
          background: #7f900e;
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