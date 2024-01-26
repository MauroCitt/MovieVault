import React, { useState, useEffect } from "react";
import NavbarHome from "../Navbar";
import "./ProfilePhoto";
import MultiSelectDropdown from "../MultiSelect";
import ProfilePhoto from "./ProfilePhoto";
import axios from 'axios';


const Platforms = ["Netflix", "HBO", "Disney+", "Amazon Prime Video", "Filmin"];


const Profile = (props) => {

    const [username, setUsername] = useState('');
    const [image, setImage] = useState('profile.jpg');
    let email = props.email;
    let profileImage = localStorage.getItem('image', image);

    useEffect(() => {
        localStorage.setItem('image', image);
    }, [image]);

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                let res = await axios.get('http://localhost:4000/getUsername', {
                    params: { email: email },
                    withCredentials: true
                });

                if (res.data.userName) {
                    console.log(res.data.userName);
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

    const logoutButtonStyle = {
        backgroundColor: "#e61919",
        color: "white",
    };

    const saveChangesButtonStyle = {
        backgroundColor: "#A239CA",
        color: "white",
    }

    const [multiSelectVisible, setMultiSelectVisible] = useState(false);
    console.log(profileImage);

    return (
        <div className="fondo bg-slate-800">
            <NavbarHome logout={props.logout} profileImage={profileImage} user={image}/>
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
                    <div className="mb-3">
                        <p class="text-2xl font-bold text-white dark:text-white">{username}</p>
                    </div>
                    <ProfilePhoto email={email} image={image} setImage={setImage} />
                </div>
                <form onSubmit={props.passwordSubmit}>
                    <div className="relative max-h-screen w-full">
                        <div className="grid gap-4 grid-cols-2 pt-10 mt-20">
                            <div class="relative">
                                <input
                                    type="text"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John"
                                    onChange={props.enterEmail}
                                    value={props.email}
                                    disable="true"
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
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
                                    placeholder=""
                                    onChange={props.enterUser}
                                    value={props.user}
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
                                    style={saveChangesButtonStyle}
                                >
                                    Save changes
                                </button>
                            </div>
                            <div className="relative">
                                <button
                                    type="button"
                                    className="btn bg-purple-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    style={logoutButtonStyle}
                                    onClick={props.logout}
                                    id="btnSalida"
                                >
                                    Log out
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