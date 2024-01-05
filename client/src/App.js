import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Enter from './components/auth/Enter.js';
import Profile from './components/Profile.js';
import UserEmail from './components/auth/UserEmail.js';
import ProtectedRoute from './components/auth/ProtectedRoute.js';
import Cookies from 'universal-cookie';
import useAuth from './components/auth/userAuth.js';
import { Toaster, toast } from 'sonner';
import Home from './views/Home.js';


const URL = 'http://localhost:4000/';

function App() {
  const cookies = new Cookies();
  const { loggedIn, login, logout } = useAuth();

  const [userEmail, setUserEmail] = useState('');
  const[userPass, setUserPass] = useState('');
  const [signInMode, setSignInMode] = useState(true);
  const [passwordEditable, setPasswordEditable] = useState(true);

  const toggleMode = () => {
    setSignInMode((prevMode) => !prevMode);
  };

  const token = JSON.parse(localStorage.getItem('token'));
  const email = JSON.parse(localStorage.getItem('email'));

  // ************** Sign in **************
  const signIn = async (email, magicLink, signInMode, userPass) => {
    console.log("email: " + email + " magicLink: " + magicLink + " signInMode: " + signInMode + " userPass: " + userPass);
    if(signInMode){
      console.log("checking pass");
      console.log(email + " " + userPass);
      checkingPass(email, userPass);
    } else {
      console.log("sending email");
    try {
      let res = await axios.post(`${URL}login/user`, { email, magicLink });
      if(res.data.emailSent){
        notify();
      } else if (!res.data.emailSent && !res.data.token){
        notifyError(res.data.message);
      }
      else if (res.data.token) {
        login(res.data.email, res.data.token);
      }
    } catch (e) {
      alert(e);
    }
  };
};

  // Email
  const enterEmail = (e) => {
    setUserEmail(e.target.value);
  };

  const emailSubmit = (e) => {
    e.preventDefault();
    signIn(userEmail);
    setUserEmail('');
  };

  const emailPassSubmit = (e) => {
    e.preventDefault();
    console.log(userPass);
    signIn(userEmail, "", signInMode, userPass);
    setUserEmail('');
    setUserPass('');
  }


  // ************** Sign up **************

    // Password 
    const enterPassword = (e) => {
      setUserPass(e.target.value);
      console.log(userPass);
    };
    
  const passwordSubmit = (e) => {
    e.preventDefault();
    signUp(email, userPass);
    console.log(userPass);
    setUserPass('');
  }

  const signUp = async (email, pass) => {
    try {
      let res = await axios.post(`${URL}profile/register`, { email, pass });
      if(res.data.ok){
        setPasswordEditable(false);
        checkingPass(email, pass);
      }
  } catch(e){
    console.log(e);
  }
};

const checkingPass = async (email, pass) => {
  try{
    let res = await axios.post(`${URL}profile/verify`, {email, pass}, {withCredentials: true});
    console.log(res.data.passwordMatch);
    if(res.data.passwordMatch){
      login(email, res.data.tokenPass);
    } else {
      console.log("Wrong password");
      notifyError("Wrong password");
    }
  } catch(e){
    console.log(e);
  }
}

  const notify = () => toast.success('Email sent!', {
    style: {
      background: 'white',
      padding: '16px',
    },
    className: 'custom-toast',
    duration: 5000,
  });

  const notifyError = (message) => toast.error(message, {
    style: {
      background: 'white',
      padding: '16px',
    },
    className: 'custom-toast',
    duration: 5000,
  });

  return (
    <div className="App">
      <Toaster position="bottom-right" />
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
                  signIn={signIn}
                  signInMode={signInMode}
                  toggleMode={toggleMode}
                  emailPassSubmit={emailPassSubmit}
                  userPass={userPass}
                  enterPassword={enterPassword}
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
                <Profile logout={logout}
                  enterPassword={enterPassword}
                  email={email}
                  userPass={userPass}
                  setUserPass={setUserPass}
                  passwordSubmit={passwordSubmit}
                  passwordEditable={passwordEditable}
                  />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute user={loggedIn}>
                <Home />
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
