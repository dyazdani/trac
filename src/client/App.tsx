import React from 'react'
import { 
  Route, 
  Routes 
} from 'react-router-dom'
import LandingPage from './components/LandingPage.js'
import Dashboard from './components/Dashboard.js';
import RegisterPage from './components/RegisterPage.js';
import LoginPage from './components/LoginPage.js';

const App: React.FC = () => {
    return (
      <>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/goals" element={<Dashboard/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>

        </Routes>
      </>
    );
}

export default App;