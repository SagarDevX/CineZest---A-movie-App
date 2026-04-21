import Image from 'next/image'

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number
}

const Card = ({ src, alt, width, height }: Props) => {
  return (
    <div>
      <div className='relative  rounded-xl overflow-hidden shrink-0'>
        <div >
          <Image src={src}
            alt={alt}
            width={width}
            height={height}
            className='object-cover object-center '
          />
        </div>
       
      </div>
    </div>
  )
}

export default Card