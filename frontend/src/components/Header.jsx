const Header = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-md py-4 px-6 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Smart Bookmark App</h1>
        <div className="flex items-center gap-3">
          {user.photo && (
            <img 
              src={user.photo} 
              alt={user.displayName} 
              className="w-9 h-9 rounded-full object-cover" 
            />
          )}
          <span className="text-sm text-gray-600 font-medium hidden sm:inline">{user.displayName}</span>
          <button 
            onClick={onLogout} 
            className="py-2 px-4 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
