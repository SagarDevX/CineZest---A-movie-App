"use client"
import Link from 'next/link'

const items = [
    { name: "Action", href: "/category/action" },
    { name: "Animation", href: "/category/animation" },
    { name: "Crime", href: "/category/crime" },
    { name: "Reality", href: "/category/reality" },
    { name: "Drama", href: "/category/drama" },
    { name: "Sci-fi", href: "/category/sci-fi" }
  ];

const page = () => {
  return (
    <div className='mt-24 px-16'>
        <h1 className='text-2xl font-semibold'>Categories</h1>
        <div className='flex flex-col gap-2 mt-2 text-xl'>
            {items.map((item, i) => (
                
                      <Link href={item.href} key={i} className="hover:text-neutral-200">
                        {item.name}
                      </Link>
                  ))}
        </div>
    </div>
  )
}

export default page