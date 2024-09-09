import React, { useState, useRef, useEffect } from 'react';
import useClients from '../../hooks/useClients'; // Custom hook for fetching clients
import { Client } from '@/types/devisTypes'; // Assuming you have a Client type
import { Input } from '../../@/components/ui/input';
import Loading from './Loading';
import { PaginationTable } from './TablePagination';
import { Button } from '../../@/components/ui/button';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClient: (client: Client) => void;
  selectedClient: Client; // List of selected clients
}

const ClientModal: React.FC<ClientModalProps> = ({ isOpen, onClose, onSelectClient, selectedClient }) => {
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState(''); // Tracks input field value
  const [searchQuery, setSearchQuery] = useState(''); // Triggers actual search
  const { data, isLoading, isFetching, refetch } = useClients(page, searchQuery); // Use searchQuery for API request

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
        className="bg-lightWhite p-6 rounded-lg max-w-[90vh] border border-darkGrey flex flex-1 flex-col"
      >
        <h1 className="text-xl mb-4 text-darkGrey font-oswald">Choisir un client</h1>

        <div className="flex">
          <Input
            type="text"
            placeholder="Rechercher un client..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(); // Trigger search when Enter is pressed
              }
            }}
            className="w-full mb-4 p-2 border border-darkGrey bg-lightWhite rounded-md"
          />
          <Button onClick={handleSearch} className="ml-2 bg-greenOne hover:bg-greenOne">Rechercher</Button> {/* Search button */}
        </div>

        {isLoading || isFetching ? (
          <div>
            <div className='text-highGrey font-oswald flex justify-center'>Chargement ...</div>
          </div>
        ) : (
          <>
            <ul>
              {data?.data.map((client, index) => (
                <li key={index} className="mb-2">
                  <Button
                    onClick={() => {
                      if (selectedClient.id !== client.id) {
                        onSelectClient(client);
                      }
                    }}
                    className={`font-oswald flex flex-row justify-between items-center w-full p-5 border rounded-lg ${selectedClient.id=== client.id
                      ? 'bg-gray-400 cursor-not-allowed hover:cursor-not-allowed'
                      : 'bg-darkGrey hover:bg-lightWhite hover:text-darkGrey hover:border-darkGrey'
                      }`}
                  >
                    <div className="flex-1 text-left">
                      {client.nomClient} <span className="ml-1">({client.id})</span>
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

export default ClientModal;
