import React from 'react'
import { 
  Route, 
  Routes 
} from 'react-router-dom'
import Dashboard from './components/Dashboard.js';
import HomePage from './components/HomePage.js';
import Register from './components/Register.js';
import Login from './components/Login.js';

const App: React.FC = () => {
  // Saying hi to developers checking out my app :-)
  console.log("Hi, I’m Dara. Thanks for checking out Trac. Cheers!")
    

  return (
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="goals" element={<Dashboard/>}/>
      <Route path="register" element={<Register/>}/>
      <Route path="login" element={<Login/>}/>
    </Routes>
  )

}

export default App;