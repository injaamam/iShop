const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";

export async function getCategories() {
  const categories = await axios.get(`${BACKEND_URL}/categories`);
  return categories.data;
}

// export const categories = [
//   "monitor",
//   "smart-watch",
//   "pen-drive",
//   "earbuds",
//   "gaming-chair",
//   "headphone",
//   "speaker-and-home-theater",
//   "keyboard",
//   "gaming-console",
//   "stylus",
//   "server",
//   "laptop",
//   "mobile-phone-charger-adapter",
//   "tablet-pc",
//   "mouse",
//   "camera",
// ];
