import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { isLoggedIn } from '../lib/auth';
import '../assets/Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="header">
            <div className="container">
                <div className="nav-brand">
                    <span className="logo">🌿</span>
                    <span className="brand-name">FarmLink</span>
                </div>
                
                <nav className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
                    <Link to="/" className="nav-link">Accueil</Link>
                    <Link to="/marche" className="nav-link">Marché</Link>
                    <a href="#" className="nav-link">Communauté</a>
                </nav>
                
                {!isLoggedIn() && (
                    <div className="nav-actions">
                        <Link to="/login" className="nav-link">Se connecter</Link>
                        <Link to="/inscription" className="btn btn-primary">S'inscrire</Link>
                    </div>
                )}

                <button 
                    className="mobile-menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    ☰
                </button>
            </div>
        </header>
    );
};

export default Header;
