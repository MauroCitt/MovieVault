import React, { useState } from "react";
import NavbarHome from "../Navbar";
import "../../styles/Profile.css";
import "./ProfilePhoto";
import MultiSelectDropdown from "../MultiSelect";
import ProfilePhoto from "./ProfilePhoto";

const Platforms = ["Netflix", "HBO", "Disney+", "Amazon Prime Video", "Filmin"];

const Profile = (props) => {
  const logoutButtonStyle = {
    backgroundColor: "#A239CA",
    color: "white",
  };

  const [multiSelectVisible, setMultiSelectVisible] = useState(false);

  return (
    <div className="fondo">
      <NavbarHome />
      <div className="header">
        <h1 class="mb-4 mt-10 text-3xl font-extrabold text-white dark:text-white md:text-5xl lg:text-6xl">
            My Movie&nbsp; 
          <span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            (Character)
          </span>{" "}
          Profile
        </h1>
      </div>
      <div className="container grid grid-cols-2 gap-4 mt-10">
        <div className="mt-4">
          <ProfilePhoto />
        </div>
        <form onSubmit={props.passwordSubmit}>
          <div className="relative h-full w-full">
            <div className="grid gap-4 grid-cols-2 mt-20">
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
                ></label>
              </div>
              <div class="relative">
                <input
                  type="password"
                  id="password"
                  className="form-control block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=""
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
                >
                  {" "}
                  Platforms
                </button>

                {multiSelectVisible && (
                  <div className="absolute mt-2 w-full">
                    <MultiSelectDropdown
                      formFieldName={"Platforms"}
                      options={Platforms}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 mt-10">
              <div className="relative">
                <button
                  className="btn bg-purple-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="submit"
                  id="btnGuardarPass"
                  style={logoutButtonStyle}
                >
                  Save changes
                </button>
              </div>
              <div className="relative">
                <button
                  type="submit"
                  className="btn bg-purple-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  style={logoutButtonStyle}
                  onClick={props.logout}
                  id="btnSalida"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
