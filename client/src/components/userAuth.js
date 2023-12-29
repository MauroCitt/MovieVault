import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import notifyExpired from "./ToastExpired";


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
        const response = await axios.post(`${URL}verify`);
        if (response.data.ok) {
          login(token);
        } else {
          console.log("Invalid token");
          localStorage.removeItem("token");
          setLoggedIn(false);
          notifyExpired();
        }
      } catch (error) {
        console.log(error);
        localStorage.removeItem("token");
        setLoggedIn(false);
      }
    };
    verify_token();
  }, []);

  const login = (token) => {
    localStorage.setItem("token", JSON.stringify(token));
    const decoded = jwtDecode(token);
    setLoggedIn(true);

    cookies.set("jwt_auth", token, {
      expires: new Date(decoded.exp * 1000),
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    cookies.remove("jwt_auth");
    console.log('Logged out');
  }

  return { loggedIn, login, logout };
}
