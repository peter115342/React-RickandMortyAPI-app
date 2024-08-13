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
    if (showAllData && 
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
      fetchNextPage();
    }
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
    <div className="p-4">
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr>
            <th onClick={() => requestSort('name')} className="border-b p-4 text-left cursor-pointer">
              <div className="flex items-center">
                Name
                <span className="ml-1">
                  {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                </span>
              </div>
            </th>
            <th onClick={() => requestSort('status')} className="border-b p-4 text-left cursor-pointer">
              <div className="flex items-center">
                Status
                <span className="ml-1">
                  {sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                </span>
              </div>
            </th>
            <th onClick={() => requestSort('species')} className="border-b p-4 text-left cursor-pointer">
              <div className="flex items-center">
                Species
                <span className="ml-1">
                  {sortConfig.key === 'species' ? (sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                </span>
              </div>
            </th>
            <th onClick={() => requestSort('gender')} className="border-b p-4 text-left cursor-pointer">
              <div className="flex items-center">
                Gender
                <span className="ml-1">
                  {sortConfig.key === 'gender' ? (sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                </span>
              </div>
            </th>
            <th onClick={() => requestSort('origin')} className="border-b p-4 text-left cursor-pointer">
              <div className="flex items-center">
                Origin
                <span className="ml-1">
                  {sortConfig.key === 'origin' ? (sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                </span>
              </div>
            </th>
            <th onClick={() => requestSort('created')} className="border-b p-4 text-left cursor-pointer">
              <div className="flex items-center">
                Created
                <span className="ml-1">
                  {sortConfig.key === 'created' ? (sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                </span>
              </div>
            </th>
            <th className="border-b p-4 text-left">Detail</th>
          </tr>
        </thead>
        <tbody>
          {(showAllData ? sortedCharacters : sortedCharacters.slice(0, visibleRows)).map((character) => (
            <tr key={character.id} className="hover:bg-black">
              <td className="border-b p-4">{character.name}</td>
              <td className="border-b p-4">
                <span className={`px-2 py-1 rounded-full text-white ${
                  character.status === 'Alive' ? 'bg-green-500' :
                  character.status === 'Dead' ? 'bg-red-500' :
                  'bg-gray-500'
                }`}>
                  {character.status}
                </span>
              </td>
              <td className="border-b p-4">{character.species}</td>
              <td className="border-b p-4">{character.gender}</td>
              <td className="border-b p-4">
                {character.origin.name !== 'unknown' ? (
                  character.origin.name
                ) : (
                  <span className="px-2 py-1 rounded-full text-white bg-gray-500">
                    Unknown
                  </span>
                )}
              </td>
              <td className="border-b p-4">
                {new Date(character.created).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }).replace(/\//g, '.')}
              </td>
              <td className="border-b p-4">
                <Link href={`/character/${character.id}`} className="text-blue-500 hover:underline">
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center space-x-4">
        {!showAllData && (
          <>
            {visibleRows > 5 && (
              <button
                onClick={loadLess}
              >
                <FaArrowUp className="mr-2" /> Load less
              </button>
            )}
            {visibleRows < sortedCharacters.length && (
              <button
                onClick={loadMore}
              >
                <FaArrowDown className="mr-2" /> Load more
              </button>
            )}
          </>
        )}
        <button
          onClick={() => setShowAllData(!showAllData)}
          className="min-w-160 px-4 py-2 "

        >
          <FaInfinity className="mr-2" /> 
          {showAllData ? 'Disable' : 'Enable'} Infinite Scroll
        </button>
      </div>
    </div>
  );
};

const HomePage = () => (
  <QueryClientProvider client={queryClient}>
    <CharacterList />
  </QueryClientProvider>
);

export default HomePage;
