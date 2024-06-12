import { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';

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
      <button onClick={toggleMenu} className="flex items-center px-4 py-2 text-white hover:text-blue-300 transition duration-300">
        <PersonIcon className="h-6 w-6" />
      </button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="px-4 py-2 text-sm text-gray-700 truncate">Address: {address}</div>
          <button
            onClick={handleDisconnect}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition duration-300"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
