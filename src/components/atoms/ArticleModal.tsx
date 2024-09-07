import React, { useState } from 'react';
import useArticles from '../../hooks/useArticles'; // Custom hook for fetching articles
import { Article } from '@/types/otherTypes'; // Assuming you have an Article type

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ isOpen, onClose, onSelectArticle }) => {
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const { data, isLoading } = useArticles(page, searchValue);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <h2 className="text-xl mb-4">Select an Article</h2>
        
        <input 
          type="text"
          placeholder="Search for an article..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded-md"
        />

        {isLoading ? (
          <p>Loading articles...</p>
        ) : (
          <ul>
            {data?.data.map((article) => (
              <li key={article.code} className="mb-2">
                <button
                  onClick={() => onSelectArticle(article)}
                  className="w-full text-left p-2 bg-blue-100 hover:bg-blue-200 rounded-md"
                >
                  {article.libell}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex justify-between">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((prev) => (data?.meta?.totalPages ? Math.min(prev + 1, data.meta.totalPages) : prev))}
            disabled={page === data?.meta.totalPages}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Next
          </button>
        </div>

        <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">
          Close
        </button>
      </div>
    </div>
  );
};

export default ArticleModal;
