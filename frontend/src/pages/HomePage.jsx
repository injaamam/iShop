import { Link } from "react-router-dom";

const categories = [
  "monitor",
  "smart-watch",
  "pen-drive",
  "earbuds",
  "gaming-chair",
  "headphone",
  "speaker-and-home-theater",
  "keyboard",
  "gaming-console",
  "stylus",
  "server",
  "laptop",
  "mobile-phone-charger-adapter",
  "tablet-pc",
  "mouse",
  "camera",
];

function HomePage() {
  return (
    <div>
      {categories.map((cat) => (
        <Link key={cat} to={`/${cat}`}>
          {cat}
        </Link>
      ))}
    </div>
  );
}

export default HomePage;
