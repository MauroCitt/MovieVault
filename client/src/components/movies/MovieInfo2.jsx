import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import starImage from '../../images/estrella.png';

const MovieInfo2 = () => {
    const { state } = useLocation();
    const [movieReviews, setMovieReviews] = useState([]);
    const [backdropImage, setBackdropImage] = useState('');
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

    const urlImage = `https://image.tmdb.org/t/p/original${backdropImage}`;

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
        <div className="absolute inset-0 backdrop-filter" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}></div>
        <div className="absolute left-2 md:bottom-52 md:left-32 md:flex-1 bg-slate-800 mt-3 font-inter md:bg-transparent md:mt-0 hidden md:block">
            <h1 className='text-white md:text-7xl font-saira md:font-bold'>{title}</h1>
        </div>
    </div>
    <div className="flex flex-col items-start mt-3 sm:mt-0 px-10">
    <h1 className='text-white sm:text-xs md:text-5xl font-inter font-bold'>{title} <span className='sm:text-sm md:text-4xl font-normal font-inter'>({year})</span> &nbsp; <span className='text-4xl'>Directed By </span> <span className='text-4xl font-normal'>{movie.movie.movieInfo.director}</span></h1>
        <img
            src={`https://image.tmdb.org/t/p/w500/${movie.moviePath}`}
            alt={`Movie Poster`}
            className="transition ease-in-out duration-150 w-full sm:w-auto h-auto sm:h-64 mt-3"
        />
    </div>
</div>
    )
}

export default MovieInfo2