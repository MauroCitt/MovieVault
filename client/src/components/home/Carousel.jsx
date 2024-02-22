import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules"
import { ColorRing } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';


import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Carousel = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [movieImages, setMovieImages] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showMovieInfo, setShowMovieInfo] = useState(false);
    
    const navigate = useNavigate();
    let movieImagePhoto;



    useEffect(() => {
        const fetchMovieImages = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/getTwelveMovies`);
                setMovieImages(res.data);
                setIsLoading(false);
            } catch (err) {
                console.log(err);
            }
        }
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

    const handleImageClick = async (movie) => {
        let idMovie = movie.id;

        const movieInfo = await getFromDatabase(idMovie);
        const movieImage = movieImages.find(m => m.id === idMovie);
        if (movieImage) {
            movieImagePhoto = movieImage.imagePath;
        }

        if (movieInfo) {
            navigate(`/movieInfo/${movieInfo.movieInfo.title}`, { state: { movie: movieInfo, moviePath: movieImagePhoto } });
            setSelectedMovie(movie);
            setShowMovieInfo(true);
        } else {
            console.error('Failed to fetch movie info');
        }
    };

    const getFromDatabase = async (idMovie) => {
        try {
            const res = await axios.get(`http://localhost:4000/getInfo?idMovie=${idMovie}`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="container bg-slate-800 mt-4">
            <h1 className="heading text-white font-saira-600">
                ¿No sabes qué ver?
            </h1>
            <h2 className="text-white font-inter mb-10">
                Revisa la bóveda con las mejores películas
            </h2>
            <Swiper
                effect={'coverflow'}
                grabCursor={false}
                centeredSlide={true}
                loop={movieImages.length > 3}
                initialSlide={0}
                slidesPerView={3}
                slidesPerColumn={1}
                coverflowEffect={
                    {
                        rotate: 0,
                        stretch: 0,
                        depth: 80,
                        modifier: 2.5,
                    }}
                pagination={{ el: '.swiper-pagination', clickable: true }}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                    clickable: true,
                }}
                modules={[EffectCoverflow, Pagination, Navigation]}
                className="swiper_container"
            >
                {movieImages.map((movie, index) => (
                    <SwiperSlide key={index}>
                        <img src={`https://image.tmdb.org/t/p/w500/${movie.imagePath}`} alt='' onClick={()  => handleImageClick(movie)} style={{ cursor: 'pointer' }} />
                    </SwiperSlide>
                ))}
                <div className="slider-controler">
                    <div className="swiper-button-prev slider-arrow mr-40">
                        <ion-icon name="arrow-back-outline"></ion-icon>
                    </div>
                    <div className="swiper-button-next slider-arrow ml-40">
                        <ion-icon name="arrow-forward-outline"></ion-icon>
                    </div>
                    <div className="swiper-pagination"></div>
                </div>
            </Swiper>
        </div>
    )
}

export default Carousel