import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const ListsTab = (props) => {

    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const [watchedList, setWatchedList] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showMovieInfo, setShowMovieInfo] = useState(false);

    const email = localStorage.getItem('email');
    const navigate = useNavigate();
    const itemsPerPage = 6;
    let movieImagePhoto;



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
        const movieImage = watchedList.find(m => m.id === idMovie);
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


    useEffect(() => {
        const fetchListData = async () => {
            let res = await axios.get('http://localhost:4000/getMovieList', {
                params: {
                    email: email,
                    page: currentPage
                },
                withCredentials: true
            });

            if(props.activeTab === 0){
                setWatchedList(res.data.watched);
                setTotalPages(Math.ceil(res.data.totalWatchedMovies / itemsPerPage));
                console.log(res.data.watched);
            } else{
                setWatchedList(res.data.wantToWatch);
            }
        };

        fetchListData();
    }, [currentPage, props.activeTab]);


    return (
        <div className='ml-40 mr-40'>
            <ul className="flex flex-wrap justify-start">
                {watchedList.map((movie, index) => (
                    <li key={index} className="w-full sm:w-1/3 p-2 mt-4">
                        <img
                            src={`https://image.tmdb.org/t/p/w500/${movie.release_date}`}
                            alt={`Movie Poster`}
                            className="w-full md:w-3/4 lg:w-1/2 xl:w-[15rem] cursor-pointer hover:opacity-60 transition ease-in-out duration-150 mb-2"
                            onClick={() => handleImageClick(movie)}
                        />
                        <p className='text-white text-start font-inter mb-0 font-bold'>{movie.title}</p>
                        <p className='text-white text-start text-sm font-inter'>{movie.director}</p>
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
    )
}

export default ListsTab