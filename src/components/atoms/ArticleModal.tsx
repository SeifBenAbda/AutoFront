import React, { useState, useRef, useEffect } from 'react';
import useArticles from '../../hooks/useArticles'; // Custom hook for fetching articles
import { Article } from '@/types/otherTypes'; // Assuming you have an Article type
import { Input } from '../../@/components/ui/input';
import Loading from './Loading';
import { PaginationTable } from './TablePagination';
import { Button } from '../../@/components/ui/button';

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
  selectedArticles: { article: Article; quantity: string }[];
}

const ArticleModal: React.FC<ArticleModalProps> = ({ isOpen, onClose, onSelectArticle, selectedArticles }) => {
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState(''); // Tracks input field value
  const [searchQuery, setSearchQuery] = useState(''); // Triggers actual search
  const { data, isLoading, isFetching, refetch } = useArticles(page, searchQuery); // Use searchQuery for API request

  const modalRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSearchValue(''); // Reset search value
      setSearchQuery(''); // Reset search query
      setPage(1); // Reset page
      refetch(); // Fetch new data when modal opens
    }
  }, [isOpen, refetch]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSearch = () => {
    setSearchQuery(searchValue); // Trigger search with current input value
    setPage(1); // Reset to the first page
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-lightWhite bg-opacity-55">
      <div
        ref={modalRef}
        className="bg-lightWhite p-6 rounded-lg max-w-[90vh] border border-highGrey2 flex flex-1 flex-col"
      >
        <h1 className="text-xl mb-4 text-highGrey2 font-oswald">Choisir un article</h1>

        <div className="flex">
          <Input
            type="text"
            placeholder="Rechercher un article..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(); // Trigger search when Enter is pressed
              }
            }}
            className="w-full mb-4 p-2 border border-highGrey2 bg-lightWhite rounded-md"
          />
          <Button onClick={handleSearch} className="ml-2 bg-greenOne hover:bg-greenOne">Rechercher</Button> {/* Trigger search with button */}
        </div>

        {isLoading || isFetching ? (
          <div>
            <div className='text-highGrey2 font-oswald flex justify-center'>Chargement ...</div>
          </div>
        ) : (
          <>
            <ul>
              {data?.data.map((article, index) => (
                <li key={index} className="mb-2">
                  <Button
                    onClick={() => {
                      if (!selectedArticles.some(selected => selected.article.code === article.code)) {
                        onSelectArticle(article);
                      }
                    }}
                    className={`flex flex-row justify-between items-center w-full p-5 border rounded-lg ${selectedArticles.some(selected => selected.article.code === article.code)
                      ? 'bg-gray-400 cursor-not-allowed hover:cursor-not-allowed'
                      : 'bg-highGrey2 hover:bg-lightWhite hover:text-highGrey2 hover:border-highGrey2'
                      }`}
                  >
                    <div className="flex-1 text-left">
                      {article.libell} <span className="ml-1">({article.code})</span>
                    </div>


                    <div
                      className='bg-lightWhite border border-lightWhite rounded-xl p-1 mr-2 w-24 text-highGrey2 hover:border hover:border-highGrey2'
                    >
                      {article.pv} DT
                    </div>

                    <div
                      className={`flex-none text-center border rounded-lg p-1 ${article.stock <= 0
                        ? 'bg-lightRed text-lightWhite border-lightRed'
                        : 'bg-lightWhite text-highGrey2 border-lightWhite'
                        }`}
                    >
                      {article.stock > 0 ? 'Stock Disponible' : 'Hors Stock !'}
                    </div>

                    
                  </Button>
                </li>
              ))}
            </ul>

            <div className="flex-1 justify-center mt-4">
              <PaginationTable
                currentPage={data?.meta.currentPage}
                totalPages={data?.meta.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ArticleModal;
