import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import ProductSpecificationPage from "./pages/ProductSpecificationPage.jsx";
import NotFoundPage from "./components/notFoundPage.jsx";
import Header from "./components/Header.jsx";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:category" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductSpecificationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
