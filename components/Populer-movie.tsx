"use client"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import Card from "./card"
import Image from "next/image"
import { IconChevronLeft, IconChevronRight, IconCheck, IconPlayerPlayFilled, IconCirclePlus, IconThumbUp } from "@tabler/icons-react"
import { supabase } from "@/app/lib/supabase"

type Movie = {
  id: string,
  title: string,
  poster_path: string,
  backdrop_path: string,
  overview: string,
  vote_average: number,
}
const PopulerMovie = () => {
  const [watchlist, setWatchlist] = useState<string[]>([])

  const [movie, setMovie] = useState<Movie[]>([])
  const [hoveredMovie, setHoveredMovie] = useState<string | null>(null)

  const [isTrailerOpen, setisTrailerOpen] = useState(false)
  const [trailerKey, settrailerKey] = useState("")

  const rowRef = useRef<HTMLDivElement>(null)
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null)
  const BASE_URL = "https://movie-proxy-omega.vercel.app/api/movies"

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
      movie_title: item.title,
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
        const url = "https://movie-proxy-omega.vercel.app/api/movies?endpoint=movie/top_rated"
        let response = await fetch(url)
        if (!response.ok)
          throw new Error
        const result = await response.json()
        setMovie(result.results.slice(0, 15))
      }
      catch (error) {
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
    <div className="group my-6">
      <div className="px-8 lg:px-16">
        <h1 className="text-2xl md:text-4xl tracking-tight font-semibold text-white">Popular Movies</h1>
      </div>

      <div className="relative">
        <button className="absolute left-0 top-5 z-100 h-42 md:h-54 lg:h-75  md:w-16 rounded-l-lg opacity-0 transition group-hover:opacity-100"
          onClick={() => { scroll("left") }}>
          <IconChevronLeft size={40} className="mx-auto text-white" />
        </button>
        <button className="cursor-pointer absolute right-0 top-5 z-100 h-42 md:h-54 lg:h-75 md:w-16 opacity-0 transition group-hover:opacity-100"
          onClick={() => { scroll("right") }}>
          <IconChevronRight size={40} className="mx-auto text-white" />
        </button>

        <div
          ref={rowRef}
          className="flex flex-row gap-1 md:gap-2 overflow-x-scroll no-scrollbar overflow-y-visible scrollbar-hide scroll-smooth pt-6 pb-2 md:py-7 lg:py-8 px-8 lg:px-16">

          {movie.map((item, idx) => {
            const isSaved = watchlist.includes(item.id)
            return <div
              key={item.id}
              onMouseEnter={() => {
                hoverTimeout.current = setTimeout(() => {
                  setHoveredMovie(item.id)
                }, 500)
              }}
              onMouseLeave={() => {
                if (hoverTimeout.current) {
                  clearTimeout(hoverTimeout.current)
                }
                setHoveredMovie(null)
              }}
              className="relative shrink-0"
            >
              <motion.div className=" w-28 md:w-35 lg:w-50 shrink-0 cursor-pointer">
                <Card src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} height={700} width={600} />
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
                        src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                        alt={item.title}
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
                              const res = await fetch(`${BASE_URL}?endpoint=movie/${item.id}/videos`)
                              const data = await res.json()
                              const trailer = data.results.find(
                                (v: any) => v.type === "Trailer" || v.type === "Teaser" && v.site === "YouTube"
                              )
                              if (trailer) {
                                setisTrailerOpen(true)
                                settrailerKey(trailer.key)
                              } else {
                                alert("Trailer not available!")
                              }
                            }}
                          >
                            <IconPlayerPlayFilled className="w-4 h-4 md:w-5 md:h-5 lg:w-8 lg:h-8" />
                          </button>

                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => addTowatchlist(item)}
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
                          {item.title}
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
          })}
        </div>

      </div>

      <AnimatePresence>
        {isTrailerOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-999 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setisTrailerOpen(false)}
          >
            <motion.div
              className="relative w-[90%] max-w-5xl aspect-video"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  setisTrailerOpen(false)
                  settrailerKey("")
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

export default PopulerMovie