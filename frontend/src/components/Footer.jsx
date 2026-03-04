import {
  PhoneCall,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-16 bg-[#020b16] text-slate-300">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 pt-10 pb-6">
        {/* top grid */}
        <div className="grid gap-10 md:grid-cols-3">
          {/* support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-[0.2em] text-slate-400 uppercase">
              Support
            </h3>

            <div className="space-y-3">
              <button className="w-full rounded-2xl bg-[#081621] border border-slate-700 px-5 py-4 flex items-center gap-4 text-left hover:border-slate-400 hover:bg-slate-900 transition">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-100">
                  <PhoneCall size={20} />
                </span>
                <span>
                  <span className="block text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    9 AM - 8 PM
                  </span>
                  <span className="block text-xl font-semibold text-white">
                    16000
                  </span>
                </span>
              </button>

              <button className="w-full rounded-2xl bg-[#081621] border border-slate-700 px-5 py-4 flex items-center gap-4 text-left hover:border-slate-400 hover:bg-slate-900 transition">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-100">
                  <MapPin size={20} />
                </span>
                <span>
                  <span className="block text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    Store Locator
                  </span>
                  <span className="block text-base font-semibold text-white">
                    Find Our Stores
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* about us links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-[0.2em] text-slate-400 uppercase">
              About us
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {[
                "Affiliate Program",
                "Online Delivery",
                "Refund and Return Policy",
                "Blog",
                "EMI Terms",
                "Privacy Policy",
                "Star Point Policy",
                "Contact Us",
                "About Us",
                "Terms and Conditions",
                "Career",
                "Brands",
              ].map((item) => (
                <button
                  key={item}
                  className="text-left text-slate-400 hover:text-slate-100 transition text-[13px]"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* stay connected */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-[0.2em] text-slate-400 uppercase">
              Stay connected
            </h3>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-slate-100">Star Tech Ltd</p>
              <p className="text-slate-400">
                Head Office: 28 Kazi Nazrul Islam Ave, Navana Zohura Square,
                Dhaka 1000
              </p>
              <p className="mt-2 text-slate-400">
                Email:{" "}
                <a
                  href="mailto:webteam@startechbd.com"
                  className="text-orange-400 hover:text-orange-300"
                >
                  hello@startechbd.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* divider */}
        <div className="mt-8 border-t border-slate-800 pt-6 space-y-6">
          {/* app row */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-400">
              Experience Star Tech on your mobile:
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-100 hover:bg-slate-900 transition">
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  Download on
                </span>
                <span>Google Play</span>
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-100 hover:bg-slate-900 transition">
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  Download on
                </span>
                <span>App Store</span>
              </button>
            </div>
          </div>

          {/* bottom row */}
          <div className="flex flex-col gap-4 border-t border-slate-800 pt-4 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-slate-500">
              © 2026 Star Tech Ltd | All rights reserved
            </p>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Link
                  to="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                >
                  <MessageCircle size={18} />
                </Link>
                <Link
                  to="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                >
                  <Facebook size={18} />
                </Link>
                <Link
                  to="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                >
                  <Youtube size={18} />
                </Link>
                <Link
                  to="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                >
                  <Instagram size={18} />
                </Link>
              </div>
              <span className="hidden text-[11px] text-slate-500 md:inline">
                Powered by Star Tech
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

