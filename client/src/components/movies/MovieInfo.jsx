import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import starImage from '../../images/estrella.png';
import cartelera from '../../images/cinema.png';
import netflixLogo from '../../images/NetflixLogo.png';
import primeVideo from '../../images/PrimeVideo.png';
import hboMax from '../../images/hbo.png';
import movistar from '../../images/movistar.png';
import tivify from '../../images/tivify.png';
import DisneyPlus from '../../images/DisneyPlus.jpg';
import filmin from '../../images/filmin.png';
import fubo from '../../images/descarga.png';
import apple from '../../images/apple.png';
import sky from '../../images/sky.jpg';
import acontra from '../../images/acontra.png';

const MovieInfo = () => {
    const { state } = useLocation();
    const [movieReviews, setMovieReviews] = useState([]);
    const [expandedReview, setExpandedReview] = useState(null);

    const handleExpandClick = (index) => {
        if (expandedReview === index) {
            setExpandedReview(null);
        } else {
            setExpandedReview(index);
        }
    };

    const movie = state;
    const idMovie = movie.movie.movieInfo.id;
    const a = movie.movie.movieInfo.vote_average
    const b = a.toFixed(1);

    let fecha = movie.movie.movieInfo.release_date;
    let year = fecha.substring(0, 4);

    const providerLogos = {
        'Netflix': netflixLogo,
        'Amazon Prime Video': primeVideo,
        'HBO Max': hboMax,
        'Movistar Plus': movistar,
        'Tivify': tivify,
        'Disney Plus': DisneyPlus,
        'Filmin': filmin,
        'Fubo TV': fubo,
        'Apple TV Plus': apple,
        'SkyShowtime': sky,
        'Acontra Plus': acontra
    }

    useEffect(() => {
        const fetchMovieImages = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/getReviews?idMovie=${idMovie}`);
                console.log(res.data);
                setMovieReviews(res.data.results);
            } catch (err) {
                console.log(err);
            }
        };
        fetchMovieImages();
    }, []);

    let title = movie.movie.movieInfo.titulo;
    let fontSize = 'text-5xl';

    if (title.length > 20) {
        fontSize = 'text-xl';
    } else if (title.length > 30) {
        fontSize = 'text-2xl';
    } else if (title.length > 40) {
        fontSize = 'text-xl'
    }

    return (
        <div>
            <div class="flex flex-1 bg-slate-800 mt-20">
                <div class="px-10">
                    <img
                        src={`https://image.tmdb.org/t/p/w500/${movie.moviePath}`}
                        alt={`Movie Poster`}
                        className="transition ease-in-out duration-150 ml-20"
                        style={{ width: '400px', height: '600px' }}
                    />
                    <div class="flex flex-1 justify-center items-center">
                        <img src={starImage} alt='star' className='w-10 h-10 ml-20' style={{ width: '35px', height: '35px' }} />
                        <p class="text-white text-2xl font-saira font-bold mt-2 pt-2 ml-2">{b} / 10</p>
                    </div>
                </div>
                <div className='flex flex-col ml-auto mr-auto mt-[-120px] relative'>
                    <img src={cartelera} alt='star' className='' style={{ width: '450px', height: '350px' }} />
                    <h1 className={`font-bebas ${fontSize} text-black absolute top-52 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden whitespace-nowrap text-overflow`}>
                        {title}
                    </h1>

                    <div className=''>
                        <dl class="max-w-md text-white divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                            <div class="flex flex-col pb-3">
                                <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Director</dt>
                                <dd class="text-lg font-semibold">{movie.movie.movieInfo.director}</dd>
                            </div>
                            <div class="flex flex-col py-3">
                                <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Main actors</dt>
                                {movie.movie.movieInfo.crew.map((item, index) => (
                                    <dd key={index} class="text-lg font-semibold">{item}</dd>
                                ))}
                            </div>
                            <div class="flex flex-col py-3">
                                <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Genre/s</dt>
                                {movie.movie.genresName.map((item, index) => (
                                    <dd key={index} class="text-lg font-semibold">{item}</dd>
                                ))}
                            </div>
                            <div class="flex flex-col pb-3">
                                <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Year</dt>
                                <dd class="text-lg font-semibold">{year}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            <div class="bg-slate-900 rounded-lg mx-96 pb-4 mt-4 py-2">
                <h2 class="text-white font-saira">Where can I see it?</h2>
                <div class="flex">
                    {[...new Set(movie.movie.movieInfo.providers)].map((provider, index) => {
                        const logo = providerLogos[provider];
                        if (provider == "Netflix basic with Ads") {
                            return;
                        }
                        return <img key={index} src={logo} alt={provider} style={{ height: 55, marginLeft: 20, marginTop: 6 }} />;
                    })}
                </div>
            </div>
            <div class="flex mt-10">
                <div class="w-1/2 bg-slate-700 py-4 px-6 rounded-md">
                    <h2 class="text-white flex flex-1 justify-start ml-4">Synopsis</h2>
                    <p class="mt-6 text-xl text-white dark:text-gray-400 font-inter text-justify">{movie.movie.movieInfo.synopsis}</p>
                </div>
                <div class="w-1/2 bg-slate-700 p-2 ml-4 rounded-md overflow-auto max-h-72">
                    <h2 class="text-white flex flex-1 justify-start ml-4 UNDERLINE">Reviews from TMDB</h2>
                    <ul class="text-xl text-white dark:text-gray-400 font-inter">
                        {movieReviews.map((review, index) => (
                            <li key={index} class="mb-4 border-b border-white">
                                <h3 class="font-bold">{review.author}</h3>
                                <p class="text-justify">
                                    {expandedReview === index ? review.content : review.content.substring(0, 200)}
                                    <br />
                                    <br />
                                    {review.content.length > 200 && (
                                        <button onClick={() => handleExpandClick(index)} class="bg-purple-800 p-2 rounded-sm">
                                            {expandedReview === index ? 'See Less' : 'See More'}
                                        </button>
                                    )}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default MovieInfo