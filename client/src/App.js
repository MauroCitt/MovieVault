import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Enter from './components/Enter.js';
import Profile from './components/Profile.js';
import UserEmail from './components/UserEmail';
import ProtectedRoute from './components/ProtectedRoute.js';
import  { Toaster, toast } from 'sonner';
import Cookies from 'universal-cookie';
import { jwtDecode } from "jwt-decode";
import useAuth from './components/userAuth.js';

const URL = 'http://localhost:4000/'

function App() {
  const cookies = new Cookies();
  const { loggedIn, login, logout } = useAuth();

  let [userEmail, setUserEmail] = useState('')

  const token = JSON.parse(localStorage.getItem('token'));

  const signIn = async (email, magicLink) => {
    try {
      let res = await axios.post(`${URL}login/user`, { email, magicLink });
      if (res.data.token) {
        login(res.data.token);
      }
    } catch (e) {
      alert(e);
    }
  };

  const enterEmail = (e) => {
    setUserEmail(e.target.value)
  }

  const emailSubmit= (e) => {
    e.preventDefault();
    console.log("User email:" + userEmail);
    signIn(userEmail);
    setUserEmail('');
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              !loggedIn ? (
                <UserEmail
                  enterEmail={enterEmail}
                  emailSubmit={emailSubmit}
                  userEmail={userEmail}
                  setUserEmail={setUserEmail}
                />
              ) : (
                <Navigate to="/profile" />
              )
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={loggedIn}>
                <Profile logout={logout}/>
              </ProtectedRoute>
            }
          />
          <Route path="verify/:email/:link" element={<Enter signIn={signIn} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
