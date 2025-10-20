-- Jeu de données agri_connect (hash Laravel $2y$)
-- Exécuter après création du schéma/tables
-- Categories
INSERT INTO agri_connect.categories (name, description) VALUES
('Fruits', 'Produits frais du verger'),
('Légumes', 'Légumes bio de saison'),
('Céréales', 'Produits céréaliers et grains'),
('Produits laitiers', 'Lait, fromage et yaourt'),
('Viande', 'Produits carnés fermiers');

-- Products
INSERT INTO agri_connect.products (name, price, qte, image, description, reduction, user_id, categorie_id)
VALUES
('Pommes bio', 2.50, 200, 'pomme.jpg', 'Pommes rouges du verger', 0, 1, 1),
('Carottes', 1.80, 150, 'carottes.jpg', 'Carottes fraîches', 0.10, 2, 2),
('Lait fermier', 1.20, 300, 'lait.jpg', 'Lait entier frais', 0, 1, 4),
('Farine de maïs', 2.00, 100, 'farine.jpg', 'Farine artisanale', 0.05, 2, 3),
('Poulet fermier', 9.90, 50, 'poulet.jpg', 'Poulet élevé en plein air', 0.15, 1, 5);

-- Commandes
INSERT INTO agri_connect.commandes (created_at, updated_at, total_amount, delivery_address, payment_method, user_id)
VALUES
(now(), now(), 25.60, '8 rue de Lyon, Limoges', 'Carte', 3),
(now(), now(), 12.40, '8 rue de Lyon, Limoges', 'Espèces', 3);

-- Commande_products
INSERT INTO agri_connect.commande_products (commande_id, product_id, quantite, created_at, updated_at)
VALUES
(1, 1, 5, now(), now()),
(1, 3, 3, now(), now()),
(2, 2, 4, now(), now()),
(2, 4, 2, now(), now());
