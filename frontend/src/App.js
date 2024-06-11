import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import { ethers } from 'ethers';
import ConnectWallet from './components/ConnectWallet';
import VotingBooth from './components/VotingBooth';
import Results from './components/Results';
import ChairpersonPanel from './components/ChairpersonPanel';
import { contractABI } from './contractABI';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState(localStorage.getItem('walletAddress'));
  const [chairperson, setChairperson] = useState(null);

  const handleConnect = async (provider) => {
    const signer = await provider.getSigner();
    const addr = await signer.getAddress();
    setAddress(addr);

    const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
    setContract(contractInstance);

    const chairpersonAddr = await contractInstance.chairperson();
    setChairperson(chairpersonAddr);
  };

  const handleDisconnect = () => {
    setAddress(null);
    setContract(null);
    setChairperson(null);
  };

  useEffect(() => {
    if (address) {
      const reconnect = async () => {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const addr = await signer.getAddress();
          if (addr.toLowerCase() === address.toLowerCase()) {
            handleConnect(provider);
          }
        } catch (err) {
          console.error("Error reconnecting:", err);
        }
      };
      reconnect();
    }
  }, [address]);

  return (
    <Router>
      <div className="App min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <header className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-4">Decentralized Voting dApp</h1>
          <ConnectWallet onConnect={handleConnect} onDisconnect={handleDisconnect} />
        </header>
        <main className="container mx-auto px-4 py-8">
          {address && chairperson && address.toLowerCase() === chairperson.toLowerCase() && (
            <ChairpersonPanel contract={contract} address={address} />
          )}
          <nav className="flex justify-center space-x-4 my-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md transition-colors duration-300 ${
                  isActive
                    ? 'bg-white text-blue-500'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/vote"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md transition-colors duration-300 ${
                  isActive
                    ? 'bg-white text-blue-500'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`
              }
            >
              Vote
            </NavLink>
            <NavLink
              to="/results"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md transition-colors duration-300 ${
                  isActive
                    ? 'bg-white text-blue-500'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`
              }
            >
              Results
            </NavLink>
          </nav>
          <Routes>
            <Route
              path="/vote"
              element={
                address && contract ? (
                  <VotingBooth contract={contract} address={address} />
                ) : (
                  <p className="text-center text-white">Please connect your wallet to vote.</p>
                )
              }
            />
            <Route path="/results" element={contract ? <Results contract={contract} /> : null} />
          </Routes>
        </main>
        <footer className="bg-blue-800 py-4 mt-8">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; {new Date().getFullYear()} Decentralized Voting dApp</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;