import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function NavbarHome({ user }) {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [profileImage, setProfileImage] = useState('profile.jpg');

    const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

    useEffect(() => {
        const image = localStorage.getItem('image');
        if (image) {
            setProfileImage(image);
        }
    }, []);


    return (
        <nav class="bg-slate-900">
            <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div class="relative flex h-16 sm:h-20 lg:h-24 items-center justify-between">
                    <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button type="button" class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                            <span class="absolute -inset-0.5"></span>
                            <span class="sr-only">Open main menu</span>

                            <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>

                            <svg class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div class="flex items-center justify-center sm:items-stretch sm:justify-start">
                        <Link to={"/home"} class="flex-shrink-0 flex items-center">
                            <div class="flex flex-shrink-0 items-center">
                                <img class="hidden sm:block sm:h-12 sm:w-36 lg:h-35 lg:w-35" src="logoBlanco.png" alt="logo" />
                            </div>
                        </Link>
                        <div class="hidden sm:flex sm:items-center lg:items-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div class="flex flex-row space-x-4 justify-center items-center">
                                <Link to="/home" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm sm:text-base lg:text-lg font-medium no-underline font-saira">Home</Link>
                                <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm sm:text-base lg:text-lg font-medium no-underline font-saira">Genres</a>
                                <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm sm:text-base lg:text-lg font-medium no-underline font-saira">Your watchlist</a>
                            </div>
                        </div>
                    </div>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <div class="relative ml-3">
                            <div>
                                <button onClick={toggleDropdown} type="button" class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                    <span class="absolute -inset-1.5"></span>
                                    <span class="sr-only">Open user menu</span>
                                    <img class="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full" src={profileImage} alt="" />
                                </button>
                            </div>
                            {isDropdownOpen && (
                                <div class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none disp" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
                                    <Link to="/profile" class="block px-4 py-2 text-sm sm:text-base lg:text-lg text-gray-700 no-underline" role="menuitem" tabIndex="-1" id="user-menu-item-0" >Your Profile</Link>
                                    <a href="#" class="block px-4 py-2 text-sm sm:text-base lg:text-lg text-gray-700  no-underline" role="menuitem" tabIndex="-1" id="user-menu-item-2 no-underline">Sign out</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div class="sm:hidden" id="mobile-menu">
                <div class="space-y-1 px-2 pb-3 pt-2">
                    <Link to="/home" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm sm:text-base lg:text-lg font-medium no-underline font-">Home</Link>
                    <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm sm:text-base lg:text-lg font-medium no-underline">Genres</a>
                    <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm sm:text-base lg:text-lg font-medium no-underline">Your watchlist</a>
                </div>
            </div>
        </nav>

    );
}

export default NavbarHome;