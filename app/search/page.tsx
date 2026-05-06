'use client';
import Card from "@/components/card";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Movie = {
  id: number;
  name: string;
  poster_path: string | null;
  vote_average: string;
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!query) return;

      setLoading(true);

      try {
        const url = `https://movie-proxy-omega.vercel.app/api/movies?endpoint=search/tv&query=${encodeURIComponent(query)}`;
        const res = await fetch(url);
        const data = await res.json();

        const filtered = (data.results || []).filter(
          (m: Movie) => m.poster_path
        );

        setMovies(filtered);
      } catch (err) {
        console.error(err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (
    <div className=" pt-24 p-4 text-white">
      <h1 className="text-2xl mb-6">
        Results for "<span className="text-blue-400">{query}</span>"
      </h1>

      {loading && (
        <div className="text-center text-neutral-400">Loading...</div>
      )}

      {!loading && movies.length === 0 && query && (
        <div className="text-center text-neutral-400">
          No results found with images for "{query}"
        </div>
      )}

       <div className="max-w-fit flex flex-wrap justify-center items-center gap-2">
        {movies.map((mov, idx) => (
          <div

            key={`${mov.id}-${idx}`}
            className='w-28 md:w-34 lg:w-50 group relative cursor-pointer'>
            <div>
              <Card
                src={`https://image.tmdb.org/t/p/w500${mov.poster_path}`}
                alt="MovPoster"
                width={300}
                height={1000}
              />
            </div>

            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-linear-to-b from-transparent to-black" />

            <div className="absolute bottom-3 text-left px-2 w-full opacity-0 group-hover:opacity-100 rounded-xl">
              <h1 className="text-[12px] md:text-xl font-semibold line-clamp-2 text-white">{mov.name}</h1>
              <span className="font-medium text-[10px] md:text-base">⭐ {mov.vote_average}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}