import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ColorRing } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import starImage from '../../images/estrella.png';
import Streaming from './StreamingTabs/Streaming';
import Suggestions from './Suggestions';


const Busqueda = () => {

    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [dropDownOpen, setDropDownOpen] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [isSearching, setIsSearching] = useState([]);

    const [genresName, setGenresName] = useState([]);
    const [queryItems, setQueryItems] = useState([]);

    const [activeTab, setActiveTab] = useState(0);
    const [movieImages, setMovieImages] = useState();
    const [selectedGenre, setSelectedGenre] = useState('Genres');
    const [inputContent, setInputContent] = useState("");
    const [suggestions, setSuggestions] = useState(false);

    const dropdownRef = useRef(null);


    const handleButtonClick = () => {
        setSelectedGenre("All");
        setActiveTab(4);
        setIsClicked(true);
        setIsSearching(!isSearching);
    }

    const navigate = useNavigate();

    const seleccionar = (index) => {
        setActiveTab(index);
        setIsClicked(false);
    };

    const onSuggestionClick = (suggestion) => {
        setInputContent(suggestion);
        handleButtonClick();
        setSuggestions(false);
    };

    useEffect(() => {
        if (inputContent.length >= 3) {
            setSuggestions(true);
        } else {
            setSuggestions(false);
        }
    }, [inputContent]);

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

                let genresNames = [];
                genres.forEach(element => {
                    genresNames.push(element.nombre);
                });

                genresNames.push("All");
                setGenresName(genresNames);

            } catch (error) {
                console.error("Error fetching genres", error);
            }
        }
        allGenres();
    }, []);

    useEffect(() => {
        async function getNames() {
            if (inputContent.length < 3 || inputContent === "") {
                return;
            }

            try {
                const res = await axios.get('http://localhost:4000/getElasticSearch?query=' + inputContent);
                setQueryItems(res.data);
            } catch (error) {
                console.error("Error fetching names", error);
            }
        }
        getNames();
    }, [inputContent]);


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
            <div key={urlImage} className={`flex grid-cols-2 gap-4 relative bg-cover bg-center min-h-screen items-center justify-start`} style={{ backgroundImage: `url(${urlImage})`, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="absolute inset-0 backdrop-filter backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                </div>
                <div className="relative flex max-w-full">
                    <div className="px-4 2xl:mr-5">
                        <img
                            src={`https://image.tmdb.org/t/p/w780/${movieImages.imagePath}`}
                            alt={`Movie Poster`}
                            className="object-scale-down max-h-full transition ease-in-out duration-150 sm:ml-0 sm:w-full xl:ml-20 xl:w-full xl:h-[500px] 2xl:w-full 2xl:h-[700px]"
                            onClick={() => handleMovieClick()}
                        />
                    </div>
                    <div className='flex flex-col ml-10 items-start md:w-1/2 2xl:w-3/5'>
                        <h1 className={`font-saira font-bold text-white xl:${fontSize} 2xl:text-7xl xl:mb-4 2xl:mb-8`}>
                            {movieImages.bestMovie.original_title}
                        </h1>
                        <p className='mr-20 xl:text-2xl 2xl:text-3xl text-white font-inter 2xl:mb-8'>
                            {releaseYear}
                        </p>
                        <p className='mr-20 xl:text-2xl 2xl:text-3xl text-white font-inter 2xl:mb-8'>
                            {movieImages.genresName.map((genre) => genre).join(', ')}
                        </p>
                        <div class="flex items-start 2xl:mb-8">
                            <img src={starImage} alt='star' className='w-10 h-10' style={{ width: '35px', height: '35px' }} />
                            <p class="text-white xl:text-2xl 2xl:text-3xl font-inter mt-1 ml-2">{b} / 10</p>
                        </div>
                        <div class="overflow-y-visible h-48 w-full text-justify">
                            <p className={`text-white font-inter text-base md:${fontSizeOverview} 2xl:text-3xl`}>
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
                    <div class="max-w-md mx-auto">
                        <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <div class="relative flex items-center">
                                <input
                                    type="search"
                                    id="default-search"
                                    onChange={event => setInputContent(event.target.value)}
                                    class="block w-full sm:w-[150%] xl:w-auto xl:max-w-lg 2xl:max-w-xl py-2 px-10 sm:pl-10 sm:pr-20 xl:py-2 xl:pl-20 2xl:py-3 2xl:pl-10 text-sm 2xl:text-md text-white border border-purple-900 rounded-lg bg-slate-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Search for a movie..."
                                    required
                                    autoComplete='off'
                                />
                                {suggestions ? <Suggestions suggestions={queryItems} onSuggestionClick={onSuggestionClick} className="absolute z-50 w-[80%] mt-1" /> : null}
                                <button
                                    type="submit"
                                    onClick={() => handleButtonClick()}
                                    class="text-white font-inter ml-2 sm:p-2 xl:p-2 2xl:p-3 shadow-sm bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800">
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end overflow-auto">
                        <ul class="flex flex-wrap pr-10 justify-end">
                        <li onClick={() => seleccionar(4)} className={activeTab == 4 ? "me-2 inline-block p-4 text-white no-underline border-b-2 border-purple-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : "me-2 inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-white no-underline hover:border-gray-300 dark:hover:text-white"}>
                                All
                            </li>
                            <li onClick={() => seleccionar(0)} className={activeTab == 0 ? "me-2 inline-block p-4 text-white no-underline border-b-2 border-purple-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : "me-2 inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-white no-underline hover:border-gray-300 dark:hover:text-white"}>
                                Netflix
                            </li>
                            <li onClick={() => seleccionar(1)} className={activeTab == 1 ? "me-2 inline-block p-4 text-white no-underline border-b-2 border-purple-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : "me-2 inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-white no-underline hover:border-gray-300 dark:hover:text-white"}>
                                Prime
                            </li>
                            <li onClick={() => seleccionar(2)} className={activeTab == 2 ? "me-2 inline-block p-4 text-white no-underline border-b-2 border-purple-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : "me-2 inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-white no-underline hover:border-gray-300 dark:hover:text-white"}>
                                HBO
                            </li>
                            <li onClick={() => seleccionar(3)} className={activeTab == 3 ? "me-2 inline-block p-4 text-white no-underline border-b-2 border-purple-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : "me-2 inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-white no-underline hover:border-gray-300 dark:hover:text-white"}>
                                Filmin
                            </li>
                            <li onClick={() => seleccionar(5)} className={activeTab == 5 ? "me-2 inline-block p-4 text-white no-underline border-b-2 border-purple-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : "me-2 inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-white no-underline hover:border-gray-300 dark:hover:text-white"}>
                                Disney+
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="tab-content mt-10">
                    <div><Streaming isSearching={isSearching} activeTab={activeTab} selectedGenre={selectedGenre} savedInput={inputContent} isClicked={isClicked} queryItems={queryItems} setQueryItems={setQueryItems} setIsClicked={setIsClicked} inputContent={inputContent} /></div>
                </div>
            </div>
        </div>
    )

}

export default Busqueda