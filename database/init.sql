CREATE DATABASE IF NOT EXISTS panaderia;
USE panaderia;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(20) NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(120) NOT NULL,
  customer_phone VARCHAR(30) NOT NULL,
  items_json JSON NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, category, description, price, image, featured)
SELECT * FROM (
  SELECT 'Concha de vainilla', 'Pan dulce', 'Suave, esponjosa y cubierta con costra de vainilla.', 18.00, 'concha', TRUE UNION ALL
  SELECT 'Croissant de mantequilla', 'Hojaldre', 'Capas doradas y crujientes, horneadas cada mañana.', 32.00, 'croissant', TRUE UNION ALL
  SELECT 'Pan de masa madre', 'Pan artesanal', 'Fermentación lenta y corteza crujiente.', 85.00, 'hogaza', FALSE UNION ALL
  SELECT 'Dona de chocolate', 'Pan dulce', 'Glaseado de chocolate y chispas crujientes.', 25.00, 'dona', FALSE UNION ALL
  SELECT 'Roles de canela', 'Horneado', 'Canela, azúcar mascabado y glaseado de queso crema.', 28.00, 'roles', TRUE UNION ALL
  SELECT 'Tarta de frutos rojos', 'Repostería', 'Base de mantequilla, crema y fruta de temporada.', 95.00, 'tarta', FALSE
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM products);
