import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Footer from "./components/Footer";
import Login from "./components/Login"; 
import Marketplace from "./pages/Marketplace"; // 👈 importe ta page
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Orders from "./pages/Orders";
import ProtectedRoute from "./components/ProtectedRoute";

import "./index.css";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Page d'accueil */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Categories />
              <Products />
              <Footer />
            </>
          }
        />

        {/* Page login */}
        <Route path="/login" element={<Login />} />
        {/* Page inscription */}
        <Route
          path="/inscription"
          element={
            <>
              <Register />
              <Footer />
            </>
          }
        />

        {/* Page À Propos */}
        <Route
          path="/apropos"
          element={
            <>
              <About />
              <Footer />
            </>
          }
        />

        {/* Page Contact */}
        <Route
          path="/contact"
          element={
            <>
              <Contact />
              <Footer />
            </>
          }
        />

        {/* ✅ Nouvelle route Marché */}
        <Route path="/marche" element={<Marketplace />} />

        {/* Page Commandes (protégée) */}
        <Route
          path="/commandes"
          element={
            <ProtectedRoute>
              <>
                <Orders />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
