'use client'

import { AnimatePresence, motion } from "motion/react"
import React, { useEffect, useRef, useState } from 'react'
import Card from './card'
import Image from 'next/image'
import { IconThumbUp, IconPlayerPlayFilled, IconCirclePlus, IconChevronDown, IconChevronLeft, IconChevronRight, } from '@tabler/icons-react';

type Movie = {
  id: number
  poster_path: string
  name: string
  overview: string
  vote_average: string
  backdrop_path: string
}

const TrendingPage = () => {
  const [allMovie, setAllMovie] = useState<Movie[]>([])
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null)

  const [isTrailerOpen, setIsTrailerOpen] = useState(false)
  const [trailerKey, setTrailerKey] = useState("")

  const rowRef = useRef<HTMLDivElement>(null)
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null)
  const BASE_URL = "https://movie-proxy-omega.vercel.app/api/movies"

  useEffect(() => {
    const DataFetch = async () => {
      try {
        const url = "https://movie-proxy-omega.vercel.app/api/movies?endpoint=discover/tv&with_genres=16&sort_by=popularity.desc"
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Error:${response.status}`)
        }
        const result = await response.json()

        setAllMovie(result.results.slice(0, 15))
      } catch (error) {
        console.error(error)
      }
    }
    DataFetch()
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (!rowRef.current) return
    const amount = rowRef.current.offsetWidth

    rowRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  return (
    <div className="group mt-6">
      <div className="px-8 lg:px-16">
        <h1 className="text-2xl md:text-4xl tracking-tight font-semibold text-white">
          Animated Shows
        </h1>
      </div>



      <div className="w-full relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-5 z-100 h-42 md:h-54 lg:h-75  md:w-16 rounded-l-lg opacity-0 transition group-hover:opacity-100"
        >
          <IconChevronLeft
            size={40}
            className="mx-auto text-white"
          />
        </button>

        <button
          onClick={() => scroll("right")}
          className="cursor-pointer absolute right-0 top-5 z-100 h-42 md:h-54 lg:h-75 md:w-16 opacity-0 transition group-hover:opacity-100"
        >
          <IconChevronRight
            size={40}
            className="mx-auto text-white"
          />
        </button>

        <div
          ref={rowRef}
          className="flex flex-row gap-1 md:gap-2 overflow-x-scroll no-scrollbar overflow-y-visible scrollbar-hide scroll-smooth pt-6 pb-2 md:py-7 lg:py-8 px-8 lg:px-16"
        >
          {allMovie.map((item, idx) => (
            <div
              key={item.id}
              className="relative shrink-0"
              onMouseEnter={() => {
                hoverTimeout.current = setTimeout(
                  (() => setHoveredMovie(item.id)), 500)
              }
              }
              onMouseLeave={() => {
                if (hoverTimeout.current) { clearTimeout(hoverTimeout.current) }
                setHoveredMovie(null)
              }}
            >

              <motion.div
                className=" lg:h-80 w-28 md:w-35 lg:w-50 overflow-hidden cursor-pointer rounded-lg"
              >
                <Card
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.name}
                  width={600}
                  height={700}
                />
              </motion.div>

              <AnimatePresence>
                {hoveredMovie === item.id && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.96,
                    }}
                    animate={{
                      opacity: 1,
                      y: -24,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.96,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 35,
                    }}
                    className={`absolute top-0 z-50 w-48 md:w-[320px] overflow-hidden rounded-2xl bg-[#181818] shadow-2xl cursor-pointer
                    
                    ${idx === 0
                        ? "-right-30"
                        : idx === allMovie.length - 1
                          ? "-left-30"
                          : "left-1/2 -translate-x-1/2"
                      }
                    `}
                  >

                    <div className="relative h-28 md:h-32 lg:h-48 w-full">
                      <Image
                        src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-[#181818] to-transparent" />
                    </div>

                    <div className="px-4 py-2 md:p-4 ">

                      <div className="flex items-center justify-between md:mt-2">

                        <div className="flex gap-1 md:gap-3">

                          <button
                            className="flex size-7 md:size-10 items-center justify-center rounded-full bg-white text-black cursor-pointer hover:scale-105 transition-all duration-300"
                            onClick={async () => {
                              try {
                                const res = await fetch(
                                  `${BASE_URL}?endpoint=tv/${item.id}/videos`
                                )

                                const data = await res.json()

                                const trailer = data.results.find(
                                  (video: any) =>
                                    video.site === "YouTube" &&
                                    (video.type === "Trailer" || video.type === "Teaser")
                                )

                                if (trailer) {
                                  setTrailerKey(trailer.key)
                                  setIsTrailerOpen(true)
                                } else {
                                  alert("Trailer not available!")
                                }
                              } catch (error) {
                                console.error(error)
                              }
                            }}
                          >
                            <IconPlayerPlayFilled className="w-4 h-4 md:w-5 md:h-5 lg:w-8 lg:h-8" />
                          </button>

                          <button
                            className=" flex size-7 md:size-10 items-center justify-center rounded-full border border-gray-500  hover:scale-105 transition-all duration-300 cursor-pointer"
                          >
                            <IconCirclePlus className="w-4 h-4 md:w-5 md:h-5 lg:w-8 lg:h-8" />
                          </button>
                        </div>

                        
                      </div>
                      <div className="flex flex-row justify-between items-center mt-2">
                        <h1 className="text-sm md:text-lg font-bold line-clamp-1">
                          {item.name}
                        </h1>
                        <p className=" text-green-400 text-sm md:text-lg">
                          ⭐{Number(item.vote_average).toFixed(1)}
                        </p>
                      </div>
                      <p className="line-clamp-1 lg:line-clamp-3 text-xs text-gray-400">
                        {item.overview}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {isTrailerOpen && (
          <motion.div
            className="fixed inset-0 z-999 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsTrailerOpen(false)
              setTrailerKey("")
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-[95%] max-w-5xl aspect-video "
            >
              <button
                onClick={() => {
                  setIsTrailerOpen(false)
                  setTrailerKey("")
                }}
                className="absolute -top-12 right-0 text-white text-3xl font-bold cursor-pointer"
              >
                ✕
              </button>

              <iframe
                className="w-full h-full rounded-xl"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="YouTube Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TrendingPage  