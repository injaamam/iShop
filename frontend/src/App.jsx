import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import HomePage from "./pages/HomePage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import ProductSpecificationPage from "./pages/ProductSpecificationPage.jsx";
import NotFoundPage from "./components/notFoundPage.jsx";
import Header from "./components/Header.jsx";

function App() {
  const [filterOpen, setFilterOpen] = useState(false);
  return (
    <BrowserRouter>
      <Header filterOpen={filterOpen} setFilterOpen={setFilterOpen} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/category/:category"
          element={
            <ProductPage
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
            />
          }
        />
        <Route path="/product/:id" element={<ProductSpecificationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
