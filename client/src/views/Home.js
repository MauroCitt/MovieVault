import React from 'react';
import NavbarHome from '../components/Navbar';
import MoviePoster from '../components/movies/MoviePoster';
import '../styles/Profile.css';

const Home = (props) => {


    return (
        <div>
            <NavbarHome />
            <MoviePoster />
        </div>
    );
}

export default Home;
