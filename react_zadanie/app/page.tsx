'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import { FaSort, FaSortUp, FaSortDown, FaArrowUp, FaArrowDown, FaInfinity } from 'react-icons/fa';
import React from 'react';

const queryClient = new QueryClient();

const fetchCharacters = async ({ pageParam = 1 }) => {
  const res = await fetch(`https://rickandmortyapi.com/api/character?page=${pageParam}&count=5`);
  return res.json();
};

const CharacterList = () => {
  const router = useRouter();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [visibleRows, setVisibleRows] = useState(5);
  const [showAllData, setShowAllData] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } = useInfiniteQuery(
    'characters',
    async (context) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return fetchCharacters(context);
    },
    {
      getNextPageParam: (lastPage, pages) => lastPage.info.next ? pages.length + 1 : undefined,
      select: (data) => ({
        pages: data.pages,
        pageParams: data.pageParams,
        results: data.pages.flatMap(page => page.results)
      })
    }
  );

  const sortedCharacters = React.useMemo(() => {
    let sortableItems = data ? data.results : [];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
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
      <div className="p-4 mb-4 flex justify-center">
        <button
          onClick={() => setShowAllData(!showAllData)}
          className="min-w-160 px-4 py-2"
        >
          <FaInfinity className="mr-2" /> 
          {showAllData ? 'Disable' : 'Enable'} Infinite Scroll
        </button>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto sm:overflow-x-visible">
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
                    <div className="grid grid-cols-2 sm:table-cell border-b p-2 sm:p-4">
                    <span className="font-bold sm:hidden">Name:</span>
                    {character.name}
                  </div>
                  <div className="grid grid-cols-2 sm:table-cell border-b p-2 sm:p-4">
                    <span className="font-bold sm:hidden">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-white ${
                      character.status === 'Alive' ? 'bg-green-500' :
                      character.status === 'Dead' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`}>
                      {character.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:table-cell border-b p-2 sm:p-4">
                    <span className="font-bold sm:hidden">Species:</span>
                    {character.species}
                  </div>
                  <div className="grid grid-cols-2 sm:table-cell border-b p-2 sm:p-4">
                    <span className="font-bold sm:hidden">Gender:</span>
                    {character.gender}
                  </div>
                  <div className="grid grid-cols-2 sm:table-cell border-b p-2 sm:p-4">
                    <span className="font-bold sm:hidden">Origin:</span>
                    {character.origin.name !== 'unknown' ? (
                      character.origin.name
                    ) : (
                      <span className="px-2 py-1 rounded-full text-white bg-gray-500">
                        Unknown
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:table-cell border-b p-2 sm:p-4">
                    <span className="font-bold sm:hidden">Created:</span>
                    {new Date(character.created).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }).replace(/\//g, '.')}
                  </div>
                  <div className="grid grid-cols-2 sm:table-cell border-b p-2 sm:p-4">
                    <span className="font-bold sm:hidden">Detail:</span>
                    <Link href={`/details/${character.id}`} className="text-indigo-600 hover:text-indigo-900">
                      Link
                    </Link>
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
                  <FaArrowUp className="mr-2" /> Load less
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
