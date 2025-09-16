import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';

const Homepage = () => {
    const [data, setData] = useState({
        title: "Connecter agriculteurs et acheteurs",
        description: "FarmLink est votre marché en ligne dédié aux produits agricoles frais et locaux. Découvrez une large gamme de produits, soutenez les fermes de votre région et savourez la qualité."
    });

    // Exemple d'appel API (optionnel)
    useEffect(() => {
        // Vous pouvez faire un appel API ici si nécessaire
        // axios.get('/api/homepage-data')
        //     .then(response => setData(response.data))
        //     .catch(error => console.error('Erreur API:', error));
    }, []);

    return (
        <div className="homepage">
            <Header />
            <HeroSection data={data} />
        </div>
    );
};

export default Homepage;