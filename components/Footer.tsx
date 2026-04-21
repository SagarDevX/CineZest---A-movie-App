import { IconBrandFacebook, IconBrandInstagram, IconBrandX, IconBrandYoutube } from '@tabler/icons-react';
const Footer = () => {
    return (
        <footer className='flex flex-row  h-80 items-center text-xl pt-12  bg-linear-to-b text-white from-black to-cyan-900'>
            <div className='grid grid-cols-2 w-full  md:grid-cols-4 gap-10  md:gap-12 mx-auto  '>
                <div className='select-none text-3xl md:text-4xl lg:text-5xl text-center '>
                    <h1 className=' font-semibold'>CineZest</h1>
                    <h1 className='text-base md:text-2xl'>© All Right Reserves</h1>
                </div>
                <div className='flex flex-col gap-2 opacity-80 text-center md:text-left'>
                    <h1>Company</h1>
                    <div className='flex flex-col text-base text-gray-400'>
                        <p className='hover:underline cursor-pointer hover:text-gray-200'>- About Us</p>
                        <p className='hover:underline cursor-pointer hover:text-gray-200'>- FAQ</p>
                        <p className='hover:underline cursor-pointer hover:text-gray-200'>- Help</p>
                    </div>
                </div>
                <div className='flex flex-col gap-2 opacity-80 text-center md:text-left'>
                    <h1>Legal</h1>
                    <div className='flex flex-col text-base text-gray-400'>
                        <p className='hover:underline cursor-pointer hover:text-gray-200'>- Privacy Policy</p>
                        <p className='hover:underline cursor-pointer hover:text-gray-200'>- Terms of Services</p>
                        <p className='hover:underline cursor-pointer hover:text-gray-200'>- Cookie Policy</p>
                    </div>
                </div>
                <div className='flex flex-col gap-2 opacity-80 items-center md:items-start '>
                    <h1>Connect with Us</h1>
                    <div className='grid grid-cols-2 w-32  gap-0 md:grid-cols-4 md:gap-2 text-4xl'>
                        <IconBrandFacebook stroke={1} className='hover:bg-[#0866FF] size-8 rounded transition-all duration-200' />
                        <IconBrandInstagram stroke={1} className='hover:bg-[#C13584] size-8 rounded transition-all duration-200' />
                        <IconBrandX stroke={1} className='hover:bg-[#4c484d] size-8 rounded transition-all duration-200' />
                        <IconBrandYoutube stroke={1} className='hover:bg-[#ff0814]  size-8 rounded transition-all duration-200' />
                    </div>
                </div>
            </div>

        </footer>
    )
}
export default Footer