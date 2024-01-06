import React from 'react'

import './Spinner.css'

const Spinner = ({ text }) => {
  return (
    <div className='fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 z-50'>
      <span className='loader' aria-hidden='true'></span>
      <div className='text-white text-lg text-center mt-4'>{text}</div>
    </div>
  )
}

export default Spinner