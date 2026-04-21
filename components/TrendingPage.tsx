'use client'
import { motion } from "motion/react"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Card from './card';

type Movie = {
  id: number;
  poster_path: string;
  title: string;
  overview: string;
  vote_average: string;
  idx:string
}
const TrendingPage = () => {
  const [allMovie, setAllMovie] = useState<Movie[]>([])
  useEffect(() => {
    const DataFetch = async () => {
      try {
        const url = "https://movie-proxy-omega.vercel.app/api/movies?endpoint=trending/movie/week"
        let response = await fetch(url)
        if (!response.ok)
          throw new Error(`Error:${response.status}`)
        const result = await response.json()
        setAllMovie(result.results.slice(0, 10))
      }
      catch (error) {
        console.error(error)
      }
    }
    DataFetch()
  }
    ,
    [])
  return (
     
      <div className=' lg:h-88 px-8 lg:px-16 '>
        <h1 className='text-2xl md:text-4xl tracking-tight font-semibold text-white dark:text-white '>Trending this week</h1>
        <div className='flex overflow-y-hidden my-2 overflow-x-hidden relative'>
        
 
          <div className=" flex flex-row gap-1 text-white md:gap-6 ">
            {allMovie.map((mov, idx) => (
            <motion.div
              whileHover={{
                scale: 1.1,
              }}
              transition={{
                duration: 0.3
              }}
              key={idx}
              className='w-28 md:w-35 lg:w-50 flex flex-col items-center group relative cursor-pointer '>
              <div
                className="  ">
                <Card src={`https://image.tmdb.org/t/p/w500${mov.poster_path}`} alt={"MovPoster"} width={300} height={1000} />
              </div>

              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-linear-to-b from-transparent to-black" />

              <div>
                
              </div>
              <div
                className="absolute bottom-3 text-left px-2 w-full  opacity-0 group-hover:opacity-100  rounded-xl"> 
                <h1 className="text-[12px] md:text-xl font-semibold line-clamp-2 text-white">{mov.title}</h1>
                <span className=" font-medium text-[10px] md:text-base md:text-md">⭐ {mov.vote_average}</span>
              </div>
            </motion.div>
          ))} 
          </div>
         
        </div>
       

      </div>
  )
}

export default TrendingPage