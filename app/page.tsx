"use client"

import Secondpage from "@/components/Secondpage"
import React, { useEffect, useState } from "react"

type Movie = {
  id: number
  title: string
  overview: string
  backdrop_path: string
}
type Video = {
  key: string
  site: string
  type: string
  official: boolean
}
type VideoResponse = {
  results: Video[]
}

const Page = () => {
  const [movie, setMovie] = useState<Movie[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const DataFetch = async () => {
      try {
        const url =
          "https://movie-proxy-omega.vercel.app/api/movies?endpoint=movie/top_rated"

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const result = await response.json()

        setMovie(result.results.slice(0, 5))
      } catch (error) {
        console.error(error)
      }
    }

    DataFetch()
  }, [])

  useEffect(() => {
    if (movie.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movie.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [movie])

  const currentMovie = movie[currentIndex]

  const handlePlay = async () => {
    if (!currentMovie) return

    try {
      const response = await fetch(
        `https://movie-proxy-omega.vercel.app/api/movies?endpoint=movie/${currentMovie.id}/videos`
      )

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const result: VideoResponse = await response.json()

      const trailer =
        result.results.find(
          (video) =>
            video.site === "YouTube" &&
            video.type === "Trailer" &&
            video.official === true
        ) ||
  
        result.results.find(
          (video) =>
            video.site === "YouTube" &&
            video.type === "Trailer"
        )

      if (trailer) {
        window.open(
          `https://www.youtube.com/watch?v=${trailer.key}`,
          "_blank"
        )
      } else {
        alert("Trailer not available for this movie.")
      }
    } catch (error) {
      console.error("Trailer error:", error)
    }
  }

  return (
    <div>
      <div
        className="h-120 lg:h-screen bg-cover bg-center relative transition-all duration-1000 bg-black"
      >
        <div
          className="w-full mt-20 lg:mt-0 lg:w-3/5 h-full absolute right-0 center bg-cover bg-center bg-no-repeat bg-linear-to-b from-black via-transparent to-black"
          style={{
            backgroundImage: currentMovie
              ? `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})`
              : "none",
          }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-black via-transparent to-black" />
        </div>

        <div className="relative flex flex-col justify-end lg:justify-center lg:items-center h-full lg:h-screen lg:w-1/2 py-20 select-none text-white">
          {currentMovie && (
            <div className="lg:h-72 w-56 md:w-100 sm:w-120 flex flex-col ml-10 lg:ml-0 justify-center items-start">
              <h1 className="text-3xl lg:text-6xl font-bold max-w-3xl text-start line-clamp-3">
                {currentMovie.title}
              </h1>

              <p className="text-lg line-clamp-2 md:line-clamp-3 max-w-sm text-gray-400">
                {currentMovie.overview}
              </p>
            </div>
          )}
          <div className="flex flex-row gap-4 my-2 w-56 sm:w-100 ml-10 lg:ml-0">
            <button
              onClick={handlePlay}
              className="bg-white text-black font-bold px-2 py-1 text-2xl lg:text-3xl rounded-xl w-28 lg:w-40 cursor-pointer hover:scale-105 transition-all duration-400"
            >
              Play
            </button>

          </div>
        </div>
      </div>

      <Secondpage />
    </div>
  )
}

export default Page