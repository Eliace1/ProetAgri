import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Products from "./components/products";
import Footer from "./components/footer";
import Login from "./components/login";
import Marketplace from "./pages/Marketplace";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Orders from "./pages/Orders";
import ProtectedRoute from "./components/ProtectedRoute";
import ClientDashboard from "./pages/ClientDashboard";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";

import "./index.css";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Accueil */}
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

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/inscription"
          element={
            <>
              <Register />
              <Footer />
            </>
          }
        />

        {/* Pages simples */}
        <Route
          path="/apropos"
          element={
            <>
              <About />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Contact />
              <Footer />
            </>
          }
        />

        {/* Marché */}
        <Route path="/marche" element={<Marketplace />} />

        {/* Commandes (protégé) */}
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

        {/* Checkout (protégé) */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <>
                <Checkout />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        {/* Paiement (protégé) */}
        <Route
          path="/paiement"
          element={
            <ProtectedRoute>
              <>
                <Payment />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        {/* Dashboard acheteur (protégé) */}
        <Route
          path="/client"
          element={
            <ProtectedRoute>
              <>
                <ClientDashboard />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}
