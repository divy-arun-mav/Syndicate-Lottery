"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWeb3 } from "@/context/Web3Provider";
import { BigNumber, ethers } from "ethers";

export default function LotteryDashboard() {
  const { id } = useParams();
  const router = useRouter();
  const { contract } = useWeb3();

  const [participants, setParticipants] = useState<{
    address: string; name: string; ticket: string 
}[]>([]);
  const [prizePool, setPrizePool] = useState("0");
  const [duration, setDuration] = useState(3600); 
  const [timeLeft, setTimeLeft] = useState(3600);
  const [loading, setLoading] = useState(true);

  // Fetch Lottery Details
  useEffect(() => {
    const fetchLotteryDetails = async () => {
      try {
        if (!contract) return;
        const details = await contract.lotteries(id);
        const startTime = BigNumber.from(details.startTime); 
        const duration = BigNumber.from(details.duration);
        const startTimestamp = startTime.toNumber();
        const durationSeconds = duration.toNumber();
        const endTime = startTimestamp + durationSeconds;
        const currentTime = Math.floor(Date.now() / 1000);
        const isLotteryOpen = endTime > currentTime;
        setPrizePool(ethers.utils.formatEther(details.prizePool));
        setDuration(Number(details.duration));
        setTimeLeft(isLotteryOpen ? (endTime - Math.floor(Date.now() / 1000)) : 0); // Calculate remaining time
      } catch (error) {
        console.error("Error fetching lottery details:", error);
      }
    };

    const fetchParticipants = async () => {
      try {
        if (!contract) return;
        const result = await contract.getParticipants(id);
        // console.log(result);
        const formattedParticipants = result.map((p: any) => ({
          address: p,
          // ticket: p.ticketNumber.toString(),
        }));
        console.log(formattedParticipants);
        setParticipants(formattedParticipants);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchLotteryDetails();
    fetchParticipants();
    setLoading(false);
  }, [contract, id]);

  // Countdown Timer Logic
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Format countdown into HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (loading) return <div className="text-center text-xl mt-10">Loading...</div>;

  return (
    <>
      <div className="w-full max-w-2xl p-6 lottery-dashboard-container bg-white rounded-lg shadow-lg text-center mx-auto mt-10">
        <h2 className="text-4xl font-bold lottery-heading text-blue-500">🎉 Lottery #{id} Dashboard</h2>
        <p className="text-lg lottery-subheading text-gray-500 mt-2">See the prize pool, participants, and result time!</p>

        {/* Prize Pool */}
        <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-lg shadow-lg mt-6">
          <h3 className="text-2xl font-bold">💰 Prize Pool: 5 ETH</h3>
        </Card>

        {/* Countdown Timer */}
        <div className="text-2xl font-bold countdown-timer text-orange-500 mt-6">
          ⏳ Result in: {timeLeft > 0 ? formatTime(timeLeft) : "🎉 Winner Announced!"}
        </div>

        {/* Participants List */}
        <div className="mt-6 text-left">
          <h3 className="text-2xl font-semibold text-gray-700">👥 Participants</h3>
          <div className="bg-gray-100 p-4 rounded-lg mt-2 max-h-60 overflow-y-auto">
            {participants.length > 0 ? (
              participants.map((user, index) => (
                <div key={index} className="flex items-center gap-4 border-b p-2 last:border-b-0">
                  <div>
                    <p className="text-lg font-semibold">{user.address}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No participants yet.</p>
            )}
          </div>

          {/* Back Button */}
          <Button onClick={() => router.push("/joinlot")} className="mt-8 w-full">
            🔙 Back to Home
          </Button>
        </div>
      </div>
      <style jsx>{`
        .lottery-dashboard-container {
          background: #F5F5F5;
          color: #1A1A2E;
          font-family: "Roboto", sans-serif;
        }
        .lottery-heading {
          font-family: "Montserrat", sans-serif;
          color: #1A1A2E;
        }
        .lottery-subheading {
          font-family: "Roboto", sans-serif;
          color: #555;
        }
        .countdown-timer {
          font-family: "Roboto", sans-serif;
        }
        /* Custom scrollbar styling for participant list (if needed) */
        .bg-gray-100::-webkit-scrollbar {
          width: 8px;
        }
        .bg-gray-100::-webkit-scrollbar-track {
          background: #ddd;
          border-radius: 4px;
        }
        .bg-gray-100::-webkit-scrollbar-thumb {
          background: #aaa;
          border-radius: 4px;
        }
        /* Convert all h2, h3, and p text within this container to gold */
        .lottery-dashboard-container h2,
        .lottery-dashboard-container h3,
        .lottery-dashboard-container p {
          color: #ffd700 !important;
        }
      `}</style>
    </>
  );
}
