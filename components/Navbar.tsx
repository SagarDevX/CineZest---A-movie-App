'use client';
import { motion, useMotionTemplate, useTransform, AnimatePresence } from "motion/react"
import Image from 'next/image'
import Link from 'next/link'
import { useScroll } from "motion/react";
import { useRef, useState } from "react";
import { IconMenu2 , IconX  } from "@tabler/icons-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const preventRefresh = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const { scrollYProgress } = useScroll()
  const blur = useTransform(scrollYProgress, [0, 0.1], [0, 20])

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        style={{ backdropFilter: useMotionTemplate`blur(${blur}px)` }}
        className="fixed top-0 left-0 w-full h-20 flex justify-between 
        items-center px-4 md:px-16 text-2xl z-50 bg-transparent backdrop-blur-sm">

        {/* Logo */}
        <div>
          <Image
            src="/logo.png"
            alt="Logo"
            width={100}
            height={1000} />
        </div>

        {/* Search — hidden on mobile */}
        <div className="hidden md:block">
          <form className='flex flex-row gap-2' onSubmit={preventRefresh}>
            <input
              type="text"
              className='border border-neutral-500 rounded-xl outline-none 
              focus:ring-1 focus:ring-gray-500 focus:scale-102 p-1 
              transition-all duration-300 md:w-100 placeholder:text-neutral-500'
              placeholder='Search for Movie,Shows etc' />
            <button className="text-2xl">Search</button>
          </form>
        </div>

        {/* Desktop Links — hidden on mobile */}
        <div className="hidden md:flex flex-row gap-16 items-center">
          <div className='flex flex-row gap-4 md:gap-6'>
            <Link href="/" className='rounded-4xl hover:bg-neutral-700 
            px-4 py-2 transition-all duration-300'>Home</Link>
            <Link href="/categories" className='rounded-4xl hover:bg-neutral-700 
            px-4 py-2 transition-all duration-300'>Categories</Link>
          </div>
        </div>

        {/* Hamburger — only on mobile */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <IconX  size={28} /> : <IconMenu2  size={28} />}
        </button>

      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 w-full bg-black/90 backdrop-blur-md 
            z-40 flex flex-col px-6 py-6  md:hidden">

            {/* Mobile Search */}
            <form className='flex flex-row gap-2' onSubmit={preventRefresh}>
              <input
                type="text"
                className='w-full border border-neutral-500 rounded-xl 
                outline-none focus:ring-1 focus:ring-gray-500 p-2 
                placeholder:text-neutral-500 bg-transparent text-base'
                placeholder='Search for Movie,Shows etc' />
              <button className="text-base text-white">Search</button>
            </form>

            {/* Mobile Links */}
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className='text-white text-lg hover:bg-neutral-700 
              px-4 py-2 rounded-xl transition-all duration-300'>
              Home
            </Link>
            <Link
              href="/categories"
              onClick={() => setIsOpen(false)}
              className='text-white text-lg hover:bg-neutral-700 
              px-4 py-2 rounded-xl transition-all duration-300'>
              Categories
            </Link>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar