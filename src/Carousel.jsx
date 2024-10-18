import React from "react";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "../css/eventCarousel.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/bundle";

export default function Carousel(props) {

    return (
        <>
            <h2 className="section-heading" style={{marginLeft: "-3rem"}}>{props.heading}</h2>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                slidesPerView={1}
                spaceBetween={10}
                breakpoints={{
                    480: {
                        slidesPerView: 2,
                    },
                    720: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                }}
                autoplay={{ delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                centeredSlides={true}
                loop={true}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log('slide change')}
            >
                {props.slides.map((slide, index) => (
                    <SwiperSlide className="card" key={index}>
                        {slide}
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
}