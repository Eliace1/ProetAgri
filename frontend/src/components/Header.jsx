import React, { useState } from 'react';
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
                    <a href="#" className="nav-link">Accueil</a>
                    <a href="#" className="nav-link">Marché</a>
                    <a href="#" className="nav-link">Communauté</a>
                </nav>
                
                <div className="nav-actions">
                    <a href="#" className="nav-link">Se connecter</a>
                    <button className="btn btn-primary">S'inscrire</button>
                </div>

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