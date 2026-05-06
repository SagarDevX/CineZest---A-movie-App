'use client'
import { motion } from "motion/react"
import React, { useEffect, useState } from 'react'
import Card from "../Card"

type Movie = {
  id: number;
  poster_path: string;
  name: string;
  overview: string;
  vote_average: string;
  idx: string;
}

const BASE_URL = "https://movie-proxy-omega.vercel.app/api/movies"

const Scifi = () => {
  const [allMovie, setAllMovie] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const DataFetch = async () => {
      try {
        setLoading(true)

        const [page1, page2] = await Promise.all([
          fetch(`${BASE_URL}?endpoint=discover/tv&with_genres=10765&sort_by=popularity.desc&page=1`).then(r => r.json()),
          fetch(`${BASE_URL}?endpoint=discover/tv&with_genres=10765&sort_by=popularity.desc&page=2`).then(r => r.json()),
        ])

        const allMovies = [
           ...page1.results,
          ...page2.results,
        ]

        setAllMovie(allMovies)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    DataFetch()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center text-white text-5xl h-screen">
      Loading...
    </div>
  )

  return (
    <div className="h-full max-w-8xl mx-auto mt-24  text-white flex-wrap items-center justify-center px-4 md:px-12">
      <div className="px-16 py-2 mb-6 ">
        <h1 className="text-3xl  font-semibold">
        Sci-fi
      </h1>
      <p>Sci-fi shows that explore the unknown - questioning time, space, humanity, and what the future holds.</p>
        </div>

      <div className="max-w-fit flex flex-wrap justify-center items-center gap-2">
        {allMovie.map((mov, idx) => (
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
  )
}

export default Scifi