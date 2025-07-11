import { Link } from "react-router-dom";
import { categories } from "../constant/categories";

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
