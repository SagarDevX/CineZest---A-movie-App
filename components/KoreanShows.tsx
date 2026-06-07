"use client"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import Card from "./card"
import Image from "next/image"
import { IconChevronLeft, IconChevronRight, IconChevronDown, IconPlayerPlayFilled, IconCirclePlus, IconThumbUp } from "@tabler/icons-react"

type Movie = {
  id: string,
  name: string,
  poster_path: string,
  backdrop_path: string,
  overview: string,
  vote_average: number,
}
const PopulerMovie = () => {
  const [movie, setMovie] = useState<Movie[]>([])
  const [hoveredMovie, setHoveredMovie] = useState<string | null>(null)

  const rowRef = useRef<HTMLDivElement>(null)
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null)
  const BASE_URL = "https://movie-proxy-omega.vercel.app/api/movies"

  useEffect(() => {
    const DataFetch = async () => {
      try {
        const url ="https://movie-proxy-omega.vercel.app/api/movies?endpoint=discover/tv&with_original_language=ko&sort_by=popularity.desc"
        let response = await fetch(url)
        if (!response.ok)
          throw new Error
        const result = await response.json()
        setMovie(result.results.slice(0, 10))
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
    <div className="group">
      <div className="px-8 lg:px-16">
        <h1 className="text-2xl md:text-4xl tracking-tight font-semibold text-white">Korean Shows</h1>
      </div>

      <div className="relative">
        <button className="absolute left-0 top-5 z-100 h-42 md:h-54 lg:h-75  md:w-16 rounded-l-lg opacity-0 transition group-hover:opacity-100"
          onClick={() => { scroll("left") }}>
          <IconChevronLeft size={40} className="mx-auto text-white"/>
        </button>
        <button className="cursor-pointer absolute right-0 top-5 z-100 h-42 md:h-54 lg:h-75 md:w-16 opacity-0 transition group-hover:opacity-100"
          onClick={() => { scroll("right") }}>
          <IconChevronRight size={40} className="mx-auto text-white"/>
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
                <Card src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.name} height={2000} width={600} />
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
                              const res = await fetch(`${BASE_URL}?endpoint=movie/${item.id}/videos`)
                              const data = await res.json()
                              const trailer = data.results.find(
                                (v: any) => v.type === "Trailer" && v.site === "YouTube"
                              )
                              if (trailer) {
                                window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_self")
                              } else {
                                alert("Trailer not available!")
                              }
                            }}
                          >
                            <IconPlayerPlayFilled className="w-4 h-4 md:w-5 md:h-5 lg:w-8 lg:h-8"/>
                          </button>

                          <button
                            className=" flex size-7 md:size-10 items-center justify-center rounded-full border border-gray-500  hover:scale-105 transition-all duration-300 cursor-pointer"
                          >
                            <IconThumbUp className="w-4 h-4 md:w-5 md:h-5 lg:w-8 lg:h-8" />
                          </button>
                        </div>

                        <button
                          className=" flex size-7 md:size-10 items-center justify-center rounded-full border border-gray-500  hover:scale-105 transition-all duration-300 cursor-pointer">
                          <IconCirclePlus className="w-4 h-4 md:w-5 md:h-5 lg:w-8 lg:h-8" />
                        </button>
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
    </div>
  )
}

export default PopulerMovie