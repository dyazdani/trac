import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './components/LandingPage.js';
import Dashboard from './components/Dashboard.js';

const App: React.FC = () => {
    return (
      <>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/goals" element={<Dashboard/>}/>
        </Routes>
      </>
    );
}

export default App;