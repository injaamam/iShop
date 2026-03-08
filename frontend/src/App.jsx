import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/HomePage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import ProductSpecificationPage from "./pages/ProductSpecificationPage.jsx";
import FeatureUnavailablePage from "./pages/FeatureUnavailablePage.jsx";
import SearchResultsPage from "./pages/SearchResultsPage.jsx";
import NotFoundPage from "./components/notFoundPage.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <div className="mt-16 md:mt-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/category/:category" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductSpecificationPage />} />
          <Route
            path="/feature-unavailable"
            element={<FeatureUnavailablePage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
