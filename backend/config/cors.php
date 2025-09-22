<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',      // Vite dev server
        'http://localhost:3000',      // Alternative React dev server
        'http://127.0.0.1:5173',      // Vite dev server (127.0.0.1)
        'http://127.0.0.1:3000',      // Alternative React dev server
        'http://localhost:8080',      // Alternative frontend port
        'https://your-production-domain.com', // Votre domaine de production
    ],

    'allowed_origins_patterns' => [
        // Permettre tous les sous-domaines localhost pour le développement
        'http://localhost:*',
        'http://127.0.0.1:*',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];