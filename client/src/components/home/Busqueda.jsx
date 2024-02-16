import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ColorRing } from 'react-loader-spinner';
import MovieInfo from '../movies/MovieInfo';
import { useNavigate } from 'react-router-dom';
import starImage from '../../images/estrella.png';


const Busqueda = () => {

    const [movieImages, setMovieImages] = useState();
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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
                <div className="absolute inset-0 backdrop-filter backdrop-blur-sm" style={{backgroundColor:'rgba(0, 0, 0, 0.4)'}}>
                </div> 
                <div className="relative flex space-x-10">
                    <div class="px-10">
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
                        <p className='mr-20 text-2xl text-white font-saira'>
                            {releaseYear}
                        </p>
                        <p className='mr-20 text-2xl text-white font-saira'>
                            {movieImages.genresName.map((genre) => genre).join(', ')}
                        </p>
                        <div class="flex items-start mt-2">
                            <img src={starImage} alt='star' className='w-10 h-10' style={{ width: '35px', height: '35px' }} />
                            <p class="text-white text-2xl font-saira mt-1 ml-2">{b} / 10</p>
                        </div>
                        <div class="mt-2 overflow-y-auto h-48 w-full text-justify">
                            <p className='text-white font-saira text-2xl'>
                                {movieImages.bestMovie.overview}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                <ul class="flex flex-wrap -mb-px">
                    <li class="me-2">
                        <a href="#" class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Profile</a>
                    </li>
                    <li class="me-2">
                        <a href="#" class="inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" aria-current="page">Dashboard</a>
                    </li>
                    <li class="me-2">
                        <a href="#" class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Settings</a>
                    </li>
                    <li class="me-2">
                        <a href="#" class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Contacts</a>
                    </li>
                    <li>
                        <a class="inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500">Disabled</a>
                    </li>
                </ul>
            </div>
        </div>
    )

}

export default Busqueda