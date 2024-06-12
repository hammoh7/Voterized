import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Results = ({ contract }) => {
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (contract) {
        try {
          const proposalCount = await contract.proposalCount();
          const proposalsArray = [];

          for (let i = 0; i < proposalCount; i++) {
            const proposal = await contract.proposals(i);
            proposalsArray.push({
              name: proposal.name,
              voteCount: proposal.voteCount.toString(),
            });
          }

          setProposals(proposalsArray);
        } catch (err) {
          console.error("Error fetching proposals:", err);
        }
      }
    };
    fetchResults();
  }, [contract]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-500">Election Results</h2>
      {proposals.length > 0 ? (
        <div className="space-y-2">
          {proposals.map((proposal, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-sm">
              <span className="text-xl font-medium text-gray-800">{proposal.name}</span>
              <span className="text-xl font-semibold text-green-600">{proposal.voteCount}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700">Connect wallet</p>
      )}
    </div>
  );
};

export default Results;
