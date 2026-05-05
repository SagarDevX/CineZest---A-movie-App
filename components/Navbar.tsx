'use client';
import { motion, useMotionTemplate, useTransform, AnimatePresence } from "motion/react"
import Image from 'next/image'
import Link from 'next/link'
import { useScroll } from "motion/react";
import { useState } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [catOpen, SetcatOpen] = useState(false)

  const preventRefresh = (e: React.SubmitEvent) => {
    e.preventDefault()
  }

  const { scrollYProgress } = useScroll()
  const blur = useTransform(scrollYProgress, [0, 0.1], [0, 20])

 const items = [
   { name: "Action", href: "/category/action" },
  { name: "Animation", href: "/category/animation" },
  { name: "Crime", href: "/category/crime" },
  { name: "Documentary", href: "/category/documentry" },
  { name: "Drama", href: "/category/drama" },
  { name: "Sci-fi", href: "/category/sci-fi" }
];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        style={{ backdropFilter: useMotionTemplate`blur(${blur}px)` }}
        className="fixed top-0 left-0 w-full h-20 flex justify-between 
        items-center px-4 md:px-16 text-2xl z-50 bg-transparent backdrop-blur-sm">
        <div>
          <Image
            src="/logo.png"
            alt="Logo"
            width={100}
            height={1000} />
        </div>

        <div className="">
          <form className='flex flex-row justify-center gap-2 ' onSubmit={preventRefresh}>
            <input
              type="text"
              className='border border-white rounded-xl outline-none 
              focus:ring-1 focus:ring-white focus:scale-102 p-1 
              transition-all duration-300 w-72 lg:w-120 text-base lg:text-2xl placeholder:text-neutral-500 active:text-white'
              placeholder='Search' />

          </form>
        </div>

        <div className="hidden lg:flex flex-row gap-16 items-center">
          <div className='flex flex-row gap-4 md:gap-6'>
            <Link href="/" className='rounded-4xl hover:underline px-4 py-2 transition-all duration-300'>Home</Link>
            <div className="relative rounded-4xl  hover:underline px-4 py-2 transition-all duration-300 cursor-pointer"
              onMouseEnter={() => SetcatOpen(true)}
              onMouseLeave={() => SetcatOpen(false)}>
              <div>Categories</div>
              {catOpen && (
                <div
                  className="absolute top-full left-0 flex flex-col gap-2 justify-center px-3 py-2 rounded-xl text-neutral-400 text-xl bg-black backdrop-blur-md border border-white/20 shadow-lg">
                  {items.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link href={item.href} className="hover:text-neutral-200">
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          className="lg:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <IconX size={28} /> : <IconMenu2 size={28} />}
        </button>

      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 w-full bg-black/90 backdrop-blur-md 
            z-40 flex flex-col px-6 py-6  lg:hidden">


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