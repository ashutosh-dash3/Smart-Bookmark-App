import { useState } from 'react';

const AddBookmark = ({ onAdd, loading }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    
    onAdd({ title: title.trim(), url: url.trim() });
    setTitle('');
    setUrl('');
  };

  const formatUrl = (value) => {
    let formattedUrl = value.trim();
    if (formattedUrl && !formattedUrl.match(/^https?:\/\//i)) {
      formattedUrl = 'https://' + formattedUrl;
    }
    setUrl(formattedUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Bookmark</h2>
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-indigo-500 transition-colors"
          required
        />
        <input
          type="url"
          placeholder="URL (e.g., example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={(e) => formatUrl(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-indigo-500 transition-colors"
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? 'Adding...' : 'Add Bookmark'}
        </button>
      </div>
    </form>
  );
};

export default AddBookmark;
