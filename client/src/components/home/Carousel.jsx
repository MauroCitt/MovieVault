import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules"

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


import slide_image_1 from '../../images/shawshank.jpg'
import slide_image_2 from '../../images/Sing_Street.jpg'
import slide_image_3 from '../../images/theBoyAndTheHeron.jpg'
import slide_image_4 from '../../images/TheNiceGuys.jpg'
import slide_image_5 from '../../images/ThePerksOfBeingAWallflowe.jpg'
import slide_image_6 from '../../images/climax.jpg'
import slide_image_7 from '../../images/PerfectBlue.jpg'

const carousel = () => {
    return (
        <div className="container bg-slate-800 mt-4">
            <h1 className="heading text-white font-saira-600">
                ¿No sabes qué ver?
            </h1>
            <h2 className="text-white font-inter mb-10">
                Revisa la bóveda con las mejores películas
            </h2>
            <Swiper
                effect={'coverflow'}
                grabCursor={false}
                centeredSlide={true}
                loop={true}
                slidesPerView={3}
                coverflowEffect={
                    {
                        rotate: 0,
                        stretch: 0,
                        depth: 80,
                        modifier: 2.5,
                    }}
                pagination={{ el: '.swiper-pagination', clickable: true }}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                    clickable: true,
                }}
                modules={[EffectCoverflow, Pagination, Navigation]}
                className="swiper_container"
            >

                <SwiperSlide >
                    <img src={slide_image_1} alt='' />
                </SwiperSlide>

                <SwiperSlide>
                    <img src={slide_image_2} alt='' />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={slide_image_3} alt='' />
                </SwiperSlide>

                <SwiperSlide>
                    <img src={slide_image_4} alt='' />
                </SwiperSlide>

                <SwiperSlide>
                    <img src={slide_image_5} alt='' />
                </SwiperSlide>

                <SwiperSlide>
                    <img src={slide_image_6} alt='' />
                </SwiperSlide>

                <SwiperSlide>
                    <img src={slide_image_7} alt='' />
                </SwiperSlide>

                <div className="slider-controler">
                    <div className="swiper-button-prev slider-arrow mr-40">
                        <ion-icon name="arrow-back-outline"></ion-icon>
                    </div>
                    <div className="swiper-button-next slider-arrow ml-40">
                        <ion-icon name="arrow-forward-outline"></ion-icon>
                    </div>
                    <div className="swiper-pagination mt-20"></div>
                </div>
            </Swiper>
        </div>
    )
}

export default carousel