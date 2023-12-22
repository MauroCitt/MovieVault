import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import axios from 'axios';
import Enter from './components/Enter.js';
import Profile from './components/Profile.js';
import UserEmail from './components/UserEmail';
import toast, { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute.js';

const URL = 'http://localhost:4000/'

function App() {

  let [loggedIn, setLoggedIn] = useState(false)
  let [userEmail, setUserEmail] = useState('')
  let [Profile, setProfile] = useState('');

  const token = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    const verify_token = async() => {
      if (token == null) return setLoggedIn(false);
      try{
        axios.defaults.headers.common['Authorization'] = token;
        const response = await axios.post(`${URL}verify`);
        return login(token) 
      } catch(error){
        console.error("Error en el verify: " + error);
      }
    };
    verify_token();
  }, []);

  const login = (token) => {
    localStorage.setItem('token', JSON.stringify(token));
    localStorage.setItem('email', JSON.stringify(userEmail));
    setLoggedIn(true);
  };

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = localStorage.getItem('email');
  
    fetch('/perfil/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: this.state.userPassword,
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  return (
    <div className="App">
    <Router>
    <Routes>
    <Route path="/" 
    element= {<UserEmail 
    enterEmail={enterEmail} 
    emailSubmit={emailSubmit} 
    userEmail={userEmail} 
    setUserEmail={setUserEmail} />}
    />
    <Route
    path="/profile"
    element={
      <Profile/>}
    />
    <Route
    path="verify/:email/:link"
    element={<Enter signIn={signIn} />}
    />
    </Routes>
    </Router>
    </div>
    );
  }

export default App;
