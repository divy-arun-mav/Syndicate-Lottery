"use client";
import { useEffect, useState } from "react";

export default function Results() {
  const [winner, setWinner] = useState<{ name: string; amount: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWinner() {
      try {
        const winnerData = await getWinnerFromContract();
        if (winnerData && typeof winnerData === "object" && "name" in winnerData && "amount" in winnerData) {
          setWinner(winnerData as { name: string; amount: string });
        } else {
          console.error("Invalid winner data:", winnerData);
        }
      } catch (error) {
        console.error("Error fetching winner:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWinner();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-400">
      <div className="card bg-white p-10 rounded-2xl shadow-2xl w-11/12 max-w-3xl text-center">
        <h1 className="text-5xl font-extrabold text-yellow-500">🎉 Lottery Results 🎉</h1>
        <p className="text-lg text-gray-700 mt-2">The lucky winner is...</p>

        {/* Spinning Animation Before Announcing Winner */}
        {loading ? (
          <div className="mt-6">
            <div className="w-20 h-20 border-8 border-blue-500 border-dashed rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg font-semibold text-gray-700">Fetching results...</p>
          </div>
        ) : (
          <div className="mt-6">
            <p className="text-2xl font-semibold text-gray-700">🏆 Grand Winner:</p>
            <h2 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500 mt-3 animate-bounce">
              {winner?.name}
            </h2>
            <p className="text-3xl font-bold text-green-500 mt-2">{winner?.amount} ETH 💰</p>
          </div>
        )}

        {/* Back to Home Button */}
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-8 w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-full text-xl hover:bg-blue-700 transition"
        >
          🔙 Back to Home
        </button>
      </div>
    </div>
  );
}

// Simulated contract call (Replace with actual blockchain call)
async function getWinnerFromContract() {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ name: "Charlie", amount: "3 ETH" }), 3000)
  );
}
