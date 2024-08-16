'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import { FaSort, FaSortUp, FaSortDown, FaArrowUp, FaArrowDown, FaInfinity } from 'react-icons/fa';
import { FaCheck, FaTimes, FaQuestion } from 'react-icons/fa';
import React from 'react';
import Image from 'next/image';

const queryClient = new QueryClient();

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  origin: { name: string };
  created: string;
  image: string;
}

interface ApiResponse {
  info: { next: string | null };
  results: Character[];
}

const fetchCharacters = async ({ pageParam = 1 }): Promise<ApiResponse> => {
  const res = await fetch(`https://rickandmortyapi.com/api/character?page=${pageParam}&count=5`);
  return res.json();
};

const CharacterList = () => {
  const router = useRouter();
  const [sortConfig, setSortConfig] = useState<{ key: keyof Character | null; direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });
  const [visibleRows, setVisibleRows] = useState(5);
  const [showAllData, setShowAllData] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } = useInfiniteQuery<ApiResponse, Error>(
    'characters',
    async (context) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return fetchCharacters(context);
    },
    {
      getNextPageParam: (lastPage) => lastPage.info.next ? parseInt(lastPage.info.next.split('=')[1]) : undefined,
    }
  );

  const sortedCharacters = React.useMemo(() => {
    let sortableItems = data ? data.pages.flatMap(page => page.results) : [];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key: keyof Character) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const loadMore = () => {
    if (!showAllData) {
      setVisibleRows(prev => Math.min(prev + 5, sortedCharacters.length));
    }
  };

  const loadLess = () => {
    setVisibleRows(prev => Math.max(prev - 5, 5));
  };

  const handleScroll = () => {
    if (showAllData) {
      setIsScrolled(window.scrollY > 100);
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        fetchNextPage();
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (showAllData) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAllData]);

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-2xl">Loading...</p>
    </div>
  );
  if (isError) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div>
      <div className="p-4 mb-1 flex justify-center">
        <button
          onClick={() => setShowAllData(!showAllData)}
          className="min-w-[140px] max-w-[160px] sm:max-w-none px-4 py-2"
        >
          <FaInfinity className="mr-2" />
          {showAllData ? 'Disable' : 'Enable'} Infinite Scroll
        </button>
      </div>
      <div className="p-0 sm:p-4">
        <div className="overflow-x-auto sm:overflow-x-visible mx-1 sm:ml-24 sm:mr-24">
          <div className="grid sm:table w-full">
            <div className="hidden sm:table-row-group">
              <div className="sm:table-row">
                <div onClick={() => requestSort('name')} className="hidden sm:table-cell border-b p-2 sm:p-4 text-left cursor-pointer">
                  <div className="flex items-center">
                    Name
                    <span className="ml-1">
                      {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                    </span>
                  </div>
                </div>
                <div onClick={() => requestSort('status')} className="hidden sm:table-cell border-b p-2 sm:p-4 text-left cursor-pointer">
                  <div className="flex items-center">
                    Status
                    <span className="ml-1">
                      {sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                    </span>
                  </div>
                </div>
                <div onClick={() => requestSort('species')} className="hidden sm:table-cell border-b p-2 sm:p-4 text-left cursor-pointer">
                  <div className="flex items-center">
                    Species
                    <span className="ml-1">
                      {sortConfig.key === 'species' ? (sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                    </span>
                  </div>
                </div>
                <div onClick={() => requestSort('gender')} className="hidden sm:table-cell border-b p-2 sm:p-4 text-left cursor-pointer">
                  <div className="flex items-center">
                    Gender
                    <span className="ml-1">
                      {sortConfig.key === 'gender' ? (sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                    </span>
                  </div>
                </div>
                <div onClick={() => requestSort('origin')} className="hidden sm:table-cell border-b p-2 sm:p-4 text-left cursor-pointer">
                  <div className="flex items-center">
                    Origin
                    <span className="ml-1">
                      {sortConfig.key === 'origin' ? (sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                    </span>
                  </div>
                </div>
                <div onClick={() => requestSort('created')} className="hidden sm:table-cell border-b p-2 sm:p-4 text-left cursor-pointer">
                  <div className="flex items-center">
                    Created
                    <span className="ml-1">
                      {sortConfig.key === 'created' ? (sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                    </span>
                  </div>
                </div>
                <div className="hidden sm:table-cell border-b p-2 sm:p-4 text-left">Detail</div>
              </div>
            </div>
            <div className="sm:table-row-group">
              {(showAllData ? sortedCharacters : sortedCharacters.slice(0, visibleRows)).map((character) => (
                <div key={character.id} className="grid sm:table-row mb-4 sm:mb-0 hover:bg-black border-t-4 border-b-4 sm:border-t-0 sm:border-b border-gray-700 sm:border-gray-600">
                  <div className="grid grid-cols-2 sm:table-cell border-b p-2 sm:p-4 align-middle">
                    <span className="font-bold sm:hidden">Name:</span>
                    <div className="flex items-center">
                      <Image
                        src={character.image}
                        alt={character.name}
                        width={40}
                        height={40}
                        className="mr-4"
                      />
                      {character.name}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:table-cell border-b p-2 sm:p-4 align-middle">
                    <span className="font-bold sm:hidden">Status:</span>
                    <span className={`
                      flex flex-row justify-center items-center
                      px-1.5 py-1
                      w-fit h-6
                      rounded
                      ${character.status === 'Alive' ? 'bg-[#67EF7B] text-black' :
                        character.status === 'Dead' ? 'bg-red-500 text-black' :
                        'bg-gray-500 text-white'}
                    `}>
                      {character.status === 'Alive' && <FaCheck className="mr-1" />}
                      {character.status === 'Dead' && <FaTimes className="mr-1" />}
                      {character.status === 'unknown' && <FaQuestion className="mr-1" />}
                      {character.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:table-cell border-b p-2 sm:p-4 align-middle">
                    <span className="font-bold sm:hidden">Species:</span>
                    <span className="flex items-center">{character.species}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:table-cell border-b p-2 sm:p-4 align-middle">
                    <span className="font-bold sm:hidden">Gender:</span>
                    <span className="flex items-center">{character.gender}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:table-cell border-b p-2 sm:p-4 align-middle">
                    <span className="font-bold sm:hidden">Origin:</span>
                    <span className="flex items-center">
                      {character.origin.name !== 'unknown' ? (
                        character.origin.name
                      ) : (
                        <span className={`
                          flex flex-row justify-center items-center
                          px-1.5 py-1
                          w-fit h-6
                          rounded
                          bg-gray-500 text-white
                        `}>
                          <FaQuestion className="mr-1" />
                          Unknown
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:table-cell border-b p-2 sm:p-4 align-middle">
                    <span className="font-bold sm:hidden">Created:</span>
                    <span className="flex items-center">
                      {new Date(character.created).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }).replace(/\//g, '.')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:table-cell border-b p-2 sm:p-4 align-middle">
                    <span className="font-bold sm:hidden">Detail:</span>
                    <span className="flex items-center">
                      <Link href={`/details/${character.id}`} className="text-indigo-600 hover:text-indigo-900">
                        Link
                      </Link>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          {!showAllData && (
            <>
              {visibleRows > 5 && (
                <button onClick={loadLess}>
                  <FaArrowUp className="mr-2" /> Show less
                </button>
              )}
              {visibleRows < sortedCharacters.length && (
                <button onClick={loadMore}>
                  <FaArrowDown className="mr-2" /> Load more
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {showAllData && isScrolled && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm text-white rounded-full shadow-lg hover:bg-opacity-30 transition-all duration-300 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center !p-0 !m-0 !border-0 !min-w-0 !min-h-0"
          style={{ background: 'rgba(255, 255, 255, 0.2)' }}
          aria-label="Scroll to top"
        >
          <FaArrowUp className="text-lg sm:text-xl md:text-2xl" />
        </button>
      )}
    </div>
  );
};

const HomePage = () => (
  <QueryClientProvider client={queryClient}>
    <CharacterList />
  </QueryClientProvider>
);

export default HomePage;
