import React from 'react';
import { Link } from 'react-router-dom';
import { isLoggedIn } from '../lib/auth';
import FarmIllustration from './FarmIllustration';
import '../assets/HeroSection.css';

const HeroSection = ({ data }) => {
    return (
        <main className="hero-section">
            <div className="container">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            {data.title.split(' et ').map((part, index) => (
                                <span key={index}>
                                    {index > 0 && ' et '}
                                    {part}
                                    {index === 0 && <br />}
                                </span>
                            ))}
                        </h1>
                        <p className="hero-description">
                            {data.description}
                        </p>
                        {!isLoggedIn() && (
                            <div className="hero-actions">
                                <Link to="/inscription" className="btn btn-primary btn-lg">
                                    S'inscrire
                                </Link>
                                <Link to="/login" className="btn btn-secondary btn-lg">
                                    Se connecter
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="hero-illustration">
                        <FarmIllustration />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default HeroSection;