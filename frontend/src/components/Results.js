import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Results = ({ contract }) => {
  const [winner, setWinner] = useState("");

  useEffect(() => {
    const fetchWinner = async () => {
      if (contract) {
        try {
          const winnerName = await contract.winnerName();
          setWinner(ethers.decodeBytes32String(winnerName));
        } catch (err) {
          console.error("Error fetching winner:", err);
        }
      }
    };
    fetchWinner();
  }, [contract]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-500">Election Results</h2>
      {winner ? (
        <p className="text-xl">
          Current winner: <span className="font-semibold text-green-600">{winner}</span>
        </p>
      ) : (
        <p className="text-gray-700">No winner yet.</p>
      )}
    </div>
  );
};

export default Results;