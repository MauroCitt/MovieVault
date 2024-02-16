import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ColorRing } from 'react-loader-spinner';
import MovieInfo from '../movies/MovieInfo';
import { useNavigate } from 'react-router-dom';
import starImage from '../../images/estrella.png';
import Netflix from './Netflix';
import Discover from './Discover';
import New from './New';


const Busqueda = () => {

    const [movieImages, setMovieImages] = useState();
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setactiveTab] = useState(0);
    const [dropDownOpen, setDropDownOpen] = useState(false);

    const seleccionar = (index) => {
        setactiveTab(index);
    };

    useEffect(() => {
        const fetchMovieImages = async () => {
            try {
                const res = await axios.get('http://localhost:4000/getMomentMovie');
                console.log(res.data);
                setMovieImages(res.data);
                setIsLoading(false);
            } catch (err) {
                console.log(err);
            }
        };
        fetchMovieImages();
    }, []);

    if (isLoading) {
        return <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
        />;
    }

    const urlImage = `https://image.tmdb.org/t/p/original${movieImages.bestMovie.backdrop_path}`;
    console.log(urlImage);

    const releaseYear = movieImages.bestMovie.release_date.substring(0, 4);
    const a = movieImages.bestMovie.vote_average;
    const b = a.toFixed(1);

    return (
        <div>
            <div key={urlImage} className={`relative bg-cover bg-center h-screen flex items-center justify-start`} style={{ backgroundImage: `url(${urlImage})`, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="absolute inset-0 backdrop-filter backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                </div>
                <div className="relative flex space-x-10">
                    <div class="px-4">
                        <img
                            src={`https://image.tmdb.org/t/p/w500/${movieImages.imagePath}`}
                            alt={`Movie Poster`}
                            className="transition ease-in-out duration-150 ml-20 shadow-lg"
                            style={{ width: '350px', height: '500px' }}
                        />
                    </div>
                    <div className='flex flex-col ml-10 items-start w-1/2'>
                        <h1 className={`font-saira font-bold text-white text-5xl mb-4`}>
                            {movieImages.bestMovie.original_title}
                        </h1>
                        <p className='mr-20 text-2xl text-white font-inter'>
                            {releaseYear}
                        </p>
                        <p className='mr-20 text-2xl text-white font-inter'>
                            {movieImages.genresName.map((genre) => genre).join(', ')}
                        </p>
                        <div class="flex items-start mt-2">
                            <img src={starImage} alt='star' className='w-10 h-10' style={{ width: '35px', height: '35px' }} />
                            <p class="text-white text-2xl font-inter mt-1 ml-2">{b} / 10</p>
                        </div>
                        <div class="mt-2 overflow-y-auto h-48 w-full text-justify">
                            <p className='text-white font-inter text-2xl'>
                                {movieImages.bestMovie.overview}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-sm font-medium text-center">
                <div class="flex justify-between items-center bg-gradient-to-b from-slate-900 to-slate-700 text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-700">
                    <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" class="text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-purple-900 font-medium rounded-lg text-sm px-5 py-2.5 ml-10 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Genres <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                    </svg>
                    </button>

                    <div id="dropdown" class={dropDownOpen ? "z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700" : "z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"}>
                        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                            <li>
                                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                            </li>
                            <li>
                                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                            </li>
                            <li>
                                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                            </li>
                            <li>
                                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>
                            </li>
                        </ul>
                    </div>
                    <ul class="flex flex-wrap pr-10 justify-end">
                        <li onClick={() => seleccionar(0)} className={activeTab == 0 ? "me-2 inline-block p-4 text-white no-underline border-b-2 border-purple-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-white no-underline hover:border-gray-300 dark:hover:text-white"}>
                            Netflix
                        </li>
                        <li onClick={() => seleccionar(1)} className={activeTab == 1 ? "me-2 inline-block p-4 text-white no-underline border-b-2 border-purple-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-white no-underline hover:border-gray-300 dark:hover:text-white"}>
                            Prime Video
                        </li>
                        <li onClick={() => seleccionar(2)} className={activeTab == 2 ? "me-2 inline-block p-4 text-white no-underline border-b-2 border-purple-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-white no-underline hover:border-gray-300 dark:hover:text-white"}>
                            HBO
                        </li>
                    </ul>
                </div>
                <div className="tab-content mt-10">
                    <div style={{ display: activeTab === 0 ? 'block' : 'none' }}><Netflix /></div>
                    <div style={{ display: activeTab === 1 ? 'block' : 'none' }}><Discover /></div>
                    <div style={{ display: activeTab === 2 ? 'block' : 'none' }}><New /></div>
                </div>
            </div>

        </div>
    )

}

export default Busqueda