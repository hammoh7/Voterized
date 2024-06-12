import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import { ethers } from "ethers";
import ConnectWallet from "./components/ConnectWallet";
import VotingBooth from "./components/VotingBooth";
import Results from "./components/Results";
import ChairpersonPanel from "./components/ChairpersonPanel";
import { contractABI } from "./contractABI";

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
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/results"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Results
            </NavLink>
          </nav>
        </header>
        <main className="container mx-auto px-4 py-8 flex-grow">
          <ConnectWallet
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
          {address &&
            chairperson &&
            address.toLowerCase() !== chairperson.toLowerCase() && (
              <VotingBooth contract={contract} address={address} />
            )}
          <Routes>
            <Route
              path="/vote"
              element={
                address && contract ? (
                  <VotingBooth contract={contract} address={address} />
                ) : (
                  <p className="text-center text-white">
                    Please connect your wallet to vote.
                  </p>
                )
              }
            />
            <Route
              path="/results"
              element={contract ? <Results contract={contract} /> : null}
            />
          </Routes>
          <div className="vote-button-container">
            <NavLink
              to="/vote"
              className={({ isActive }) =>
                `vote-button ${isActive ? "hidden" : ""}`
              }
            >
              Vote Now
            </NavLink>
          </div>
        </main>
        <footer className="footer">
          <div className="footer-content">
            <p>&copy; {new Date().getFullYear()} Voterized</p>
            <div className="footer-links">
              <a href="#">Terms & Conditions</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
