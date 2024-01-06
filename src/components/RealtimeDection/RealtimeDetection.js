import React, { useState, useRef, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as cocoSsd from '@tensorflow-models/coco-ssd'

import Spinner from '../uis/Spinner/Spinner'

const COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']

const RealtimeObjectDetection = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [videoStarted, setVideoStarted] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [categories, setCateogries] = useState([])
  const [numofObject, setNumofObject] = useState(0)
  const [model, setModel] = useState(null)

  let detectionInterval

  const loadModel = async () => {
    await tf.ready() // Ensure TensorFlow.js is ready
    await tf.setBackend('webgl')
    const loadedModel = await cocoSsd.load()
    setModelLoaded(true)
    setModel(loadedModel)
  }

  const updateCategory = newCategory =>{
    const categoryIndex = categories.findIndex(categoryObj => categoryObj.category === newCategory)
  
    if (categoryIndex === -1) {
      // If the category doesn't exist, add a new object with num set to 1
      setCateogries([
        ...categories,
        {category: newCategory, num: 1}
      ])
    } else {
      // If the category exists, increment the num by 1
        console.log('hello sir')
      const cat = [...categories]
      cat[categoryIndex].num = cat[categoryIndex] + 1
      setCateogries(cat)
    }
  }

  const objectDetection = async () => {
    if (videoRef.current && modelLoaded) {
      const videoEl = videoRef.current
      
      const runObjectDetection = async () => {
        const predictions = await model?.detect(videoEl)
    
        if (canvasRef.current) {
          const context = canvasRef.current.getContext('2d')
          context.clearRect(0, 0, videoEl.width, videoEl.height)
          context.font = '12px Arial'

          let counter = 0
    
          predictions?.forEach((prediction) => {
            updateCategory(prediction.class)
            // Get the coordinates of the bounding box
            const [x, y, width, height] = prediction.bbox

            context.beginPath()
            context.rect(x, y, width, height)
            context.lineWidth = 2
            context.strokeStyle = COLORS[counter]
            context.fillStyle = COLORS[counter]
            context.stroke()
            context.fillText(
              `${prediction.class} (${Math.round((prediction.score.toFixed(3)) * 100)}%)`,
              x,
              y > 10 ? y - 5 : 10
            )
            counter++
          })
        }
      }
  
      // Call object detection repeatedly
      detectionInterval = setInterval(runObjectDetection, 5000)
    }
  }
    

  const startVideo = async () => {
    try {
      if(model && modelLoaded){
        setVideoStarted(true)
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        videoRef.current.srcObject = stream

        videoRef.current.onloadedmetadata = async() => {
            objectDetection()
        }
      }
      
    } catch (error) {
      console.error('Error accessing webcam:', error)
    }
  }

  const stopVideo = async () => {
    const videoEl = videoRef.current
    if (detectionInterval) {
        clearInterval(detectionInterval);
    }
    if (videoEl && videoEl.srcObject) {
      const stream = videoEl.srcObject
      const tracks = stream.getTracks()
  
      tracks.forEach((track) => {
        track.stop()
      })
  
      videoEl.srcObject = null
      setVideoStarted(false)
  
      if (model) {
        await model?.dispose() // Dispose of the model
        setModel(null) // Set the model to null to prevent further use
      }
      // Dispose of the TensorFlow.js backend context
      await tf.setBackend('cpu')
    }
  }
  useEffect(() => { 
    loadModel() 
  }, [])

  return (
    <article className='flex bg-gray-200'>
        <aside className='w-1/5 bg-gray-200 px-2 border-t border-b'>
            <div className='mb-2'>
            <div className='bg-gray-50 rounded shadow'>
                <p className='py-2 text-center mt-4 bg-teal-500 text-gray-100'>
                    Click on the picture area to select an image for detection
                </p>
                <div className='relative px-2 py-4'>
                    <div className='space-y-4 flex flex-col justify-between'>
                        <button
                        className={`px-4 py-2 rounded bg-blue-500 text-white ${
                            videoStarted
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                        disabled={videoStarted}
                        onClick={startVideo}
                        >
                        Start Video
                        </button>
                        <button
                        className={`px-4 py-2 rounded bg-red-500 text-white ${
                            !videoStarted
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                        disabled={!videoStarted}
                        onClick={stopVideo}
                        >
                        Stop Video
                        </button>
                    </div>
                </div>
            </div>
            </div>

            <div className='mb-2'>
                <h2 className='text-lg font-bold text-gray-800 text-center'>
                    Detection Records
                </h2>
                <div className='bg-gray-50 h-64 rounded shadow text-gray-800 items-left'>
                  <div className="p-4 border-b border-gray-200">
                    <strong>Number of Objects:</strong> <span>{numofObject}</span>
                  </div>
                  {categories.map((category, index) =>(
                      <div className="p-4 border-b border-gray-200" key={index}>
                          <strong>{category.category}:</strong> <span>{category.num}</span>
                      </div>
                  ))}
                </div>
            </div>
        </aside>
        <section className='w-4/5 p-8 bg-white rounded shadow m-4 text-center relative'>
            {!modelLoaded ? <Spinner text={`Loading model...`} /> : <div className="relative">
                <video ref={videoRef} autoPlay muted width={640} height={480}></video>
                <canvas ref={canvasRef} className='absolute inset-0' width={640} height={480} />
            </div>}
        </section>

    </article>
  )
}

export default RealtimeObjectDetection