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
      // Get logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      // Fetch only this user's watchlist
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

      // Update UI without refreshing
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
    <div className="min-h-80 max-w-8xl mx-auto mt-24  text-white flex-wrap items-center justify-center px-4 md:px-12">
      <h1 className="text-3xl md:text-4xl font-bold mt-8 ">
        My Watchlist
      </h1>

      {movies.length === 0 ? (
        <p>No movies in watchlist yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="rounded-lg overflow-hidden"
            >
              <div className="relative h-64">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.movie_title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              <h2 className="mt-2 text-sm md:text-base font-medium line-clamp-2">
                {movie.movie_title}
              </h2>

              <button
                onClick={() =>
                  removeFromWatchlist(movie.movie_id)
                }
                className="mt-3 w-full rounded-md bg-red-600 py-2 text-sm font-medium hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}