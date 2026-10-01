import { useState,useEffect} from 'react'
import axios from 'axios';
import './App.css'
import Admin from './components/admin';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import Login from './components/login';




function App() {
 
 

  return (
    
      <Router>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/jozilogin" element={<Login />} />
          <Route path="/admin" element={<Admin />} />



        </Routes>
      </Router>
    
    
 
  )

}

export default App
