import React, { useState, useRef, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as cocoSsd from '@tensorflow-models/coco-ssd'

import Spinner from '../uis/Spinner/Spinner'

const COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']

const StaticDetection = () => {
  const imageInputRef = useRef(null)
  const canvasRef = useRef(null)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [model, setModel] = useState(null)
  const [numofObject, setNumofObject] = useState(0)
  const [categories, setCateogries] = useState([])

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
    const imageInput = imageInputRef.current
    const canvas = canvasRef.current

    if (imageInput.files.length > 0) {
      const imageFile = imageInput.files[0]
      const image = new Image()
      image.src = URL.createObjectURL(imageFile)
      image.onload = async () => {
        const predictions = await model?.detect(image)

        if (canvas) {
          const context = canvas.getContext('2d')
          canvas.width = 600
          canvas.height = 400
          context.drawImage(image, 0, 0)
          context.font = '12px Arial'
          let counter = 0

          setNumofObject(predictions.length)

          predictions?.forEach((prediction) => {
            updateCategory(prediction.class)
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
    }
  }

  const handleImageUpload = () => {
    objectDetection()
  }

  useEffect(() => {
    loadModel()
  }, [])

  return (
    <div className="flex bg-gray-200">
      <aside className="w-1/5 bg-gray-200 px-2 border-t border-b">
        <div className="mb-2">
          <div className="bg-gray-50 rounded shadow">
            <p className="py-2 text-center mt-4 bg-teal-500 text-gray-100">
              Click on the picture area to select an image for detection
            </p>
            <div className="relative px-2 py-4">
              <div className="space-y-4 flex flex-col justify-between">
                
              </div>
            </div>
          </div>
        </div>
        <div className="mb-2">
          <h2 className="text-lg font-bold text-gray-800 text-center">
            Detection Records
          </h2>
          <div className="bg-gray-50 h-64 rounded shadow text-gray-800 items-left">
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
      <section className="w-4/5 p-8 bg-white rounded shadow m-4 text-center relative">
        {!modelLoaded ? <Spinner text={`Loading model...`} /> :
        <div className="flex flex-col px-4 py-2">
            <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={handleImageUpload} />
            <div className="flex items-center justify-center mx-auto px-auto py-2 my-3 relative w-[600px] h-[400px] border border-4 border-dotted boder-gray">
                <canvas ref={canvasRef} className='absolute inset-0'/> 
            </div>
        </div>}
      </section>
    </div>
  )
}

export default StaticDetection