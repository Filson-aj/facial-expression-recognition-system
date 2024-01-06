import { Routes, Route } from 'react-router-dom'

import useTitle from './hooks/useTitle'
import Layout from './components/Layout/Layout'
import Landing from './components/Landing/Landing'
import StaticDetection from './components/StaticDetection/StaticDetection'
import RealtimeDetection from './components/RealtimeDection/RealtimeDetection'

const App = () =>{
  useTitle('Object Detection and Recognition System')

  return(
    <Routes> {/* routes container */}
      <Route path='/' element={<Layout />}> {/* root route */}
        <Route index element={<Landing />} />
        <Route path='detection/static' element={<StaticDetection />} />
        <Route path='detection/real-time' element={<RealtimeDetection />} />
      </Route>
    </Routes>
  )
}

export default App
