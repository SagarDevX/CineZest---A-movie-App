import React from 'react'
  import TrendingPage from './TrendingPage'
import PopulerMovie from './Populer-movie'
import KoreanShows from './KoreanShows'
import AnimatedShow from './AnimatedShow'

const Secondpage = () => {
  return (
    <div className=' bg-black pt-20 md:pt-10 lg:pt-2  '>
      <TrendingPage/>
      <PopulerMovie/>
      <KoreanShows/>
      <AnimatedShow/>
    </div>
  )
}

export default Secondpage