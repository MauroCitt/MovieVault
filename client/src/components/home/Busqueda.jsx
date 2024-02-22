import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ColorRing } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import starImage from '../../images/estrella.png';
import Streaming from './StreamingTabs/Streaming';


const Busqueda = () => {

    const [movieImages, setMovieImages] = useState();
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setactiveTab] = useState(0);
    const [dropDownOpen, setDropDownOpen] = useState(false);
    const [genresName, setGenresName] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('Genres');


    const navigate = useNavigate();

    const seleccionar = (index) => {
        setactiveTab(index);
    };

    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchMovieImages = async () => {
            try {
                const res = await axios.get('http://localhost:4000/getMomentMovie');
                setMovieImages(res.data);
                setIsLoading(false);
            } catch (err) {
                console.log(err);
            }
        };
        fetchMovieImages();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropDownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    useEffect(() => {
        async function allGenres() {
            try {
                const res = await axios.get('http://localhost:4000/getAllGenres');
                const genres = res.data;
                console.log(genres);

                let genresNames = [];
                genres.forEach(element => {
                    console.log(element)
                    genresNames.push(element.nombre);
                });

                genresNames.push("All");

                setGenresName(genresNames);
                console.log(genresNames);

            } catch (error) {
                console.error("Error fetching genres", error);
            }
        }
        allGenres();
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
    const releaseYear = movieImages.bestMovie.release_date.substring(0, 4);
    const a = movieImages.bestMovie.vote_average;
    const b = a.toFixed(1);

    const handleMovieClick = () => {
        navigate(`/movieInfo/${movieImages.bestMovie.original_title}`, { state: { movie: movieImages, moviePath: movieImages.imagePath } });
        setSelectedMovie(movieImages);
    }

    const title = movieImages.bestMovie.original_title;
    const overview = movieImages.bestMovie.overview;
    console.log(title);
    let fontSize = 'text-5xl';
    let fontSizeOverview = 'text-2xl';

    if (title.length > 20) {
        fontSize = 'text-4xl';
    }

    if (overview.length > 300) {
        fontSizeOverview = 'text-md';
    }



    return (
        <div>
            <div key={urlImage} className={`flex grid-cols-2 gap-4 relative bg-cover bg-center h-screen items-center justify-start`} style={{ backgroundImage: `url(${urlImage})`, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="absolute inset-0 backdrop-filter backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                </div>
                <div className="relative flex max-w-full">
                    <div className="px-4">
                        <img
                            src={`https://image.tmdb.org/t/p/w500/${movieImages.imagePath}`}
                            alt={`Movie Poster`}
                            className="transition ease-in-out duration-150 ml-20 shadow-lg cursor-pointer object-cover 2xl:w-full h-full"
                            style={{ maxWidth: '350px', maxHeight: '500px', width: '100%', height: '100%' }}
                            onClick={() => handleMovieClick()}
                        />
                    </div>
                    <div className='flex flex-col ml-10 items-start md:w-1/2 2xl:w-3/5'>
                        <h1 className={`font-saira font-bold text-white xl:${fontSize} 2xl:text-7xl mb-4`}>
                            {movieImages.bestMovie.original_title}
                        </h1>
                        <p className='mr-20 xl:text-2xl 2xl:text-3xl text-white font-inter'>
                            {releaseYear}
                        </p>
                        <p className='mr-20 xl:text-2xl 2xl:text-3xl text-white font-inter'>
                            {movieImages.genresName.map((genre) => genre).join(', ')}
                        </p>
                        <div class="flex items-start mt-2">
                            <img src={starImage} alt='star' className='w-10 h-10' style={{ width: '35px', height: '35px' }} />
                            <p class="text-white xl:text-2xl 2xl:text-3xl font-inter mt-1 ml-2">{b} / 10</p>
                        </div>
                        <div class="mt-2 overflow-y-visible h-48 w-full text-justify">
                            <p className={`text-white font-inter text-base md:${fontSizeOverview} 2xl:text-2xl`}>
                                {movieImages.bestMovie.overview}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-sm font-medium text-center">
                <div class="flex justify-between items-center bg-gradient-to-b from-slate-900 to-slate-700 text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-700">
                    <div className="relative">
                        <button onClick={() => setDropDownOpen(!dropDownOpen)} id="dropdownDefaultButton" data-dropdown-toggle="dropdown" class="text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-purple-900 font-medium rounded-lg text-sm px-5 py-2.5 ml-10 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                            {selectedGenre} <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                            </svg>
                        </button>

                        <div ref={dropdownRef} id="dropdown" class={dropDownOpen ? "bg-white divide-y divide-gray-100 rounded-lg shadow m-12 dark:bg-gray-700 absolute top-full mt-2 pr-7" : "z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute top-full mt-2"}>
                            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 text-center" aria-labelledby="dropdownDefaultButton" style={{ textAlign: "center" }}>
                                {genresName.map((genre, index) => (
                                    <li key={index} className='py-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer' onClick={() => { setSelectedGenre(genre); setDropDownOpen(false); }}>
                                        {genre}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end overflow-auto">
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
                            <li onClick={() => seleccionar(3)} className={activeTab == 3 ? "me-2 inline-block p-4 text-white no-underline border-b-2 border-purple-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-white no-underline hover:border-gray-300 dark:hover:text-white"}>
                                Filmin
                            </li>
                            <li onClick={() => seleccionar(4)} className={activeTab == 4 ? "me-2 inline-block p-4 text-white no-underline border-b-2 border-purple-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-white no-underline hover:border-gray-300 dark:hover:text-white"}>
                                Apple TV+
                            </li>
                            <li onClick={() => seleccionar(5)} className={activeTab == 5 ? "me-2 inline-block p-4 text-white no-underline border-b-2 border-purple-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-white no-underline hover:border-gray-300 dark:hover:text-white"}>
                                Disney+
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="tab-content mt-10">
                    <div><Streaming activeTab={activeTab} selectedGenre={selectedGenre} /></div>
                </div>
            </div>

        </div>
    )

}

export default Busqueda