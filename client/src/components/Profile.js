import React, { useState } from 'react';
import NavbarHome from "./Navbar";
import "../styles/Profile.css";
import "./ProfilePhoto";
import MultiSelectDropdown from "./MultiSelect";

const Platforms = ["Netflix", "HBO", "Disney+", "Amazon Prime Video", "Filmin"];	

const Profile = (props) => {
  const logoutButtonStyle = {
    backgroundColor: "#A239CA",
    color: "white",
  };

  const [multiSelectVisible, setMultiSelectVisible] = useState(false);

  return (
    <div>
      <NavbarHome />

      <div className="header">
        <h1 className="titulo" class='text-left text-white mt-2 ml-6'>Profile</h1>
      </div>

      <form onSubmit={props.passwordSubmit}>
        <div className="relative h-full w-full">
          <div className="absolute inset-y-0 right-0 w-50 mr-10 mt-10">
            <div className="grid gap-4 grid-cols-2">
            <div class="relative">
              <input
                type="text"
                id="email"
                className="form-control"
                class="block mb-10 px-2.5 pb-2.5 pt-4 pr-30 w-full text-sm text-gray-900 bg-white rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                onChange={props.enterPassword}
                value={props.email}
                disable
              />
              <label
                for="email"
                class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
              </label>
            </div>
            <div class="relative">
              <input
                type="password"
                id="password"
                className="form-control block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                onChange={props.enterPassword}
                value={props.userPass}
              />
              <label
                htmlFor="password"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
              >
                New password
              </label>
            </div>
            <div class="relative">
              <input
                type="text"
                id="user"
                className="form-control block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="user"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
              >
                User
              </label>
            </div>

            <div className="relative text-center">
              <button
                type="button"
                className="form-control font-mono block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                onClick={() => setMultiSelectVisible(!multiSelectVisible)}
              > Platforms
              </button>

              {multiSelectVisible && (
                <div className="absolute mt-2 w-full">
                  <MultiSelectDropdown formFieldName={"Platforms"} options={Platforms} />
                </div>
              )}
            </div>           
            <div className="right-0 top-0 mt-16">
              <button
                type="submit"
                className="btn bg-purple-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-10"
                style={logoutButtonStyle}
                onClick={props.logout}
              >
                Logout
              </button>
              <button
                className="btn bg-purple-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
                id="btnGuardarPass"
                style={logoutButtonStyle}
              >
                Save changes
              </button>
            </div>
          </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
