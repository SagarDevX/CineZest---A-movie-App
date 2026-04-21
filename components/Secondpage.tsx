import React from 'react'
  import TrendingPage from './TrendingPage'
import PopulerMovie from './Populer-movie'
import KoreanShows from './KoreanShows'
import AnimatedShow from './AnimatedShow'

const Secondpage = () => {
  return (
    <div className=' bg-black pt-8'>
      <TrendingPage/>
      <PopulerMovie/>
      <KoreanShows/>
      <AnimatedShow/>
    </div>
  )
}

export default Secondpage