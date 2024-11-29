import React, { useState, useRef, useEffect } from 'react';
import useClients from '../../hooks/useClients'; // Custom hook for fetching clients
import { Client } from '@/types/devisTypes'; // Assuming you have a Client type
import { Input } from '../../@/components/ui/input';
import { Button } from '../../@/components/ui/button';
import { PaginationTable } from './TablePagination';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClient: (client: Client) => void;
  selectedClient: Client | undefined; // List of selected clients
}

const ClientModal: React.FC<ClientModalProps> = ({ isOpen, onClose, onSelectClient, selectedClient }) => {
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, isFetching, refetch, isPlaceholderData, isFetched, error } = useClients(page, searchQuery);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchValue('');
      setSearchQuery('');
      setPage(1);
      refetch();
    }
  }, [isOpen, refetch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleSearch = () => {
    setSearchQuery(searchValue);
    setPage(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-lightWhite bg-opacity-55">
      <div
        ref={modalRef}
        className="bg-lightWhite p-6 rounded-lg max-w-[90vh] border border-highBlue flex flex-1 flex-col"
      >
        <h1 className="text-xl mb-4 text-highBlue font-oswald">Choisir un client</h1>

        <div className="flex">
          <Input
            type="text"
            placeholder="Rechercher un client..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            className="w-full mb-4 p-2 border border-highBlue bg-lightWhite rounded-md"
          />
          <Button onClick={handleSearch} className="ml-2 bg-greenOne hover:bg-greenOne">Rechercher</Button>
        </div>

        {isLoading || isFetching ? (
          <div className='text-highBlue font-oswald flex justify-center'>Chargement ...</div>
        ) : error ? (
          <div className='text-red-500 font-oswald flex justify-center'>Erreur: {error.message}</div>
        ) : data && data.data.length > 0 ? (
          <>
            <ul>
              {data.data.map((client, index) => (
                <li key={index} className="mb-2">
                  <Button
                    onClick={() => {
                      if (selectedClient?.id !== client.id) {
                        onSelectClient(client);
                      }
                    }}
                    className={`font-oswald flex flex-row justify-between items-center w-full p-5 border rounded-lg ${selectedClient?.id === client.id
                      ? 'bg-gray-400 cursor-not-allowed hover:cursor-not-allowed'
                      : 'bg-highBlue hover:bg-lightWhite hover:text-highBlue hover:border-highBlue'
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
                currentPage={data.meta.currentPage}
                totalPages={data.meta.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <div className='text-highBlue font-oswald flex justify-center'>Aucun client trouvé</div>
        )}
      </div>
    </div>
  );
};

export default ClientModal;
