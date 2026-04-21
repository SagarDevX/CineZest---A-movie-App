'use client';
import { motion, useMotionTemplate, useTransform } from "motion/react"
import Image from 'next/image'
import Link from 'next/link'
import { useScroll } from "motion/react";
import { useRef } from "react";

const Navbar = () => {
  const preventRefresh = (e: React.SubmitEvent) => {
    e.preventDefault()
  }
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    
  })

  const blur = useTransform(scrollYProgress, [0, 0.1], [0, 20])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{ backdropFilter:useMotionTemplate`blur(${blur}px)` }}
      className="fixed top-0 left-0 w-full h-20 flex justify-between items-center md:px-16 text-2xl z-50 bg-transparent backdrop-blur-sm">

      <div>
        <Image
          src="/logo.png"
          alt="Logo"
          width={100}
          height={1000} />
      </div>
      <div >
        <form className='flex flex-row gap-2' onSubmit={preventRefresh}>
          <input type="text" className='border border-neutral-500 rounded-xl outline-none focus:ring-1 focus:ring-gray-500 focus:scale-102 p-1 transition-all duration-300 md:w-100 placeholder:text-neutral-500 ' placeholder='Search for Movie,Shows etc' />
          <button className="text-2xl">Search</button>
        </form>
      </div>
      <div className="flex flex-row gap-16 items-center">

        <div className='flex flex-row gap-4 md:gap-6 '>
          <Link href="/" className='rounded-4xl hover:bg-neutral-700 px-4 py-2 transition-all duration-300'>Home</Link>
          <Link href="/categories" className='rounded-4xl hover:bg-neutral-700 px-4 py-2 transition-all duration-300'>Categories</Link>
        </div>
      </div>


    </motion.div>
  )
}

export default Navbar