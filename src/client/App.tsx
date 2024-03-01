import React from 'react'
import { 
  Route, 
  Routes 
} from 'react-router-dom'
import Dashboard from './components/Dashboard.js';
import RegisterPage from './components/RegisterPage.js';
import HomePage from './components/HomePage.js';
import Login from './utils/Login.js';

const App: React.FC = () => {

    return (
      <>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/goals" element={<Dashboard/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
      </>
    );
}

export default App;