import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";


const URL = "http://localhost:4000/";

export default function useAuth() {
  const cookies = new Cookies();
  const [loggedIn, setLoggedIn] = useState(false);

  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    const verify_token = async () => {
      if (token === null) return setLoggedIn(false);
      try {
        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.post(`${URL}verify`, {}, {withCredentials: true});
        if (response.data.ok) {
          setLoggedIn(true);
        } else {
          console.log("Invalid token");
          localStorage.removeItem("token");
          setLoggedIn(false);
        }
      } catch (error) {
        console.log(error);
        localStorage.removeItem("token");
        setLoggedIn(false);
      }
    };
    verify_token();
  }, []);

  const login = (email, token) => {
    localStorage.setItem("token", JSON.stringify(token));
    localStorage.setItem("email", JSON.stringify(email));
    console.log("this is the userAuth " + token + " " + email);
    setLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setLoggedIn(false);
    axios.post(`${URL}logout`, {}, {withCredentials: true});
    localStorage.removeItem('image');
    console.log('Logged out');
  }

  return { loggedIn, login, logout };
}