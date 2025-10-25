import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../constant/getCategories.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

function HomePage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then((data) => setCategories(data));
  }, []);

  return (
    <div className="mx-5 md:mx-8 lg:mx-10 pt-21 md:pt-3 mb-10">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Image Carousel Section */}
        <div className="md:w-[75%]">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            className="w-full rounded-lg shadow-lg"
          >
            <SwiperSlide>
              <img
                src="/Homepage/a.webp"
                alt="Carousel 1"
                className="w-full h-auto object-contain"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="/Homepage/b.webp"
                alt="Carousel 2"
                className="w-full h-auto object-contain"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="/Homepage/c.webp"
                alt="Carousel 3"
                className="w-full h-auto object-contain"
              />
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="flex flex-col justify-between md:w-[25%]">
          <img
            src="/Homepage/x.webp"
            alt="Image"
            className="w-full h-auto object-contain"
          />
          <img
            src="/Homepage/y.webp"
            alt="Image"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-10">
        <h2 className="text-xl font-semibold text-center">Featured Category</h2>
        <h3 className="text-md font-medium text-center">
          Get Your Desired Product from Featured Category!
        </h3>
      </div>
      <div className="flex justify-center mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/category/${cat}`}
              className="flex items-center justify-center h-16 border rounded text-center"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
