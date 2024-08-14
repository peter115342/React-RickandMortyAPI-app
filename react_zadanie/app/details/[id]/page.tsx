'use client';

import { useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import Image from 'next/image';

const queryClient = new QueryClient();

const fetchCharacter = async (id: string) => {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
  return res.json();
};

function CharacterDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const { data: character, isLoading, isError } = useQuery(['character', id], () => fetchCharacter(id));

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching character</div>;

  return (
    <div className="container mx-auto p-4">
      <button onClick={() => router.back()} className="mb-4 text-blue-500 hover:underline">
        &larr; Back
      </button>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <Image
              src={character.image}
              alt={character.name}
              width={300}
              height={300}
              className="h-48 w-full object-cover md:w-48"
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              {character.status}
            </div>
            <h1 className="mt-1 text-4xl font-bold text-gray-900">{character.name}</h1>
            <p className="mt-2 text-gray-600">Gender: {character.gender}</p>
            <p className="mt-2 text-gray-600">Species: {character.species}</p>
            <p className="mt-2 text-gray-600">Origin: {character.origin.name}</p>
            <p className="mt-2 text-gray-600">Location: {character.location.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CharacterDetailsPage({ params }: { params: { id: string } }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CharacterDetails params={params} />
    </QueryClientProvider>
  );
}
