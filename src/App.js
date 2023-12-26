import { Routes, Route, BrowserRouter } from "react-router-dom"
import { useState, useEffect } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

// pages
import Login from "./pages/Login/SignUp/Login";
import Inventory from "./pages/Inventory/Inventory";
import Schedule from "./pages/Schedule/Schedule"
import Dashboard from "./pages/Dashboard/Dashboard";
import SignUp from "./pages/Login/SignUp/SignUp";
import User from './pages/UserManagement';
import UserDetails from "./pages/UserManagement/userDetails";
import Comment from "./pages/Dashboard/Comment"
import SetGeo from "./pages/SetGeofencing/SetGeo"
import CheckScoot from "./pages/CheckScooter/CheckScooter"

function App() {
  const [token, setToken] = useState(false)

  if (token) {
    sessionStorage.setItem('token', JSON.stringify(token))
  }

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      let data = JSON.parse(sessionStorage.getItem('token'))
      setToken(data)
    }

  }, [])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter basename="/deploy">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Login setToken={setToken} />} />
          <Route path="/dashboard" element={<Dashboard token={token} />} />
          <Route path="/inventory" element={<Inventory token={token} />} />
          <Route path="/schedule" element={<Schedule token={token} />} />
          <Route path='/user' element={<User token={token} />} />
          <Route path='/userDetails/:id' Component={UserDetails} />
          <Route path='/comment' element={<Comment token={token} />} />
          <Route path='/setgeo' element={<SetGeo token={token} />} />
          <Route path='/checkscoot' element={<CheckScoot token={token} />} />


        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
