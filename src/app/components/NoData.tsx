import Image from 'next/image'
import React from 'react'

interface NoDataProps{
    message : string
    imageUrl: string
    description: string
    onClick: () => void
    buttonText: string

}

const NoData: React.FC<NoDataProps> = ({ message, imageUrl, description, onClick, buttonText = "Try Again" }) => {
  return (
    <div className='flex flex-col items-center justify-center p-6 bg-white overflow-x-hidden space-y-6 mx-auto'>
        <div className="relative w-60 md:w-60">
            <Image
                src={imageUrl}
                alt={message}
                width={320}
                height={320}
                className='shadow-md hover:shadow-lg transition duration-300'
            />
        </div>

        <div className='text-center max-w-md space-y-2'>
            <h2 className='text-xl font-semibold text-gray-800'>{message}</h2>
            <p className='text-gray-600 leading-relaxed'>{description}</p>
        </div> 

        {
            onClick && (
                <button
                onClick={onClick}
                className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200'>
                    {buttonText}
                </button>
            )
        }   
    </div>
  )
}

export default NoData
