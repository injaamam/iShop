import { Search, ShoppingCart, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
let totalItems = 0;

export default function Header() {
  const [click, setClick] = useState(false);
  return (
    <div className="fixed md:relative w-full flex justify-around md:justify-center items-center gap-5 py-3 bg-[#081621] z-100 h-18">
      <Link to="/">
        <img src="/startech.png" className="h-12" />
      </Link>
      <button className="md:hidden" onClick={() => setClick((open) => !open)}>
        <Search stroke="white" />
      </button>
      <div
        className={`${
          click ? "absolute top-18" : "hidden"
        } md:static md:block w-full md:w-60 lg:w-110`}
      >
        <form className="flex items-center border md:rounded-md bg-white w-full">
          <div className="flex justify-between items-center w-full">
            <input
              type="text"
              placeholder="Search"
              className="px-2 py-1 w-full md:w-50 lg:w-100 h-9"
            />
            <button type="submit" className="pr-4">
              <Search />
            </button>
          </div>
        </form>
      </div>
      <div className="flex gap-1 scale-140 md:scale-110">
        <UserRound fill="#EF4A23" />
        <h1 className="text-white font-semibold hidden md:inline">Account</h1>
      </div>
      <div className="fixed right-8 bottom-5 bg-[#081621] h-10 w-10 flex justify-center items-center border rounded scale-125 z-50">
        <ShoppingCart stroke="white" />
        <span className="absolute -top-4 -right-3 bg-[#EF4A23] text-white text-sm rounded-full px-1.5 py-0.5">
          {totalItems}
        </span>
      </div>
    </div>
  );
}
