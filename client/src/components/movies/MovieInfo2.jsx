import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import starImage from '../../images/estrella.png';
import CardActor from '../actors/CardActor';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MovieInfo2 = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipeToSlide: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }
        ]
    };

    const [movieReviews, setMovieReviews] = useState([]);
    const [movieProviders, setMovieProviders] = useState([]);
    const [movieProvidersImage, setMovieProvidersImage] = useState([]);
    const [cast, setCast] = useState([]);

    const [backdropImage, setBackdropImage] = useState('');
    const [trailerKey, setTrailerKey] = useState(null);
    const [urlImage, setUrlImage] = useState(`https://image.tmdb.org/t/p/w780${backdropImage}`);

    const { state } = useLocation();
    const navigate = useNavigate();


    const movie = state;
    const idMovie = movie.movie.movieInfo.id;

    useEffect(() => {
        const fetchBackdropImage = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/getInfo?idMovie=${idMovie}`);
                setBackdropImage(res.data.backdropPath);
            } catch (err) {
            }
        };
        fetchBackdropImage();
    }, []);

    useEffect(() => {
        const fetchTrailer = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/getTrailer?idMovie=${idMovie}`);
                console.log(res.data);
                setTrailerKey(res.data);
                console.log(trailerKey)
            } catch (err) {
                console.error(err);
            }
        };
        fetchTrailer();
    }, []);

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth > 768) {
                setUrlImage(`https://image.tmdb.org/t/p/original${backdropImage}`);
            } else {
                setUrlImage(`https://image.tmdb.org/t/p/w780${backdropImage}`);
            }
        }
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [backdropImage]);

    let fecha = movie.movie.movieInfo.release_date;
    let year = fecha.substring(0, 4);

    useEffect(() => {
        const fetchMovieImages = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/getReviews?idMovie=${idMovie}`);
                setMovieReviews(res.data.results);
            } catch (err) {
            }
        };
        fetchMovieImages();
    }, []);

    useEffect(() => {
        const fetchMovieProviders = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/getProviders?idMovie=${idMovie}`);
                setMovieProviders(res.data.names);
                setMovieProvidersImage(res.data.logos);
            } catch (err) {
            }
        };
        fetchMovieProviders();
    }, []);

    useEffect(() => {
        const fetchMovieCast = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/getCastInfo?idMovie=${idMovie}`);
                setCast(res.data);
            } catch (err) {
            }
        };
        fetchMovieCast();
    }, []);

    let title = movie.movie.movieInfo.title;
    let genresName = movie.movie.genresName;

    let formatVote = movie.movie.movieInfo.vote_average;
    formatVote = parseFloat(formatVote.toFixed(1));

    return (
        <div className="relative bg-slate-900">
            <div className="relative h-64 sm:h-96 md:h-[75vh] bg-cover bg-top" style={{ backgroundImage: `url(${urlImage})`, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="absolute inset-0 backdrop-filter sm:block hidden" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}></div>
                <div className="absolute left-2 md:bottom-36 md:left-32 md:flex-1 bg-slate-800 mt-3 font-inter md:bg-transparent md:mt-0 hidden md:block">
                    <h1 className='text-white md:text-7xl font-saira md:font-bold'>{title}</h1>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col mt-3 sm:mt-0 md:ml-10 2xl:ml-20 px-2 pt-4">
                <div className="flex md:flex-col sm:flex-row md:items-start justify-between">
                    <div className="flex flex-col items-start overflow-auto">
                        <h1 className='text-white text-sm sm:text-4xl font-saira text-left font-bold mr-4 sm:mb-2 sm:ml-0 mb-2'>{title} <span className='text-sm sm:text-3xl font-normal font-inter mr-2'>({year})</span> <span className='text-2xl sm:text-3xl xl:inline sm:block hidden'>Directed By </span> <span className='text-2xl sm:text-3xl font-normal font-inter xl:inline sm:block hidden'>{movie.movie.movieInfo.director}</span></h1>
                        <p className='text-white text-sm font-inter mr-4 text-left sm:text-xl sm:mb-2 sm:ml-0 mb-2'>{genresName.join(', ')}</p>
                        <p className='text-white text-sm sm:text-xl font-inter sm:ml-0'>{movie.movie.movieInfo.runtime} mins</p>
                        <p className='text-white font-inter text-sm mb-0 sm:hidden block'>Directed By</p>
                        <p className='text-white font-inter font-bold text-sm sm:hidden block'>{movie.movie.movieInfo.director}</p>
                        <p className='text-white text-xs mr-8 text-justify sm:hidden block'>{movie.movie.movieInfo.overview}</p>
                        <div className="sm:hidden block">
                            <h1 className='text-white font-saira font-bold text-lg sm:text-4xl'>Cast</h1>
                            <Slider {...settings} className='w-64'>
                                {cast && cast.map((actor, index) => (
                                    <div key={index}>
                                        <CardActor actor={actor} />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                    <div className='flex flex-col sm:flex-row flex-shrink-0'>
                        <div className='flex flex-col items-start sm:w-[25rem] w-36 sm:mr-0 mr-2'>
                            <div className="sm:relative sm:w-[22rem] sm:h-[32rem] sm:mr-10">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500/${movie.moviePath}`}
                                    alt={`Movie Poster`}
                                    className="transition ease-in-out object-contain w-full h-full sm:absolute sm:inset-0 sm:object-cover"
                                />
                            </div>
                            <div className='flex justify-between items-center border-b border-white sm:mr-0 mr-4 w-full sm:w-[22rem]'>
                                <h2 className='text-left text-sm md:text-2xl font-inter text-white mt-4'>Rating</h2>
                                <h2 className='text-right text-sm font-inter md:text-2xl text-white mt-4'>{movie.movie.movieInfo.vote_count}</h2>
                            </div>
                            <div className='flex items-center justify-start pb-4 mt-2'>
                                <img src={starImage} alt='star' className='w-5 h-5 md:w-5 md:h-5 self-center' />
                                <p className='text-white text-sm md:text-2xl ml-1 mb-0 self-center'>{formatVote}</p>
                            </div>
                            <div className='w-full sm:w-[22rem] text-center bg-gradient-to-b from-slate-700 to-slate-900 mb-0 rounded'>
                                <h2 className='text-white text-sm xl:text-2xl py-2'>Where to watch?</h2>
                                <div className='bg-slate-800 pb-2 pt-3 mt-2'>
                                    {movieProviders && movieProviders.filter((value, index, self) => self.indexOf(value) === index).map((provider, index) => (
                                        <div key={index} className='flex items-center text-start ml-4 mb-3 pr-2 sm:pr-0'>
                                            <img src={`https://image.tmdb.org/t/p/w500/${movieProvidersImage[index]}`} alt={provider} className='w-5 h-5 sm:w-8 sm:h-8 mr-2 rounded' />
                                            <p className='text-white text-xs xl:text-xl font-inter mb-0'>{provider}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="text-left sm:block hidden ml-12 2xl:ml-20">
                            <h2 className='text-white font-saira font-bold'>Synopsis</h2>
                            <p className='text-white text-2xl font-inter pr-28 text-justify w-full'>{movie.movie.movieInfo.overview}</p>
                            <div className="mt-10">
                                <div className='h-[100px] md:h-[400px] md:w-[800px] 2xl:h-[600px] 2xl:w-[1170px]'>
                                    <iframe
                                        width="1000"
                                        height="600"
                                        src={`https://www.youtube.com/embed/${trailerKey}`}
                                        title="YouTube video player"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        className='w-full h-full'
                                        allowFullScreen
                                    ></iframe>
                                </div>
                                <div className="pt-10">
                                    <h1 className='text-white font-saira font-bold text-lg sm:text-4xl'>Cast</h1>
                                    <div className='grid grid-cols-4 pt-2'>
                                        {cast && cast.map((actor, index) => (
                                            <CardActor key={index} actor={actor} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MovieInfo2