import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className='bg-blue-500 p-4'>
      <nav className='flex items-center justify-between'>
        <Link to='/' className='text-white font-bold text-lg hover:text-gray-200'>
            Object Detection & Recognition
        </Link>
        <div className='space-x-4'>
          <Link to='detection/static' className='text-white hover:text-gray-200'>
            Static Detection
          </Link>
          <Link to='detection/real-time' className='text-white hover:text-gray-200'>
            Real Time Detection
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Header