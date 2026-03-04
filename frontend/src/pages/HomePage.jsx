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
  MdSearch,
  MdReportProblem,
  MdHomeRepairService,
  MdBuild,
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
    <div className="mx-5 md:mx-8 lg:mx-15 2xl:mx-30 3xl:mx-40 pt-21 md:pt-3 mb-10">
      {/* Image section */}
      <div className="flex flex-col md:flex-row items-stretch gap-1 md:gap-[1%] w-full">
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

      {/* marquee section */}
      <div className="flex items-center bg-white h-10 mt-6 rounded-2xl">
        <marquee behavior="scroll" direction="left" className="text-center text-slate-700 text-sm">Today, All our branches are open including Multiplan & Elephant Road branches. Additionally, our online activities are open and operational.</marquee>
      </div>

      {/* Service highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
        <div className="bg-white rounded-md shadow-sm p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
            <MdSearch size={24} />
          </div>
          <div className="leading-tight">
            <h3 className="font-semibold text-slate-900">Laptop Finder</h3>
            <p className="hidden lg:block text-sm text-slate-500">
              Find Your Laptop Easily
            </p>
          </div>
        </div>

        <div className="bg-white rounded-md shadow-sm p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
            <MdReportProblem size={24} />
          </div>
          <div className="leading-tight">
            <h3 className="font-semibold text-slate-900">Raise a Complain</h3>
            <p className="hidden lg:block text-sm text-slate-500">
              Share your experience
            </p>
          </div>
        </div>

        <div className="bg-white rounded-md shadow-sm p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
            <MdHomeRepairService size={24} />
          </div>
          <div className="leading-tight">
            <h3 className="font-semibold text-slate-900">Home Service</h3>
            <p className="hidden lg:block text-sm text-slate-500">
              Get expert help.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-md shadow-sm p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
            <MdBuild size={24} />
          </div>
          <div className="leading-tight">
            <h3 className="font-semibold text-slate-900">Servicing Center</h3>
            <p className="hidden lg:block text-sm text-slate-500">
              Repair Your Device
            </p>
          </div>
        </div>
      </div>

      {/* Featured Category section */}
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
