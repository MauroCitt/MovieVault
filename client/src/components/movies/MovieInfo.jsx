import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';

const MovieInfo = (props) => {
    const { state } = useLocation();
    const movie = state;
    console.log(movie)

    return (
        <div>
            <div class="flex flex-1 bg-slate-800 mt-20">
                <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.moviePath}`}
                    alt={`Movie Poster`}
                    className="transition ease-in-out duration-150 mb-8 ml-20"
                    style={{ width: '400px', height: '600px' }}
                />
                <div className='flex flex-col ml-auto mr-auto'>
                    <h1 className='text-white font-inter font-bold bg-gradient-to-l from-purple-900 to-purple-500 py-4 px-20 rounded-md'>
                        {movie.movie.titulo}
                    </h1>
                    <div className=''>
                        <dl class="max-w-md mt-10 text-white divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                            <div class="flex flex-col pb-3">
                                <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Director</dt>
                                <dd class="text-lg font-semibold">{movie.movie.director}</dd>
                            </div>
                            <div class="flex flex-col py-3">
                                <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Main actors</dt>
                                {movie.movie.crew.map((item, index) => (
                                    <dd key={index} class="text-lg font-semibold">{item}</dd>
                                ))}
                            </div>
                            <div class="flex flex-col pt-3">
                                <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Genre/s</dt>
                                {movie.movie.genero.map((item, index) => (
                                    <dd key={index} class="text-lg font-semibold">{item}</dd>
                                ))}
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MovieInfo