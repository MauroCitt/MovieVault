import React from 'react';
import NavbarHome from '../components/Navbar';
import MoviePoster from '../components/movies/MoviePoster';
import '../styles/Profile.css';
import Carousel from '../components/home/Carousel'
import Tabs from '../components/home/Tabs'

const Home = (props) => {


    return (
        <div className='bg-slate-800'>
            <NavbarHome />
            <Carousel />
            <div className='bg-gradient-to-b from-slate-800 to to-slate-900'>
            <Tabs />
            </div>
        </div>
    );
}

export default Home;
