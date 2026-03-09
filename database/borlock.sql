-- ============================================================
-- borlock.sql – Schema completă a bazei de date BorLock
-- BorLock – Magazin online de tehnologie
-- Proiect Atestat IT, clasa a XII-a
-- 
-- Instrucțiuni de instalare:
-- 1. Deschide phpMyAdmin (http://localhost/phpmyadmin)
-- 2. Selectează "Import" și încarcă acest fișier
-- SAU rulează în terminal MySQL:
--    mysql -u root -p < database/borlock.sql
-- ============================================================

-- Creare baza de date (dacă nu există)
CREATE DATABASE IF NOT EXISTS borlock
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_romanian_ci;

USE borlock;

-- ============================================================
-- TABELUL USERS – Utilizatori înregistrați
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL                  COMMENT 'Numele complet al utilizatorului',
  email      VARCHAR(150)  NOT NULL UNIQUE            COMMENT 'Adresa de email (cheie unică)',
  password   VARCHAR(255)  NOT NULL                  COMMENT 'Hash bcrypt al parolei',
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP COMMENT 'Data înregistrării'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Utilizatori înregistrați';

-- ============================================================
-- TABELUL CATEGORIES – Categorii de produse
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL               COMMENT 'Numele categoriei',
  icon        VARCHAR(10)  DEFAULT '📦'           COMMENT 'Emoji icon',
  description TEXT                                COMMENT 'Descrierea categoriei',
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Categorii produse';

-- ============================================================
-- TABELUL PRODUCTS – Produse disponibile
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(200)   NOT NULL              COMMENT 'Denumirea produsului',
  category_id INT                                  COMMENT 'ID-ul categoriei (FK)',
  price       DECIMAL(10,2)  NOT NULL              COMMENT 'Prețul curent (RON)',
  old_price   DECIMAL(10,2)  DEFAULT NULL          COMMENT 'Prețul vechi (pentru reducere)',
  description TEXT                                 COMMENT 'Descrierea detaliată',
  specs       JSON                                 COMMENT 'Specificații tehnice (JSON)',
  image       VARCHAR(255)   DEFAULT NULL          COMMENT 'Calea imaginii produsului',
  stock       INT            DEFAULT 0             COMMENT 'Cantitatea în stoc',
  rating      DECIMAL(3,2)   DEFAULT 0.00          COMMENT 'Ratingul mediu (0-5)',
  created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Produse disponibile';

-- ============================================================
-- TABELUL CART – Coșul de cumpărături
-- ============================================================
CREATE TABLE IF NOT EXISTS cart (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT  NOT NULL                         COMMENT 'ID-ul utilizatorului (FK)',
  product_id INT  NOT NULL                         COMMENT 'ID-ul produsului (FK)',
  quantity   INT  DEFAULT 1                        COMMENT 'Cantitatea selectată',
  added_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP  COMMENT 'Data adăugării',
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_item (user_id, product_id) COMMENT 'Un produs o dată per utilizator'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Coș de cumpărături';

-- ============================================================
-- TABELUL FAVORITES – Produse favorite
-- ============================================================
CREATE TABLE IF NOT EXISTS favorites (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  product_id INT NOT NULL,
  added_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favorite (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Produse favorite ale utilizatorilor';

-- ============================================================
-- TABELUL COMPARISONS – Produse pentru comparare
-- ============================================================
CREATE TABLE IF NOT EXISTS comparisons (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  product_id INT NOT NULL,
  added_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_comparison (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Produse pentru comparare';

-- ============================================================
-- TABELUL ORDERS – Comenzi (bonus)
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT              DEFAULT NULL,
  order_number VARCHAR(20)      NOT NULL UNIQUE  COMMENT 'Numărul unic al comenzii',
  total        DECIMAL(10,2)    NOT NULL,
  status       ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled')
               DEFAULT 'pending',
  created_at   TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Comenzi plasate';

-- ============================================================
-- DATE INIȚIALE – CATEGORII (8 categorii)
-- ============================================================
INSERT INTO categories (name, icon, description) VALUES
  ('Laptops',       '💻', 'Laptopuri pentru muncă, studiu și gaming'),
  ('Smartphones',   '📱', 'Telefoane mobile de ultimă generație'),
  ('Tablete',       '📟', 'Tablete pentru multimedia și productivitate'),
  ('Monitoare',     '🖥️', 'Monitoare pentru birou, design și gaming'),
  ('Componente PC', '🔧', 'Plăci video, procesoare, RAM și stocare'),
  ('Periferice',    '⌨️', 'Tastaturi, mouse-uri și alte accesorii'),
  ('Audio',         '🔊', 'Boxe, căști și echipamente audio'),
  ('Gaming',        '🎮', 'Echipamente și accesorii pentru gameri');

-- ============================================================
-- DATE INIȚIALE – PRODUSE (12 produse cu specificații JSON)
-- ============================================================

-- 1. Laptops (category_id = 1)
INSERT INTO products (name, category_id, price, old_price, description, specs, stock, rating) VALUES
(
  'Laptop ASUS VivoBook 15',
  1,
  2499.00,
  2999.00,
  'Laptop performant pentru uz zilnic, ideal pentru studenți și profesioniști. Procesor Intel de generația a 12-a, display Full HD IPS și baterie de lungă durată.',
  '{"cpu": "Intel Core i5-1235U", "ram": "16GB DDR4", "storage": "512GB SSD", "gpu": "Intel Iris Xe", "display": "15.6\" FHD IPS", "os": "Windows 11"}',
  15,
  4.5
),
(
  'Laptop Lenovo IdeaPad 3',
  1,
  1999.00,
  2499.00,
  'Laptop accesibil cu procesor AMD Ryzen, perfect pentru sarcini de birou și navigare web.',
  '{"cpu": "AMD Ryzen 5 7520U", "ram": "8GB DDR5", "storage": "256GB SSD", "gpu": "AMD Radeon 610M", "display": "15.6\" FHD TN", "os": "Windows 11"}',
  8,
  4.0
),
(
  'Laptop HP Pavilion 15',
  1,
  2899.00,
  3299.00,
  'Laptop premium HP cu procesor i7 și placă video dedicată NVIDIA MX550. Ideal pentru multitasking și editing foto/video.',
  '{"cpu": "Intel Core i7-1255U", "ram": "16GB DDR4", "storage": "1TB SSD", "gpu": "NVIDIA MX550 4GB", "display": "15.6\" FHD IPS", "os": "Windows 11"}',
  6,
  4.5
);

-- 2. Smartphones (category_id = 2)
INSERT INTO products (name, category_id, price, old_price, description, specs, stock, rating) VALUES
(
  'Smartphone Samsung Galaxy A54',
  2,
  1499.00,
  1799.00,
  'Smartphone de top cu cameră de 50MP, display AMOLED 120Hz și baterie de 5000mAh.',
  '{"cpu": "Exynos 1380", "ram": "8GB", "storage": "128GB", "gpu": "Mali-G68", "display": "6.4\" AMOLED 120Hz", "camera": "50MP+12MP+5MP"}',
  22,
  4.5
),
(
  'Smartphone iPhone 15',
  2,
  4499.00,
  4999.00,
  'Cel mai nou iPhone cu chipset A16 Bionic, cameră de 48MP cu zoom 2x și Dynamic Island.',
  '{"cpu": "Apple A16 Bionic", "ram": "6GB", "storage": "128GB", "gpu": "Apple GPU 5-core", "display": "6.1\" Super Retina XDR", "camera": "48MP+12MP"}',
  5,
  5.0
);

-- 3. Tablete (category_id = 3)
INSERT INTO products (name, category_id, price, old_price, description, specs, stock, rating) VALUES
(
  'Tabletă Samsung Galaxy Tab A9',
  3,
  1299.00,
  1499.00,
  'Tabletă compactă și ușoară, perfectă pentru conținut multimedia, citit și gaming casual.',
  '{"cpu": "Snapdragon 695", "ram": "4GB", "storage": "64GB", "gpu": "Adreno 619", "display": "8.7\" LCD 60Hz", "camera": "8MP"}',
  12,
  4.0
);

-- 4. Monitoare (category_id = 4)
INSERT INTO products (name, category_id, price, old_price, description, specs, stock, rating) VALUES
(
  'Monitor LG 27" IPS',
  4,
  1099.00,
  1299.00,
  'Monitor IPS de 27 inchi cu rezoluție Full HD, culori precise și unghi de vizualizare larg de 178°.',
  '{"panel": "IPS 1ms", "display": "27\" FHD 75Hz", "cpu": "N/A", "ram": "N/A", "storage": "N/A", "gpu": "N/A"}',
  7,
  4.5
);

-- 5. Componente PC (category_id = 5)
INSERT INTO products (name, category_id, price, old_price, description, specs, stock, rating) VALUES
(
  'Placă video ASUS RTX 4060',
  5,
  1799.00,
  2099.00,
  'Placă video NVIDIA RTX 4060 cu 8GB GDDR6, ray tracing în timp real și DLSS 3.',
  '{"gpu": "NVIDIA RTX 4060", "ram": "8GB GDDR6", "tdp": "115W", "cpu": "N/A", "storage": "N/A", "display": "N/A"}',
  4,
  5.0
),
(
  'Procesor Intel Core i5-13400',
  5,
  899.00,
  1099.00,
  'Procesor Intel de generația a 13-a cu 10 nuclee și frecvență boost de 4.6GHz.',
  '{"cpu": "Intel Core i5-13400", "cores": "10 nuclee (6P+4E)", "gpu": "Intel UHD 730", "ram": "N/A", "storage": "N/A", "display": "N/A"}',
  10,
  4.5
);

-- 6. Periferice (category_id = 6)
INSERT INTO products (name, category_id, price, old_price, description, specs, stock, rating) VALUES
(
  'Tastatură mecanică Redragon K552',
  6,
  299.00,
  399.00,
  'Tastatură mecanică TKL cu iluminare RGB și switch-uri Outemu Red. Design compact.',
  '{"switches": "Outemu Red", "cpu": "N/A", "ram": "N/A", "storage": "N/A", "gpu": "N/A", "display": "N/A"}',
  30,
  4.0
);

-- 7. Audio (category_id = 7)
INSERT INTO products (name, category_id, price, old_price, description, specs, stock, rating) VALUES
(
  'Boxă portabilă JBL Charge 5',
  7,
  799.00,
  999.00,
  'Boxă Bluetooth portabilă cu sunet puternic 40W, rezistentă la apă IP67 și funcție PowerBank.',
  '{"battery": "20 ore autonomie", "cpu": "N/A", "ram": "N/A", "storage": "N/A", "gpu": "N/A", "display": "N/A"}',
  25,
  4.5
);

-- 8. Gaming (category_id = 8)
INSERT INTO products (name, category_id, price, old_price, description, specs, stock, rating) VALUES
(
  'Căști gaming Razer BlackShark V2',
  8,
  499.00,
  699.00,
  'Căști gaming cu sunet surround THX Spatial Audio, microfon HyperClear Cardioid și design ergonomic.',
  '{"driver": "50mm Razer TriForce", "cpu": "N/A", "ram": "N/A", "storage": "N/A", "gpu": "N/A", "display": "N/A"}',
  18,
  4.5
);

-- ============================================================
-- UTILIZATOR DE TEST (parolă: "test1234")
-- Parola este hash-uită cu bcrypt pentru securitate
-- ============================================================
INSERT INTO users (name, email, password) VALUES
(
  'Test User',
  'test@borlock.ro',
  -- Hash-ul parolei "test1234" generat cu password_hash('test1234', PASSWORD_DEFAULT)
  '$2y$12$B1nJIECHHhO1B0p6z5L3r.TQwsrZ3JwZ5nH/G9YEKkJ7pFAzPMZcK'
);

-- ============================================================
-- INDEXURI PENTRU PERFORMANȚĂ
-- ============================================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_price    ON products(price);
CREATE INDEX idx_cart_user         ON cart(user_id);
CREATE INDEX idx_favorites_user    ON favorites(user_id);
CREATE INDEX idx_users_email       ON users(email);

-- ============================================================
-- AFIȘARE REZUMAT INSTALARE
-- ============================================================
SELECT 'BorLock Database instalat cu succes!' AS Mesaj;
SELECT COUNT(*) AS TotalCategorii FROM categories;
SELECT COUNT(*) AS TotalProduse   FROM products;
SELECT COUNT(*) AS TotalUtilizatori FROM users;
