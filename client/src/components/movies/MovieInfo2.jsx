import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import starImage from '../../images/estrella.png';

const MovieInfo2 = () => {
    const { state } = useLocation();
    const [movieReviews, setMovieReviews] = useState([]);
    const [backdropImage, setBackdropImage] = useState('');
    const [urlImage, setUrlImage] = useState(`https://image.tmdb.org/t/p/w780${backdropImage}`);

    const navigate = useNavigate();


    const movie = state;
    const idMovie = movie.movie.movieInfo.id;

    useEffect(() => {
        const fetchBackdropImage = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/getInfo?idMovie=${idMovie}`);
                console.log(res.data)
                setBackdropImage(res.data.backdropPath);
            } catch (err) {
            }
        };
        fetchBackdropImage();
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
                console.log(res.data);
                setMovieReviews(res.data.results);
            } catch (err) {
            }
        };
        fetchMovieImages();
    }, []);


    let title = movie.movie.movieInfo.title;
    console.log(title)
    let fontSize = 'text-5xl';
    let genresName = movie.movie.genresName;
    console.log(genresName)

    let formatVote = movie.movie.movieInfo.vote_average;
    formatVote = parseFloat(formatVote.toFixed(1));

    if (title.length > 25) {
        fontSize = 'text-3xl';
    } else if (title.length > 30) {
        fontSize = 'text-2xl';
    } else if (title.length > 40) {
        fontSize = 'text-xl'
    }

    return (
        <div className="relative bg-slate-900">
            <div className="relative h-64 sm:h-96 md:h-[75vh] bg-cover bg-top" style={{ backgroundImage: `url(${urlImage})`, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="absolute inset-0 backdrop-filter sm:block hidden" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}></div>
                <div className="absolute left-2 md:bottom-36 md:left-32 md:flex-1 bg-slate-800 mt-3 font-inter md:bg-transparent md:mt-0 hidden md:block">
                    <h1 className='text-white md:text-7xl font-saira md:font-bold'>{title}</h1>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col mt-3 sm:mt-0 md:ml-20 px-2">
                <div className="flex md:flex-col sm:flex-row md:items-start justify-between">
                    <div className="flex flex-col items-start overflow-auto pl-2">
                        <h1 className='text-white text-sm sm:text-5xl font-saira text-left font-bold mr-4 sm:mb-2 sm:ml-0 mb-2'>{title} <span className='text-sm sm:text-4xl font-normal font-inter mr-2'>({year})</span> <span className='text-2xl sm:text-4xl xl:inline sm:block hidden'>Directed By </span> <span className='text-2xl sm:text-4xl font-normal font-inter xl:inline sm:block hidden'>{movie.movie.movieInfo.director}</span></h1>
                        <p className='text-white text-sm font-inter mr-4 text-left sm:text-2xl sm:mb-2 sm:ml-0 mb-2'>{genresName.join(', ')}</p>
                        <p className='text-white text-sm sm:text-2xl font-inter sm:ml-0'>{movie.movie.movieInfo.runtime} mins</p>
                        <p className='text-white font-inter text-sm mb-0 sm:hidden block'>Directed By</p>
                        <p className='text-white font-inter font-bold text-sm sm:hidden block'>{movie.movie.movieInfo.director}</p>
                        <p className='text-white text-xs mr-8 text-justify sm:hidden block'>{movie.movie.movieInfo.overview}</p>
                    </div>
                    <div className='md:items-start flex-shrink-0'>
                        <img
                            src={`https://image.tmdb.org/t/p/w500/${movie.moviePath}`}
                            alt={`Movie Poster`}
                            className="transition ease-in-out duration-150 w-36 h-auto ml-auto md:mt-3 sm:w-auto sm:h-64 sm:mr-0 mr-4"
                        />
                        <div className='flex justify-between items-center border-b border-white sm:mr-0 mr-4'>
                            <h2 className='text-left text-sm md:text-3xl font-inter text-white mt-4'>Rating</h2>
                            <h2 className='text-right text-sm font-inter md:text-3xl text-white mt-4'>{movie.movie.movieInfo.vote_count}</h2>
                        </div>
                        <div className='flex items-center justify-start pb-10 mt-2'>
                            <img src={starImage} alt='star' className='w-5 h-5 md:w-8 md:h-8 self-center' />
                            <p className='text-white text-sm md:text-3xl ml-1 mb-0 self-center'>{formatVote}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MovieInfo2