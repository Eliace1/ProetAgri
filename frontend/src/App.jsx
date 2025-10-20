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
import ProfileSettings from "./pages/ProfileSettings";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";

import "./index.css";
import ProfilAgriculteur from "./pages/ProfilAgriculteur";


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
        <Route path="/marche" element={<ProtectedRoute onlyCustomer={true}>
              <>
                <Marketplace />
                <Footer />
              </>
            </ProtectedRoute>} />

        {/* Commandes (protégé) */}
        <Route
          path="/commandes"
          element={
            <ProtectedRoute onlyCustomer={true}>
              <>
                <Orders />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agriculteur"
          element={
            <ProtectedRoute onlyFarmer={true}>
              <>
                <ProfilAgriculteur />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        {/* Checkout (protégé) */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute onlyCustomer={true}>
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
            <ProtectedRoute onlyCustomer={true}>
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
            <ProtectedRoute onlyCustomer={true}>
              <>
                <ClientDashboard />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        {/* Paramètres du profil (protégé) */}
        <Route
          path="/profil"
          element={
            <ProtectedRoute onlyCustomer={true}>
              <>
                <ProfileSettings />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}
