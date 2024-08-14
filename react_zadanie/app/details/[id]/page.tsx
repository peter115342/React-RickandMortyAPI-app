'use client';

import { useRouter } from 'next/navigation';
import { QueryClientProvider, QueryClient, useQuery } from 'react-query';
import Image from 'next/image';
import { FaVenusMars, FaDna, FaGlobe, FaMapMarkerAlt, FaCheck, FaTimes, FaQuestion } from 'react-icons/fa';

const queryClient = new QueryClient();

const fetchCharacter = async (id: string) => {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
  return res.json();
};

const CharacterDetails = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;

  const { data: character, isLoading, isError } = useQuery(['character', id], () => fetchCharacter(id));

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching character</div>;

  return (
    <div className="container mx-auto p-4 max-w-[720px] max-h-[687px] overflow-auto">
      <div className="flex flex-col md:flex-row md:items-start">
        <button onClick={() => router.back()} className="mb-4 md:mb-0 md:mr-4 ">
          &larr; Back
        </button>
        <div className="overflow-hidden flex-grow">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-[300px] md:h-[300px] flex-shrink-0">
              <Image
                src={character.image}
                alt={character.name}
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 md:p-6 flex-grow">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{character.name}</h1>
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
              <p className="mt-2 ">
                <FaVenusMars className="inline mr-2" /> {character.gender}
              </p>
              <p className="mt-2">
                <FaDna className="inline mr-2" /> {character.species}
              </p>
              <p className="mt-2 flex items-center">
                <FaGlobe className="inline mr-2" />
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
              </p>
              <p className="mt-2">
                <FaMapMarkerAlt className="inline mr-2" /> {character.location.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CharacterDetailsPage = ({ params }: { params: { id: string } }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CharacterDetails params={params} />
    </QueryClientProvider>
  );
};

export default CharacterDetailsPage;
