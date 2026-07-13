"use client"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import Card from "./card"
import Image from "next/image"
import { IconChevronLeft, IconChevronRight, IconChevronDown, IconPlayerPlayFilled, IconCirclePlus, IconThumbUp } from "@tabler/icons-react"
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
  const [movie, setMovie] = useState<Movie[]>([])
  const [hoveredMovie, setHoveredMovie] = useState<string | null>(null)

  const [movieKey, setMovieKey] = useState("")
  const [isTrailerOpen, setisTrailerOpen] = useState(false)

  const rowRef = useRef<HTMLDivElement>(null)
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null)
  const BASE_URL = "https://movie-proxy-omega.vercel.app/api/movies"

  const addTowatchlist = async (item: Movie) => {
    const { data: { user } } = await supabase.auth.getUser()

    if(!user) {
      alert("Please LogIn first");
      return
    }

    const {error} = await supabase.from("watchlist").insert(
      { user_id: user.id,
      movie_id: item.id,
      movie_title: item.title,
      poster_path: item.poster_path}
    )

    if(error){console.error(error)
      alert("failed to add movie")
    }
    else("Added to Watchlist")
  }

  useEffect(() => {
    const DataFetch = async () => {
      try {
        const url = "https://movie-proxy-omega.vercel.app/api/movies?endpoint=trending/movie/week"
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
    <div className="group mt-8">
      <div className="px-8  lg:px-16">
        <h1 className="text-2xl md:text-4xl tracking-tight font-semibold text-white">Trending this week</h1>
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

          {movie.map((item, idx) => (
            <div
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
                                setMovieKey(trailer.key)
                                setisTrailerOpen(true)
                              } else {
                                alert("Trailer not available!")
                              }
                            }}
                          >
                            <IconPlayerPlayFilled className="w-4 h-4 md:w-5 md:h-5 lg:w-8 lg:h-8" />
                          </button>

                          <button
                            className=" flex size-7 md:size-10 items-center justify-center rounded-full border border-gray-500  hover:scale-105 transition-all duration-300 cursor-pointer"
                          >
                            <IconThumbUp className="w-4 h-4 md:w-5 md:h-5 lg:w-8 lg:h-8" />
                          </button>
                        </div>

                        <button onClick={() => addTowatchlist(item)}
                          className=" flex size-7 md:size-10 items-center justify-center rounded-full border border-gray-500  hover:scale-105 transition-all duration-300 cursor-pointer">
                          <IconCirclePlus className="w-4 h-4 md:w-5 md:h-5 lg:w-8 lg:h-8" />                       
                        </button>
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
          ))}
        </div>
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

export default PopulerMovie