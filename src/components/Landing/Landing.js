import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <div className='bg-gray-200 h-screen text-gray-900'>
      <main className='text-center pt-16'>
        <h1 className='text-4xl font-extrabold mb-4'>Welcome to Object Detection & Recognition</h1>
        <p className='text-lg mb-8'>Empowering systems with advanced object detection and recognition using TensorFlow.js (face-api.js.)</p>
        <Link to='detection/static' className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full text-lg transition duration-300 ease-in-out hover:scale-105'>
          Get Started
        </Link>
      </main>
    </div>
  )
}

export default Landing