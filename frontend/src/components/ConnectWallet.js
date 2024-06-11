import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ConnectWallet = ({ onConnect, onDisconnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState(localStorage.getItem('walletAddress'));

  useEffect(() => {
    if (address) {
      const reconnect = async () => {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const addr = await signer.getAddress();
          if (addr.toLowerCase() === address.toLowerCase()) {
            onConnect(provider);
          }
        } catch (err) {
          console.error("Error reconnecting:", err);
        }
      };
      reconnect();
    }
  }, [address, onConnect]);

  const connectWithMetamask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const addr = await signer.getAddress();
        setAddress(addr);
        localStorage.setItem('walletAddress', addr);
        onConnect(provider);
      } catch (err) {
        console.error("Error connecting:", err);
        alert("Failed to connect. See console for details.");
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert("Please install MetaMask!");
      setIsConnecting(false);
    }
  };

  const handleConnect = () => {
    setIsConnecting(true);
    connectWithMetamask();
  };

  const handleDisconnect = () => {
    setAddress(null);
    localStorage.removeItem('walletAddress');
    onDisconnect();
  };

  return (
    <div className="flex justify-center my-4">
      {address ? (
        <div className="bg-white text-blue-500 p-4 rounded-md shadow-md">
          <p className="font-mono">Connected as: {address}</p>
          <button
            onClick={handleDisconnect}
            className="mt-2 px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : isConnecting ? (
        <div className="flex items-center">
          <p className="mr-2">Connecting...</p>
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;