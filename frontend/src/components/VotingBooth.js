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

          console.log("Fetching voter information for address:", address);

          // Check if the voter has the right to vote
          const voter = await contract.voters(address);
          console.log("Voter:", voter);

          const weight = voter.weight.toString(); // Convert BigInt to string
          console.log("Voter weight:", weight);

          if (weight === "0") {
            setError(
              "You don't have the right to vote. Please contact the chairperson."
            );
            setLoading(false);
            return;
          }

          console.log("Fetching the proposals...");

          // Fetch the number of proposals
          const proposalCount = await contract.proposalCount();
          console.log("Number of proposals:", proposalCount.toString());

          if (proposalCount.toString() === "0") {
            setError("No proposals have been added yet.");
            setLoading(false);
            return;
          }

          console.log("Fetching each proposal...");

          // Fetch each proposal
          const fetchedProposals = [];
          for (let i = 0; i < proposalCount; i++) {
            const proposal = await contract.proposals(i); // Call the function with an index
            console.log(`Proposal ${i}:`, proposal);
            fetchedProposals.push({
              id: i,
              name: proposal.name.replace(/\0/g, ""), // Remove padding
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
        alert(
          "You don't have the right to vote. Please contact the chairperson."
        );
      } else if (err.message.includes("Already voted")) {
        alert("You have already cast your vote.");
      } else {
        alert("Error casting vote. See console for details.");
      }
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p className="text-center text-gray-700">Loading proposals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <p className="text-center text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="card-title">Cast Your Vote</h2>
      {proposals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {proposals.map((proposal) => (
            <button
              key={proposal.id}
              onClick={() => handleVote(proposal.id)}
              className="btn-primary"
            >
              {proposal.name}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-700">No proposals available.</p>
      )}
    </div>
  );
};

export default VotingBooth;