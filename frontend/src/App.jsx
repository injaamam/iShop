import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import ProductSpecificationPage from "./pages/ProductSpecificationPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:category" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductSpecificationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
