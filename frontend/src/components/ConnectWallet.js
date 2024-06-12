import { useState, useEffect } from "react";
import { ethers } from "ethers";

const UserMenu = ({ address, onDisconnect }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleDisconnect = () => {
    setMenuOpen(false);
    localStorage.removeItem('walletAddress');
    onDisconnect();
  };

  return (
    <div className="relative">
      <button onClick={toggleMenu} className="flex items-center px-4 py-2 text-white">
        <img src="/user-icon.png" alt="User Icon" className="h-6 w-6 rounded-full" />
      </button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
          <div className="px-4 py-2 text-sm text-gray-700">Address: {address}</div>
          <button
            onClick={handleDisconnect}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

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

  return (
    <div className="flex justify-center my-4">
      {address ? (
        <UserMenu address={address} onDisconnect={onDisconnect} />
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
