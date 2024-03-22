import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ColorRing } from 'react-loader-spinner';
import MovieInfo from '../../movies/MovieInfo';
import { useNavigate } from 'react-router-dom';

const Streaming = (props) => {
    const [movieImages, setMovieImages] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);


    let movieImagePhoto;
    let email = localStorage.getItem('email');

    const navigate = useNavigate();
    const [showMovieInfo, setShowMovieInfo] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const currentItems = movieImages.slice(firstItemIndex, lastItemIndex);

    useEffect(() => {
        let streamingPlatform = "";

        switch (props.activeTab) {
            case 0:
                streamingPlatform = "Netflix";
                break;
            case 1:
                streamingPlatform = "Amazon Prime Video";
                break;
            case 2:
                streamingPlatform = "HBO Max";
                break;
            case 3:
                streamingPlatform = "Filmin";
                break;
            case 4:
                streamingPlatform = "All";
                break;
            case 5:
                streamingPlatform = "Disney Plus";
                break;
            default:
                streamingPlatform = "";
                break;
        }

        const fetchMovieImages = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/streamingService?page=${currentPage}&streamingPlatform=${streamingPlatform}&genre=${props.selectedGenre}`);
                setMovieImages(res.data.movies);
                setTotalPages(Math.ceil(res.data.totalMovies / itemsPerPage));
                setIsLoading(false);
            } catch (err) {
                console.log(err);
            }
        };

        const fetchMovieImagesSearch = async () => {
            try {
                console.log("fetchMovieImagesSearch")
                const res = await axios.get(`http://localhost:4000/searchQuery?query=${props.savedInput}&page=${currentPage}&streamingPlatform=${streamingPlatform}&genre=${props.selectedGenre}`);
                setMovieImages(res.data.movies);
                props.setQueryItems(res.data.movies.title)
                setTotalPages(Math.ceil(res.data.totalMovies / itemsPerPage));
                setIsLoading(false);
            } catch (err) {
                console.log(err);
            }
        };
        props.isClicked ? fetchMovieImagesSearch() : fetchMovieImages();
    }, [props.isSearching, currentPage, props.activeTab, props.selectedGenre]);


    useEffect(() => {
        setCurrentPage(1);
    }, [props.isClicked]);


    useEffect(() => {
        setCurrentPage(1);
    }, [props.activeTab, props.selectedGenre]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
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
            const res = await axios.get(`http://localhost:4000/getInfo?idMovie=${idMovie}&email=${email}`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }

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
            <div className='flex justify-center mt-5'>
                <button onClick={handlePreviousPage} disabled={currentPage === 1} className='flex items-center justify-center px-3 py-4 h-8 me-3 text-sm font-medium mr-5 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                    Previous
                </button>
                <p className='text-white mt-2'>Page {currentPage} of {totalPages} </p>
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className='flex items-center justify-center px-4 py-4 h-8 text-sm font-medium ml-5 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Streaming;