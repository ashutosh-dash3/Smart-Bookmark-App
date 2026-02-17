const BookmarkList = ({ bookmarks, onDelete, deletingId }) => {
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-16 px-5 bg-white rounded-xl shadow-sm">
        <div className="text-5xl mb-4">🔖</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No bookmarks yet</h3>
        <p className="text-gray-600">Add your first bookmark above to get started!</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFavicon = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-5">Your Bookmarks ({bookmarks.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookmarks.map((bookmark) => (
          <div key={bookmark._id} className="bg-white rounded-xl p-4 flex items-start gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <img 
                src={getFavicon(bookmark.url)} 
                alt=""
                className="w-6 h-6"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold mb-1">
                <a 
                  href={bookmark.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-indigo-600 transition-colors"
                >
                  {bookmark.title}
                </a>
              </h3>
              <a 
                href={bookmark.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-sm text-gray-500 hover:text-indigo-600 truncate mb-1 transition-colors"
              >
                {bookmark.url}
              </a>
              <span className="text-xs text-gray-400">{formatDate(bookmark.createdAt)}</span>
            </div>
            <button
              onClick={() => onDelete(bookmark._id)}
              disabled={deletingId === bookmark._id}
              title="Delete bookmark"
              className="w-8 h-8 bg-red-50 text-red-500 rounded-md text-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deletingId === bookmark._id ? '...' : '×'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarkList;
