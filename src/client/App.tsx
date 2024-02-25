import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './components/LandingPage.js'
import Dashboard from './components/Dashboard.js';
import RegisterPage from './components/RegisterPage.js';

const App: React.FC = () => {
    return (
      <>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/goals" element={<Dashboard/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
        </Routes>
      </>
    );
}

export default App;