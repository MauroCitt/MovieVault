import React, { useEffect, useState } from 'react'

const CardActor = (props) => {
    const t = props.actor;
    const [imageSize, setImageSize] = useState('w500');

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 2000) {
                setImageSize('w780');
            } else if (window.innerWidth > 1400) {
                setImageSize('w500');
            } else if (window.innerWidth > 800) {
                setImageSize('w342');
            } else {
                setImageSize('w185');
            }
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className='w-28 md:w-48 2xl:w-56 mr-4'>
            <div className='w-28 md:w-48 2xl:w-56 mr-4'>
                <img src={t.profile_path ? `https://image.tmdb.org/t/p/${imageSize}${t.profile_path}` : '/profile.jpg'} alt={t.name} className='w-full h-36 md:h-56 2xl:h-64 object-cover object-top' />
            </div>
            <div className='bg-slate-800 px-2 py-2 mb-4'>
                <h1 className='text-xs md:text-lg text-white mb-1 md:mb-0'>{t.name}</h1>
                <h2 className='text-xs text-neutral-200 font-inter'>{t.character}</h2>
            </div>
        </div>
    )
}

export default CardActor