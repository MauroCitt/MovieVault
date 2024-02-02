import React from 'react';
import NavbarHome from '../components/Navbar';
import '../styles/Profile.css';
import Carousel from '../components/home/Carousel'
import Tabs from '../components/home/Tabs'
import MovieInfo from '../components/movies/MovieInfo';

const Home = (props) => {


    return (
        <div className='bg-slate-800'>
            <NavbarHome />
            <MovieInfo />
        </div>
    );
}

export default Home;
