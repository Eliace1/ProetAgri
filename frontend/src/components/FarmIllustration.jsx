import React, { useEffect, useRef } from 'react';
import '../assets/FarmIllustration.css';

const FarmIllustration = () => {
    const farmRef = useRef(null);

    useEffect(() => {
        // Animation simple au chargement
        const farm = farmRef.current;
        if (farm) {
            farm.style.opacity = '0';
            farm.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                farm.style.transition = 'all 1s ease-out';
                farm.style.opacity = '1';
                farm.style.transform = 'translateY(0)';
            }, 300);
        }
    }, []);

    return (
        <div className="farm-scene" ref={farmRef}>
            <div className="farm-base"></div>
            <div className="farm-elements">
                {/* Maisons */}
                <div className="house house-1"></div>
                <div className="house house-2"></div>
                <div className="barn"></div>
                
                {/* Arbres */}
                <div className="trees">
                    <div className="tree tree-1"></div>
                    <div className="tree tree-2"></div>
                    <div className="tree tree-3"></div>
                </div>
                
                {/* Champs */}
                <div className="fields">
                    <div className="field field-1"></div>
                    <div className="field field-2"></div>
                </div>
                
                {/* Personnages et animaux */}
                <div className="farmer"></div>
                <div className="animals">
                    <div className="cow"></div>
                    <div className="sheep"></div>
                </div>
                
                {/* Éléments du paysage */}
                <div className="road"></div>
                <div className="pond"></div>
                
                {/* Nuages animés */}
                <div className="clouds">
                    <div className="cloud cloud-1"></div>
                    <div className="cloud cloud-2"></div>
                </div>
            </div>
        </div>
    );
};

export default FarmIllustration;