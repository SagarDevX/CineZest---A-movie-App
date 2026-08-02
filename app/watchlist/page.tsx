"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { supabase } from "../lib/supabase"

type WatchlistMovie = {
  id: number
  movie_id: number
  movie_title: string
  poster_path: string
  user_id: string
}

export default function WatchlistPage() {
  const [movies, setMovies] = useState<WatchlistMovie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getWatchlist()
  }, [])

  const getWatchlist = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", user.id)

      if (error) {
        console.error(error)
        setLoading(false)
        return
      }

      setMovies(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWatchlist = async (movieId: number) => {
    try {
      const { error } = await supabase
        .from("watchlist")
        .delete()
        .eq("movie_id", movieId)

      if (error) {
        console.error(error)
        return
      }
      setMovies((prev) =>
        prev.filter((movie) => movie.movie_id !== movieId)
      )
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl">Loading...</h1>
      </div>
    )
  }

  return (
    <div className=" max-w-8xl mx-auto mt-24  text-white flex-wrap items-center justify-center px-4 md:px-12">
      <h1 className="text-3xl md:text-4xl font-bold mt-8 tracking-tight text-white ">
        My Watchlist
      </h1>

      {movies.length === 0 ? (
        <p>No movies in watchlist yet.</p>
      ) : (
        <div className="max-w-fit flex flex-wrap justify-center items-start gap-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="rounded-lg "
            >
              <div className="lg:h-74 w-28 md:w-35 lg:w-50 overflow-hidden cursor-pointer rounded-lg">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.movie_title}
                  width={800}
                  height={700}
                  className="object-cover rounded-lg"
                />
              </div>

              <div className="flex flex-col items-center w-28 md:w-35 lg:w-50 ">
                <h2 className="text-xs md:text-sm lg:text-xl font-medium line-clamp-1">
                  {movie.movie_title}
                </h2>

                <button
                  onClick={() =>
                    removeFromWatchlist(movie.movie_id)
                  }
                  className="mt-1 text-center w-1/2  rounded-md bg-red-600 py-2 text-sm font-medium hover:bg-red-700 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}