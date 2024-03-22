import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ColorRing } from 'react-loader-spinner';
import MovieInfo from '../movies/MovieInfo';
import { useNavigate } from 'react-router-dom';

const Discover = () => {
  const [movieImages, setMovieImages] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMovieInfo, setShowMovieInfo] = useState(false);

  
  let movieImagePhoto 
  const navigate = useNavigate();
  const email = localStorage.getItem('email');

  const handleImageClick = async (movie) => {
    let idMovie = movie.id;

    const movieInfo = await getFromDatabase(idMovie);
    console.log(movieInfo);
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
      const res = await axios.get(`http://localhost:4000/getInfo?idMovie=${idMovie}&email=${email}`);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchMovieImages = async () => {
      try {
        const res = await axios.get('http://localhost:4000/discover');
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

  if (selectedMovie) {
    return <MovieInfo movie={selectedMovie} />;
  }

  return (
    <div className='ml-40 mr-40'>
      <ul className="flex flex-wrap justify-around">
        {movieImages.map((movie, index) => (
          <li key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 m-2">
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.imagePath}`}
              alt={`Movie Poster`}
              className="w-full cursor-pointer hover:opacity-60 transition ease-in-out duration-150 mb-8"
              onClick={() => handleImageClick(movie)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Discover;