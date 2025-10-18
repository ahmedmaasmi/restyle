"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function HeroSlider() {
  const slides = [
    {
      id: 1,
      title: "iPhone 16 Pro Max",
      price: "From $50,769*",
      desc: "All-6 chip, Superfine Increment History. Biggest Price Drop",
      image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aXBob25lfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
      bg: "from-blue-900 to-purple-700",
    },
    {
      id: 2,
      title: "SALE",
      price: "Up to 50% OFF",
      desc: "Grab your favourite fashion & shoes with amazing discounts!",
      image: "https://images.unsplash.com/photo-1509959246013-d2e0f4d0876a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvb2VzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
      bg: "from-cyan-400 to-blue-500",
    },
    {
      id: 3,
      title: "Luxury Watches",
      price: "From $199",
      desc: "Elegant designs for every occasion.",
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
      bg: "from-gray-900 to-gray-700",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto mt-8">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        spaceBetween={30}
        slidesPerView={1.5}
        centeredSlides
        loop
        className="pb-8"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className={`flex items-center justify-between rounded-3xl p-8 text-white bg-gradient-to-r ${slide.bg} shadow-lg`}
            >
              <div className="max-w-md">
                <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
                <p className="text-xl font-semibold mb-3">{slide.price}</p>
                <p className="text-sm text-gray-200 mb-4">{slide.desc}</p>
                <button className="bg-white text-blue-700 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition">
                  Shop Now
                </button>
              </div>
              <img
                src={slide.image}
                alt={slide.title}
                className="w-72 h-56 object-cover rounded-xl"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
