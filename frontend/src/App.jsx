

import React from 'react'
import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { Signup } from './signup'
import {Signin} from './signin'
import { Dashboard } from './dashboard'
import { Send } from './send'

function App() {
  return (
<BrowserRouter>
<Routes>
  <Route path='/signup' element={<Signup />} />
  <Route path='/signin' element={<Signin />} />
  <Route path='/dashboard' element={<Dashboard />}/>
  <Route path='/send' element={<Send />} />
</Routes>
</BrowserRouter>
  )
}

export default App

