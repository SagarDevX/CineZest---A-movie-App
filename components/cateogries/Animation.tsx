'use client'
import { AnimatePresence, motion } from "motion/react"
import React, { useEffect, useRef, useState } from 'react'
import Card from "../card"
import { supabase } from "@/app/lib/supabase"
import Image from "next/image"
import { IconPlayerPlayFilled, IconCirclePlus, IconCheck } from "@tabler/icons-react"

type Movie = {
  id: string;
  poster_path: string;
  name: string;
  overview: string;
  vote_average: string;
  idx: string;
  backdrop_path: string
}

const BASE_URL = "https://movie-proxy-omega.vercel.app/api/movies"

const Animation = () => {
  const [movieKey, setMovieKey] = useState("")
  const [isTrailerOpen, setisTrailerOpen] = useState(false)

  const [watchlist, setWatchlist] = useState<string[]>([])
  const [movie, setMovie] = useState<Movie[]>([])
  const [allMovie, setAllMovie] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  const [hoveredMovie, setHoveredMovie] = useState<string | null>(null)
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null)

  const addTowatchlist = async (item: Movie) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert("Please Login first")
      return
    }

    if (watchlist.includes(item.id)) return

    const { error } = await supabase.from("watchlist").insert({
      user_id: user.id,
      movie_id: item.id,
      movie_title: item.name,
      poster_path: item.poster_path,
    })

    if (error) {
      console.error(error)
      alert("Failed to add movie")
    } else {
      setWatchlist((prev) => [...prev, item.id])
    }
  }
  useEffect(() => {
    const fetchWatchlist = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from("watchlist")
        .select("movie_id")
        .eq("user_id", user.id)

      if (data) {
        setWatchlist(data.map((movie) => movie.movie_id))
      }
    }
    fetchWatchlist()
  }, [])
  useEffect(() => {
    const DataFetch = async () => {
      try {
        setLoading(true)
         const [page1, page2, page3] = await Promise.all([
          fetch(`${BASE_URL}?endpoint=discover/tv&with_genres=16&sort_by=popularity.desc&page=1`).then(r => r.json()),
          fetch(`${BASE_URL}?endpoint=discover/tv&with_genres=16&sort_by=popularity.desc&page=2`).then(r => r.json()),
          fetch(`${BASE_URL}?endpoint=discover/tv&with_genres=16&sort_by=popularity.desc&page=3`).then(r => r.json()),
        ])

        const allMovies = [
          ...page1.results,
          ...page2.results,
          ...page3.results,
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
          Animated Shows
        </h1>
        <p>Animation shows that bring imagination to life with unforgettable characters, exciting adventures, and stories for every kind of viewer.</p>
      </div>

      <div className="max-w-fit flex flex-wrap justify-center items-center gap-2">
        {allMovie.map((mov, idx) => {
          const isSaved = watchlist.includes(mov.id)
          return <div
            key={`${mov.id}-${idx}`}
            onMouseEnter={() => {
              hoverTimeout.current = setTimeout(() => {
                setHoveredMovie(mov.id)
              }, 500)
            }}
            onMouseLeave={() => {
              if (hoverTimeout.current) {
                clearTimeout(hoverTimeout.current)
              }
              setHoveredMovie(null)
            }}
            className='w-28 md:w-34 lg:w-50 group relative cursor-pointer'>
            <div>
              <Card
                src={`https://image.tmdb.org/t/p/w500${mov.poster_path}`}
                alt="MovPoster"
                width={300}
                height={1000}
              />
            </div>

            <AnimatePresence>
              {hoveredMovie === mov.id && (
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
                  className={`absolute top-0 z-50 w-48  md:w-[320px] overflow-hidden rounded-2xl bg-[#181818] shadow-2xl 
                    
                    ${idx === 0
                      ? "-right-30"
                      : idx === movie.length - 1
                        ? "-left-30"
                        : "left-1/2 -translate-x-1/2"
                    }
                    `}
                >

                  <div className="relative h-28 md:h-32 lg:h-48 w-full">
                    <Image
                      src={`https://image.tmdb.org/t/p/original${mov.backdrop_path}`}
                      alt={mov.name}
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
                            const res = await fetch(`${BASE_URL}?endpoint=movie/${mov.id}/videos`)
                            const data = await res.json()
                            const trailer = data.results.find(
                              (v: any) => v.type === "Trailer" || v.type === "Teaser" && v.site === "YouTube"
                            )
                            if (trailer) {
                              setMovieKey(trailer.key)
                              setisTrailerOpen(true)
                            } else {
                              alert("Trailer not available!")
                            }
                          }}
                        >
                          <IconPlayerPlayFilled className="w-4 h-4 md:w-5 md:h-5 lg:w-8 lg:h-8" />
                        </button>

                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => addTowatchlist(mov)}
                          className="flex size-7 md:size-10 items-center justify-center rounded-full border border-gray-500 hover:scale-105 transition-all duration-300 cursor-pointer"
                        >
                          <AnimatePresence mode="wait">
                            {isSaved ? (
                              <motion.div
                                key="check"
                                initial={{ opacity: 0, rotateY: 90 }}
                                animate={{ opacity: 1, rotateY: 0 }}
                                exit={{ opacity: 0, rotateY: -90 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                              >
                                <IconCheck className="w-3 h-3 md:w-4 md:h-4 lg:w-7 lg:h-7 text-green-500" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="plus"
                                initial={{ opacity: 0, rotateY: 90 }}
                                animate={{ opacity: 1, rotateY: 0 }}
                                exit={{ opacity: 0, rotateY: -90 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                              >
                                <IconCirclePlus className="w-4 h-4 md:w-5 md:h-5 lg:w-8 lg:h-8" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </div>

                    </div>
                    <div className="flex flex-row justify-between items-center mt-2">
                      <h1 className="text-sm md:text-lg font-bold line-clamp-1">
                        {mov.name}
                      </h1>
                      <p className=" text-green-400 text-sm md:text-lg">
                        ⭐{Number(mov.vote_average).toFixed(1)}
                      </p>
                    </div>
                    <p className="line-clamp-1 lg:line-clamp-3 text-xs text-gray-400">
                      {mov.overview}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        })}
      </div>
      <AnimatePresence>
        {isTrailerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setisTrailerOpen(false)
              setMovieKey("")
            }}
            className=" fixed flex items-center z-999 justify-center inset-0 backdrop-blur-xs bg-black/80">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-[95%] aspect-video max-w-5xl "
            >
              <button
                className="absolute -right-7 -top-7 text-3xl font-bold cursor-pointer"
                onClick={() => setisTrailerOpen(false)}>
                ✕
              </button>

              <iframe src={`https://www.youtube.com/embed/${movieKey}?autoplay=1`}
                title="Trailer"
                className="h-full w-full rounded-xl "
                allow="autoplay">
              </iframe>


            </motion.div>

          </motion.div>

        )}
      </AnimatePresence>
    </div>
  )
}

export default Animation