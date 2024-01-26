import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Enter from './components/auth/Enter.js';
import Profile from './components/profile/Profile.jsx';
import UserEmail from './components/auth/UserEmail.js';
import ProtectedRoute from './components/auth/ProtectedRoute.js';
import Cookies from 'universal-cookie';
import useAuth from './components/auth/userAuth.js';
import { Toaster, toast } from 'sonner';
import Home from './views/Home.js';
import RecoverPass from './components/passRecovery/RecoverPass.jsx';
import OTPInput from './components/passRecovery/OTPInput.jsx';
import RecoverPassForm from './components/passRecovery/RecoverPassForm.jsx';

const URL = 'http://localhost:4000/';

function App() {
  const cookies = new Cookies();
  const { loggedIn, login, logout } = useAuth();

  const [userEmail, setUserEmail] = useState('');
  const[userPass, setUserPass] = useState('');
  const[user, setUser] = useState(''); 
  const[userPassConfirmation, setUserPassConfirmation] = useState('');
  const [signInMode, setSignInMode] = useState(true);
  const [passwordEditable, setPasswordEditable] = useState(true);
  const [validOTP, setValidOTP] = useState(false);

  const toggleMode = () => {
    setSignInMode((prevMode) => !prevMode);
  };

  const email = JSON.parse(localStorage.getItem('email'));
  const OTP = JSON.parse(localStorage.getItem('OTP'));

  // ************** Sign in **************
  const signIn = async (email, magicLink, signInMode, userPass) => {
    if(signInMode){
      checkingPass(email, userPass);
    } else {
    try {
      let res = await axios.post(`${URL}login/user`, { email, magicLink });
      if(res.data.emailSent){
        notify(res.data.message);
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
    signIn(userEmail, "", signInMode, userPass);
    setUserEmail('');
    setUserPass('');
  }

// User
const enterUser = (e) => {
  setUser(e.target.value);
}

// ************** Sign up **************

  // Password 
  const enterPassword = (e) => {
    setUserPass(e.target.value);
  };

  const passwordSubmit = (e) => {
    e.preventDefault();
    signUp(email, userPass, user);
    setUserPass('');
    setUser('');
  }

  const enterPasswordConfirmation = (e) => {
    setUserPassConfirmation(e.target.value);
  };

  const signUp = async (email, pass, username) => {
    try {
      let res = await axios.post(`${URL}profile/register`, { email, pass, username });
      if(res.data.ok){
        setPasswordEditable(false);
        checkingPass(email, pass);
      } else {
        notifyError(res.data.message);
      }
  } catch(e){
    console.log(e);
  }
};

const checkingPass = async (email, pass) => {
  try{
    let res = await axios.post(`${URL}profile/verify`, {email, pass}, {withCredentials: true});

    if(res.data.passwordMatch){
      login(email, res.data.tokenPass);
    } else {
      notifyError(res.data.message);
    }
  } catch(e){
    console.log(e);
  }
}

// ************** Password recovery **************

const passwordResetSending = (e) => {
  e.preventDefault();
  let emailP = localStorage.getItem('email');
  passwordReset(emailP, userPass, userPassConfirmation);
  setUserPass('');
  setUserPassConfirmation('');
}

const passwordReset = async (email, userPass, userPassRecovery) => {
  try{
    let res = await axios.post(`${URL}profile/passwordReset`, {email, userPass, userPassRecovery}, {withCredentials: true});
    if(res.data.ok){
      notify(res.data.message);
      navigateToLogin();
    } else {
      notifyError(res.data.message);
    }
  } catch(e){
    console.log(e);
  }
}

//Recovering password
const passwordRecoveringSent = (e) => {
  e.preventDefault();
  recoverPassword(userEmail);
  localStorage.setItem('email', JSON.stringify(userEmail));
  setUserEmail('');
}

const recoverPassword = async (email) => {
  try {
    let res = await axios.post(`${URL}recoverPassword`, { email });
    if(!res.data.ok){
      notifyError(res.data.message);
    } else {
      localStorage.setItem('OTP', res.data.OTP);
      navigateToOPTInput();
    }
  } catch(e){
    console.log(e);
  }
}

  // ************** Toast **************
  const notify = (message) => toast.success(message, {
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

  // ************** Navigation **************
  const navigateToOPT = () => {
    window.location.href = '/recoverPassword';
  }

  const navigateToLogin = () => {
    window.location.href = '/login';
  }
  const navigateToPasswordReset = () => {
    window.location.href = '/passwordReset';
  }

  const navigateToOPTInput = () => {
    window.location.href = '/recoverPassword/validateOTP';
  }

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
                  navigateToOPT={navigateToOPT}
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
                    user={user}
                    enterUser={enterUser}
                    />
                </ProtectedRoute>

              }
            />
          <Route
            path="/home"
            element={
                <Home />
            }
          />
          <Route path="verify/:email/:link" element={<Enter signIn={signIn} />} />
          <Route path='/recoverPassword' element={
            <RecoverPass navigateToLogin={navigateToLogin} passwordRecoveringSent={passwordRecoveringSent} userEmail={userEmail} enterEmail={enterEmail} /> 
          }/>
          <Route path="/recoverPassword/validateOTP"
            element={
              <OTPInput
                OTP={OTP}
                validOTP={validOTP} 
                setValidOTP={setValidOTP}
                userEmail={userEmail} 
                navigateToPasswordReset={navigateToPasswordReset}
              />
            }
          />
            <Route path='/passwordReset' element={<RecoverPassForm userPass={userPass} enterPassword={enterPassword} userPassConfirmation={userPassConfirmation} enterPasswordConfirmation={enterPasswordConfirmation} passwordResetSending={passwordResetSending}/>}/>
          <Route path="/" element={loggedIn ? <Navigate to="/home" /> : <Navigate to="/login"/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;