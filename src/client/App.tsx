import React from 'react'
import { 
  Route, 
  Routes 
} from 'react-router-dom'
import Dashboard from './components/Dashboard.js';
import RegisterPage from './components/RegisterPage.js';
import LoginPage from './components/LoginPage.js';
import HomePage from './components/HomePage.js';

const App: React.FC = () => {

    return (
      <>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/goals" element={<Dashboard/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
        </Routes>
      </>
    );
}

export default App;