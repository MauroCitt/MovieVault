import React from 'react';
import NavbarHome from '../components/Navbar';
import '../styles/Profile.css';
import MovieInfo from '../components/movies/MovieInfo';


const Info = (props) => {

    return (
        <div className='bg-slate-800'>
            <MovieInfo />
        </div>
    );
}

export default Info;
