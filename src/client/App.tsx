import React from 'react'
import { 
  Route, 
  Routes 
} from 'react-router-dom'
import Dashboard from './components/Dashboard.js';
import HomePage from './components/HomePage.js';
import Register from './components/Register.js';
import Login from './components/Login.js';
import rainbowConsoleLogStyles from './constants/rainbowConsoleLogStyles.js'

const App: React.FC = () => {
  console.log("%c Hi! I'm Dara Yazdani", rainbowConsoleLogStyles)  
  console.log("Thanks for checking out Trac! Find my other projects at https://www.darayazdani.com. Feel free to reach out or connect: https://www.linkedin.com/in/darayazdani. Cheers!") 

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