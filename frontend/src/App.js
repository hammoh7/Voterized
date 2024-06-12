import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route, Routes, NavLink,
} from "react-router-dom";
import { ethers } from "ethers";
import ConnectWallet from "./components/ConnectWallet";
import VotingBooth from "./components/VotingBooth";
import Results from "./components/Results";
import ChairpersonPanel from "./components/ChairpersonPanel";
import { contractABI } from "./contractABI";
import UserMenu from "./components/UserMenu"; 

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState(localStorage.getItem("walletAddress"));
  const [chairperson, setChairperson] = useState(null);

  const handleConnect = async (provider) => {
    const signer = await provider.getSigner();
    const addr = await signer.getAddress();
    setAddress(addr);

    const contractInstance = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
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
      <div className="App min-h-screen flex flex-col">
        <header className="navbar">
          <div className="logo-container">
            <img src="/logo192.png" alt="Logo" className="logo" />
            <h1 className="app-title">Voterized</h1>
          </div>
          <nav className="nav-links">
            <NavLink to="/" className="nav-link">
              Vote
            </NavLink>
            <NavLink to="/results" className="nav-link">
              Results
            </NavLink>
            {chairperson && (
              <NavLink to="/chairperson" className="nav-link">
                Chairperson Panel
              </NavLink>
            )}
          </nav>
          {address ? (
            <UserMenu address={address} onDisconnect={handleDisconnect} />
          ) : (
            <ConnectWallet onConnect={handleConnect} onDisconnect={handleDisconnect} />
          )}
        </header>
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Routes>
            <Route
              path="/"
              element={<VotingBooth contract={contract} address={address} />}
            />
            <Route path="/results" element={<Results contract={contract} />} />
            {chairperson && (
              <Route
                path="/chairperson"
                element={<ChairpersonPanel contract={contract} address={address} />}
              />
            )}
          </Routes>
        </main>
        <footer className="footer">
          <div className="footer-content">
            <p>&copy; 2024 Voterized</p>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Contact Us</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
