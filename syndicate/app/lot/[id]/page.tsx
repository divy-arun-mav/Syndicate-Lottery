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

  const [participants, setParticipants] = useState<{ name: string; ticket: string }[]>([]);
  const [prizePool, setPrizePool] = useState("0");
  const [duration, setDuration] = useState(3600); // Default 1 hour
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
    <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg text-center mx-auto mt-10">
      <h2 className="text-4xl font-bold text-blue-500">🎉 Lottery #{id} Dashboard</h2>
      <p className="text-lg text-gray-500 mt-2">See the prize pool, participants, and result time!</p>

      {/* Prize Pool */}
      <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-lg shadow-lg mt-6">
        <h3 className="text-2xl font-bold">💰 Prize Pool: {prizePool} ETH</h3>
      </Card>

      {/* Countdown Timer */}
      <div className="text-2xl font-bold text-orange-500 mt-6">
        ⏳ Result in: {timeLeft > 0 ? formatTime(timeLeft) : "🎉 Winner Announced!"}
      </div>

      {/* Participants List */}
      <div className="mt-6 text-left">
        <h3 className="text-2xl font-semibold text-gray-700">👥 Participants</h3>
        <div className="bg-gray-100 p-4 rounded-lg mt-2 max-h-60 overflow-y-auto">
          {participants.length > 0 ? (
            participants.map((user, index) => (
              <div key={index} className="flex items-center gap-4 border-b p-2 last:border-b-0">
                {/* <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full text-lg font-bold">
                  {user.name[0]}
                </div> */}
                <div>
                  <p className="text-lg font-semibold">{user.address}</p>
                  {/* <p className="text-md text-gray-500">Ticket #{user.ticket}</p> */}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No participants yet.</p>
          )}
        </div>
      </div>

      {/* Back Button */}
      <Button onClick={() => router.push("/joinlot")} className="mt-8 w-full">
        🔙 Back to Home
      </Button>
    </div>
  );
}
