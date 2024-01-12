import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MovieDetails = () => {
  const [movieImages, setMovieImages] = useState([]);

  useEffect(() => {
    const fetchMovieImages = async () => {
      try {
        const res = await axios.get('http://localhost:4000/home/movies');
        console.log(res.data);
        setMovieImages(res.data.posters);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMovieImages();
  }, []);

  return (
    <div>
      <h2 className="text-white font-serif">Home</h2>
      <ul>
        {movieImages.length > 0 && (
          <li>
            <img
              src={`https://image.tmdb.org/t/p/original${movieImages[0].file_path}`}
              alt={`Movie Poster`}
              style={{ maxWidth: '200px' }} 
            />
          </li>
        )}
      </ul>
    </div>
  );
};

export default MovieDetails;
