import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./ProfilePhoto";
import ProfilePhoto from "./ProfilePhoto";
import ListsTab from "./ListsTab";



const ProfileList = (props) => {

  const email = localStorage.getItem('email');
  const [username, setUsername] = useState('');
  const [isClicked, setIsClicked] = useState(false);

  const [activeTab, setActiveTab] = useState(0);
  


  const seleccionar = (index) => {
    setActiveTab(index);
    setIsClicked(false);
  };

  useEffect(() => {
    localStorage.setItem('image', props.image);
  }, [props.image]);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        let res = await axios.get('http://localhost:4000/getUsername', {
          params: { email: email },
          withCredentials: true
        });

        if (res.data.userName) {
          setUsername(res.data.userName);
        } else {
          setUsername('New_user');
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };
    fetchUsername();
  }, []);


  return (
    <div className="flex flex-col sm:flex-row">
      <div className="w-full h-full sm:w-1/3 bg-slate-700 min-h-screen">
        <div className="mt-4">
          <div className="mb-3">
            <p className="text-2xl font-bold text-white dark:text-white">{username}</p>
          </div>
          <ProfilePhoto email={email} image={props.image} setImage={props.setImage} />
        </div>
      </div>
      <div className="w-full sm:w-2/3">
        <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
          <ul class="flex flex-wrap -mb-px">
            <li onClick={() => seleccionar(0)} className={activeTab == 0 ? "me-2 inline-block p-4 text-white no-underline border-b-2 border-purple-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : "me-2 inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-white no-underline hover:border-gray-300 dark:hover:text-white"}>
              Watched
            </li>
            <li onClick={() => seleccionar(1)} className={activeTab == 1 ? "me-2 inline-block p-4 text-white no-underline border-b-2 border-purple-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : "me-2 inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-white no-underline hover:border-gray-300 dark:hover:text-white"}>
              Want to Watch
            </li>
          </ul>
        </div>
        <div>
          <div><ListsTab activeTab={activeTab}/></div>
        </div>
      </div>
    </div>
  )
}

export default ProfileList