import { useState, useEffect } from "react";

const VotingBooth = ({ contract, address }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProposals = async () => {
      if (contract) {
        try {
          setLoading(true);
          setError(null);

          const voter = await contract.voters(address);
          const weight = voter.weight.toString();

          if (weight === "0") {
            setError("You don't have the right to vote. Please contact the chairperson.");
            setLoading(false);
            return;
          }

          const proposalCount = await contract.proposalCount();
          if (proposalCount.toString() === "0") {
            setError("No proposals have been added yet.");
            setLoading(false);
            return;
          }

          const fetchedProposals = [];
          for (let i = 0; i < proposalCount; i++) {
            const proposal = await contract.proposals(i);
            fetchedProposals.push({
              id: i,
              name: proposal.name.replace(/\0/g, ""),
            });
          }

          setProposals(fetchedProposals);
        } catch (err) {
          console.error("Error fetching proposals:", err);
          setError("Failed to fetch proposals. Please check your console.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProposals();
  }, [contract, address]);

  const handleVote = async (proposalId) => {
    try {
      const tx = await contract.vote(proposalId);
      await tx.wait();
      alert("Vote cast successfully!");
    } catch (err) {
      console.error("Error voting:", err);
      if (err.message.includes("Has no right to vote")) {
        alert("You don't have the right to vote. Please contact the chairperson.");
      } else if (err.message.includes("Already voted")) {
        alert("You have already cast your vote.");
      } else {
        alert("Error casting vote. See console for details.");
      }
    }
  };

  return (
    <div className="card main-container">
      <h2 className="card-title text-center">Cast Your Vote</h2>
      {loading ? (
        <div className="loading-container">
          <p className="text-center text-gray-700">Loading proposals...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="text-center text-red-700">{error}</p>
        </div>
      ) : proposals.length > 0 ? (
        <div className="proposals-container">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="proposal-card">
              <h3 className="proposal-name">{proposal.name}</h3>
              <button
                onClick={() => handleVote(proposal.id)}
                className="btn-primary proposal-button"
              >
                Vote
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-700">Connect your Wallet</p>
      )}
    </div>
  );
};

export default VotingBooth;
