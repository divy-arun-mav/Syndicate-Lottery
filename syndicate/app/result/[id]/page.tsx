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
    <>
      <div className="flex justify-center items-center min-h-screen results-bg">
        <div className="card bg-white p-10 rounded-2xl shadow-2xl w-11/12 max-w-3xl text-center">
          <h1 className="text-5xl font-extrabold results-heading">🎉 Lottery Results 🎉</h1>
          <p className="text-lg text-gray-700 mt-2 results-subheading">The lucky winner is...</p>

          {/* Spinning Animation Before Announcing Winner */}
          {loading ? (
            <div className="mt-6">
              <div className="w-20 h-20 border-8 border-blue-500 border-dashed rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-lg font-semibold text-gray-700">Fetching results...</p>
            </div>
          ) : (
            <div className="mt-6">
              <p className="text-2xl font-semibold text-gray-700">🏆 Grand Winner:</p>
              <h2 className="text-6xl font-extrabold winner-name mt-3 animate-bounce">
                {winner?.name}
              </h2>
              <p className="text-3xl font-bold text-green-500 mt-2">{winner?.amount} ETH 💰</p>
            </div>
          )}

          {/* Back to Home Button */}
          <button
            onClick={() => (window.location.href = "/")}
            className="mt-8 w-full home-button"
          >
            🔙 Back to Home
          </button>
        </div>
      </div>
      <style jsx>{`
        .results-bg {
          background: linear-gradient(135deg, #a4508b, #5f0a87);
          font-family: "Roboto", sans-serif;
          color: #1a1a2e;
        }
        .card {
          border: 1px solid #ccc;
        }
        .results-heading {
          font-family: "Montserrat", sans-serif;
          color: #ffd700;
        }
        .results-subheading {
          font-family: "Roboto", sans-serif;
          color: #555;
        }
        .winner-name {
          font-family: "Montserrat", sans-serif;
          background: linear-gradient(90deg, #ffd700, #ff0000);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .home-button {
          background: #1e90ff;
          color: #fff;
          font-family: "Roboto", sans-serif;
          font-size: 1.25rem;
          font-weight: bold;
          padding: 1rem;
          border: none;
          border-radius: 9999px;
          transition: background 0.3s ease;
        }
        .home-button:hover {
          background: #1c86ee;
        }
      `}</style>
    </>
  );
}

// Simulated contract call (Replace with actual blockchain call)
async function getWinnerFromContract() {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ name: "Charlie", amount: "3 ETH" }), 3000)
  );
}
