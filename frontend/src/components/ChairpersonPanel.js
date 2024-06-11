import { useState } from 'react';

const ChairpersonPanel = ({ contract, address }) => {
  const [voterAddress, setVoterAddress] = useState("");

  const handleGiveRight = async (e) => {
    e.preventDefault();
    try {
      const tx = await contract.giveRightToVote(voterAddress);
      await tx.wait();
      alert(`Voting right given to ${voterAddress}`);
      setVoterAddress("");
    } catch (err) {
      console.error("Error giving right:", err);
      alert("Failed to give voting right.");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md my-4">
      <h3 className="text-xl font-semibold mb-4 text-blue-500">Chairperson Panel</h3>
      <form onSubmit={handleGiveRight} className="flex items-center">
        <input
          type="text"
          value={voterAddress}
          onChange={(e) => setVoterAddress(e.target.value)}
          placeholder="Voter address"
          className="flex-grow p-2 border border-blue-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Give Right to Vote
        </button>
      </form>
    </div>
  );
};

export default ChairpersonPanel;