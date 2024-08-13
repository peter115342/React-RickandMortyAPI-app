'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const HomePage = () => {
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchCharacters();
  }, [page]);

  const fetchCharacters = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
      const data = await response.json();
      setCharacters(prevCharacters => [...prevCharacters, ...data.results]);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  if (loading && characters.length === 0) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-4">
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr>
            <th className="border-b p-4 text-left">Name</th>
            <th className="border-b p-4 text-left">Status</th>
            <th className="border-b p-4 text-left">Species</th>
            <th className="border-b p-4 text-left">Gender</th>
            <th className="border-b p-4 text-left">Origin</th>
            <th className="border-b p-4 text-left">Created</th>
            <th className="border-b p-4 text-left">Detail</th>
          </tr>
        </thead>
        <tbody>
          {characters.map((character) => (
            <tr key={character.id} className="hover:bg-gray-200">
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
                {character.origin.name !== 'unknown'
                  ? character.origin.name
                  : <span className="italic">Unknown</span>}
              </td>
              <td className="border-b p-4">{new Date(character.created).toLocaleDateString()}</td>
              <td className="border-b p-4">
                <Link href={`/character/${character.id}`} className="text-blue-500 hover:underline">
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={loadMore}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Load more
      </button>
    </div>
  );
};

export default HomePage;
