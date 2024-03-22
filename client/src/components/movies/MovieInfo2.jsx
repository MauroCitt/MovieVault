import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive'
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { RiFileList2Fill } from "react-icons/ri";
import { CiHeart } from "react-icons/ci";
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

    const email = localStorage.getItem('email');

    const [movieReviews, setMovieReviews] = useState([]);
    const [movieProviders, setMovieProviders] = useState([]);
    const [movieProvidersImage, setMovieProvidersImage] = useState([]);
    const [cast, setCast] = useState([]);
    const [movieProducers, setMovieProducers] = useState([]);
    const [movieProducersImage, setMovieProducersImage] = useState([]);
    const [showFullReview, setShowFullReview] = useState([]);


    const [trailerKey, setTrailerKey] = useState(null);
    const [selected, setSelected] = useState(null);

    const [isClicked, setIsClicked] = useState(false);
    const [backdropImage, setBackdropImage] = useState('');
    const [urlImage, setUrlImage] = useState(`https://image.tmdb.org/t/p/w780${backdropImage}`);
    const [showReviews, setShowReviews] = useState(3);

    const isSmallScreen = useMediaQuery({ query: '(max-width: 640px)' })
    const { state } = useLocation();
    const navigate = useNavigate();


    const movie = state;
    const idMovie = movie.movie.movieInfo.id;


    const handleListClick = async (list) => {
        try {
            await axios.post(`http://localhost:4000/addToList`, { idMovie: idMovie, email: email, list: list });
            if (list === 'watched') {
                setSelected('watched');
            } else if (list === 'wantToWatch') {
                setSelected('wantToWatch');
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchBackdropImage = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/getInfo?idMovie=${idMovie}&email=${email}`, { withCredentials: true });
                setBackdropImage(res.data.backdropPath);
                console.log(res.data.backdropPath)
                if (res.data.watched) {
                    setSelected('watched');
                } else if (res.data.wantToWatch) {
                    setSelected('wantToWatch')
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchBackdropImage();
    }, []);

    useEffect(() => {
        const fetchBackdropImage = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/getProducers?idMovie=${idMovie}`);
                setMovieProducers(res.data.names);
                setMovieProducersImage(res.data.logos);
            } catch (err) {
            }
        };
        fetchBackdropImage();
    }, []);

    useEffect(() => {
        const fetchTrailer = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/getTrailer?idMovie=${idMovie}`);
                setTrailerKey(res.data);
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
                setShowFullReview(new Array(res.data.results.length).fill(false));
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
                    <div className="flex flex-col items-start overflow-hidden ml-2">
                        <h1 className='text-white text-sm sm:text-4xl font-saira text-left font-bold mr-4 sm:mb-2 sm:ml-0 mb-2'>{title} <span className='text-sm sm:text-3xl font-normal font-inter mr-2'>({year})</span> <span className='text-2xl sm:text-3xl xl:inline sm:block hidden'>Directed By </span> <span className='text-2xl sm:text-3xl font-normal font-inter xl:inline sm:block hidden'>{movie.movie.movieInfo.director}</span></h1>
                        <p className='text-white text-sm font-inter mr-4 text-left sm:text-xl sm:mb-2 sm:ml-0 mb-2'>{genresName.join(', ')}</p>
                        <p className='text-white text-sm sm:text-xl font-inter sm:ml-0'>{movie.movie.movieInfo.runtime} mins</p>
                        <p className='text-white font-inter text-sm mb-0 sm:hidden block'>Directed By</p>
                        <p className='text-white font-inter font-bold text-sm sm:hidden block'>{movie.movie.movieInfo.director}</p>
                        <p className='text-white text-xs mr-8 text-justify sm:hidden block'>{movie.movie.movieInfo.overview}</p>
                        <div className="sm:hidden block">
                            <h1 className='text-white font-saira font-bold text-lg sm:text-4xl mt-6'>Cast</h1>
                            <Slider {...settings} className='w-64'>
                                {cast && cast.map((actor, index) => (
                                    <div key={index}>
                                        <CardActor actor={actor} />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                        <div className='block sm:hidden bg-gradient-to-b from-slate-700 to-slate-900 mt-6 rounded-md w-full'>
                            <h2 className='text-white text-sm xl:text-2xl font-inter pt-2'>Producers</h2>
                            <div className='bg-slate-700 pb-2 pt-3 mt-2 w-full sm:w-[22rem] '>
                                {movieProducers && movieProducers.map((producer, index) => (
                                    <div key={index} className='flex items-center justify-start ml-4 mb-3 pr-2 sm:pr-0'>
                                        <img src={`https://image.tmdb.org/t/p/w500/${movieProducersImage[index]}`} alt={producer.name} className='w-5 h-5 sm:w-28 sm:h-auto mr-2 rounded' />
                                        <p className='text-white text-xs xl:text-base text-start font-inter mb-0 ml-3'>{producer}</p>
                                    </div>
                                ))}
                            </div>
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
                            <div className='flex flex-col items-center'>
                                <div className='w-full sm:w-[22rem] text-center bg-gradient-to-b from-slate-700 to-slate-900 mb-0 rounded'>
                                    <h2 className='text-white text-sm xl:text-2xl py-2'>Where to watch?</h2>
                                    <div className='bg-slate-800 pb-2 pt-3 mt-2'>
                                        {movieProviders && movieProviders.filter((value, index, self) => self.indexOf(value) === index).map((provider, index) => (
                                            <div key={index} className='flex items-center text-start ml-4 mb-3 pr-2 sm:pr-0'>
                                                <img src={`https://image.tmdb.org/t/p/w500${movieProvidersImage[index]}`} alt={provider} className='w-5 h-5 sm:w-8 sm:h-8 mr-2 rounded' />
                                                <p className='text-white text-xs xl:text-xl font-inter mb-0'>{provider}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='w-full sm:w-[22rem] flex sm:flex-row justify-between mb-0 mt-4 sm:mt-10 rounded'>
                                    <div
                                        className={`w-full sm:w-1/2 rounded-tl-md sm:pt-2 cursor-pointer ${selected === 'watched' ? 'bg-green-600' : 'bg-slate-700'}`}
                                        onClick={() => handleListClick('watched')}
                                    >
                                        <div className="flex flex-col items-center">
                                            <FaEye className="text-white cursor-pointer" size={isSmallScreen ? 30 : 48} />
                                            <p className='hidden sm:block text-white text-sm font-inter mt-2'>Watched</p>
                                        </div>
                                    </div>
                                    <div
                                        className={`w-full sm:w-1/2 rounded-tr-md sm:pt-2 cursor-pointer border-l-2 border-slate-800 ${selected === 'wantToWatch' ? 'bg-indigo-600' : 'bg-slate-700'}`}
                                        onClick={() => handleListClick('wantToWatch')}
                                    >
                                        <div className="flex flex-col items-center">
                                            <RiFileList2Fill className="text-white cursor-pointer" size={isSmallScreen ? 30 : 48} />
                                            <p className='hidden sm:block text-white text-sm font-inter mt-2'>Want to Watch</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full justify-center sm:justify-start sm:w-[22rem] bg-slate-700 rounded-b-md flex items-center border-t-2 border-slate-800 pl-0 sm:pl-4'>
                                    <CiHeart className="text-white cursor-pointer" size={isSmallScreen ? 30 : 48} />
                                    <p className='hidden sm:block text-white text-sm font-inter ml-2 mb-0 py-6'>Add to Favorite</p>
                                </div>
                            </div>
                            <div className='hidden sm:block bg-gradient-to-b from-slate-700 to-slate-900 mt-10 rounded-md '>
                                <h2 className='text-white text-sm xl:text-2xl font-inter pt-2'>Producers</h2>
                                <div className='bg-slate-700 pb-2 pt-3 mt-2 w-full sm:w-[22rem] '>
                                    {movieProducers && movieProducers.map((producer, index) => (
                                        <div key={index} className='flex items-center justify-start ml-4 mb-3 pr-2 sm:pr-0'>
                                            <img src={`https://image.tmdb.org/t/p/w500/${movieProducersImage[index]}`} alt={producer.name} className='w-5 h-5 sm:w-28 sm:h-auto mr-2 rounded' />
                                            <p className='text-white text-xs xl:text-base text-start font-inter mb-0 ml-3'>{producer}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="text-left sm:block hidden ml-12 2xl:ml-20">
                            <h2 className='text-white font-saira font-bold'>Synopsis</h2>
                            <p className='text-white text-2xl font-inter pr-28 text-justify w-full'>{movie.movie.movieInfo.overview}</p>
                            <div className="mt-10">
                                <div className='h-[100px] md:h-[400px] md:w-[830px] 2xl:h-[600px] 2xl:w-[1220px]'>
                                    <iframe
                                        width="1200"
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
                <div className="pt-10 w-full sm:ml-auto sm:w-[52rem] sm:mr-6 2xl:w-[78rem] 2xl:mr-24">
                    <div className='flex justify-between items-center border-b border-white'>
                        <h1 className='text-white font-saira font-bold text-lg sm:text-4xl'>Reviews</h1>
                        <h1 className='text-white font-saira font-bold text-lg sm:text-4xl'>{movieReviews.length}</h1>
                    </div>
                    <div className='grid grid-cols-1 pt-2'>
                        {movieReviews && movieReviews.slice(0, showReviews).map((review, index) => (
                            <div key={index} className='p-4 text-black mb-4 flex relative'>
                                <img src={review.author_details.avatar_path ? `https://image.tmdb.org/t/p/w500/${review.author_details.avatar_path}` : '/profile.jpg'} alt={review.author} className='mr-4 w-12 h-12 rounded-full' />
                                <div className='pb-4'>
                                    <div className='flex items-center mb-6'>
                                        <h2 className='text-2xl text-white font-inter font-thin'><span className='font-inter font-bold'>By</span> {review.author}</h2>
                                    </div>
                                    <p className='text-lg text-white text-justify'>
                                        {showFullReview[index] || review.content.length <= 200 ? review.content : review.content.substring(0, 200) + "..."}
                                    </p>
                                    {review.content.length > 200 && (
                                        <button onClick={() => setShowFullReview(prev => {
                                            const newShowFullReview = [...prev];
                                            newShowFullReview[index] = !newShowFullReview[index];
                                            return newShowFullReview;
                                        })} className='text-white bg-purple-800 px-2 py-2 rounded-lg'>{showFullReview[index] ? 'See less' : 'See more'}</button>
                                    )}
                                </div>
                                <div className='absolute inset-x-0 bottom-0 border-b border-white'></div>
                            </div>
                        ))}
                        {movieReviews && movieReviews.length > showReviews && (
                            <div className="flex justify-center mt-4">
                                <button onClick={() => setShowReviews(showReviews + 3)} className={`bg-purple-700 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded ${isClicked ? 'mt-2' : 'border-b-8 border-purple-900 hover:border-purple-700'}`}>Show more</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MovieInfo2