"use client"
import Footer from '@/components/Footer'
import Secondpage from '@/components/Secondpage'
import React, { useEffect, useState } from 'react'

type Movie = {
  title: string,
  overview: string,
  backdrop_path: string,
}

const Page = () => {

  const [movie, setMovie] = useState<Movie[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const DataFetch = async () => {
      try {
        const url = "https://movie-proxy-omega.vercel.app/api/movies?endpoint=movie/top_rated"
        let response = await fetch(url)
        if (!response.ok)
          throw new Error(`Error:${response.status}`)
        const result = await response.json()
        setMovie(result.results.slice(0, 5))
      }
      catch (error) {
        console.error(error)
      }
    }
    DataFetch()
  },
    [])

  useEffect(() => {
    if (movie.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movie.length)
      return () => clearInterval(interval)
    }, 5000)
  },
    [movie])

  const currentMovie = movie[currentIndex]
  return (

    <div>
      <div
        className="h-120 lg:h-screen bg-cover bg-center relative transition-all duration-1000 bg-black"
      >

        <div
          className='w-full lg:w-3/5 h-full absolute right-0 center bg-cover bg-center bg-no-repeat bg-linear-to-b from-black via-transparent to-black '
          style={{
            backgroundImage: currentMovie
              ? `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})`
              : 'none',
          }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-black via-transparent to-black" />
        </div>

        <div className="relative flex flex-col justify-end lg:justify-center lg:items-center h-full lg:h-screen lg:w-1/2 py-20 select-none text-white">
          {currentMovie && (
            <div className='lg:h-screen w-48 md:w-100 sm:w-120 flex flex-col ml-10 lg:ml-0  justify-center items-start'>
              <h1 className="text-3xl lg:text-6xl font-bold max-w-3xl text-start">{currentMovie.title}</h1>
              <p className="text-lg line-clamp-2 md:line-clamp-3 max-w-sm text-gray-400">
                {currentMovie.overview}
              </p>

            </div>
          )}
          <div className='flex flex-row gap-4 my-2 w-56 sm:w-120 ml-10 lg:ml-0'>
            <button className='bg-white text-black font-bold px-2 py-1 text-2xl lg:text-3xl rounded-xl w-28 lg:w-40 cursor-pointer hover:scale-105 transition-all duration-400'> Play</button>
            <button className='bg-neutral-400 text-neutral-100 font-medium px-2 py-1 text-xl lg:text-2xl w-28 lg:w-40 rounded-xl hover:scale-105 transition-all duration-400 cursor-pointer'>More Info</button>
          </div>

        </div>
      </div>
      <Secondpage />
      <Footer />
    </div>

  )
}

export default Page