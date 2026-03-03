import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../constant/getCategories.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import axios from "axios";
import "swiper/css";
import "swiper/css/pagination";
import {
  MdMonitor,
  MdCarpenter,
  MdWatch,
  MdHeadphones,
  MdEventSeat,
  MdKeyboard,
  MdVideogameAsset,
  MdEdit,
  MdLaptop,
  MdPower,
  MdTablet,
  MdMouse,
  MdCamera,
  MdSpeaker,
} from "react-icons/md";
import { BsEarbuds } from "react-icons/bs";
import { PiDesktopTowerBold } from "react-icons/pi";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function HomePage() {
  const [categories, setCategories] = useState([]);

  // Function to get icon for category
  const getIconForCategory = (cat) => {
    const iconProps = { size: 32 };
    const iconMap = {
      monitor: <MdMonitor {...iconProps} />,
      "pen-drive": <MdCarpenter {...iconProps} />,
      "smart-watch": <MdWatch {...iconProps} />,
      earbuds: <BsEarbuds {...iconProps} />,
      "gaming-chair": <MdEventSeat {...iconProps} />,
      headphone: <MdHeadphones {...iconProps} />,
      "speaker-and-home-theater": <MdSpeaker {...iconProps} />,
      keyboard: <MdKeyboard {...iconProps} />,
      "gaming-console": <MdVideogameAsset {...iconProps} />,
      stylus: <MdEdit {...iconProps} />,
      server: <PiDesktopTowerBold {...iconProps} />,
      laptop: <MdLaptop {...iconProps} />,
      "mobile-phone-charger-adapter": <MdPower {...iconProps} />,
      "tablet-pc": <MdTablet {...iconProps} />,
      mouse: <MdMouse {...iconProps} />,
      camera: <MdCamera {...iconProps} />,
    };
    return iconMap[cat] || <MdCarpenter {...iconProps} />;
  };

  useEffect(() => {
    getCategories().then((data) => setCategories(data));

    // Hit backend test route
    const hitBackend = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/test`);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    hitBackend();
  }, []);

  return (
    <div className="mx-5 md:mx-8 lg:mx-15 2xl:mx-25 3xl:mx-40 pt-21 md:pt-3 mb-10">
      <div className="flex flex-col md:flex-row items-stretch gap-1 md:gap-[1%] w-full">
        {/* Image Carousel Section */}
        {/* left column section */}
        <div className="md:w-[75.5%]">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{
              delay: 5000,
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
        {/* right column section */}
        <div className="flex flex-row md:flex-col md:w-[23.5%] justify-between gap-[1%] md:gap-0">
          <img
            src="/Homepage/x.webp"
            alt="Image"
            className="h-auto object-contain w-[49%] md:w-full"
          />
          <img
            src="/Homepage/y.webp"
            alt="Image"
            className="h-auto object-contain w-[49%] md:w-full"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-10">
        <h2 className="text-xl font-semibold text-center text-black-900">Featured Category</h2>
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
              className="flex flex-col items-center justify-center h-24 rounded-xl text-center p-2 bg-white shadow-sm hover:shadow-lg hover:bg-gray-50 transition"
            >
              <div className="text-gray-700 mb-1">
                {getIconForCategory(cat)}
              </div>
              <span className="text-xs font-medium text-black-800 break-words capitalize">
                {cat.replace(/-/g, " ")}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
