import React from 'react';
import NavbarHome from '../components/Navbar';
import '../styles/Profile.css';
import Carousel from '../components/home/Carousel'
import Tabs from '../components/home/Tabs'

const Home = (props) => {


    return (
        <div className='bg-slate-800 h-full'>
            <Carousel />
            <div className='mb-10 mt-10 bg-slate-900'>
                <Tabs />
            </div>
        </div>
    );
}

export default Home;
