CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total_amount INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_card VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL
);

INSERT INTO products (name, description, price, image_url) VALUES 
('Буханка хлеба', 'Свежий ароматный хлеб, испечённый по традиционному рецепту', 85, 'https://avatars.mds.yandex.net/i?id=ef6745c6d36fd247da9b36b4bdbf487a1b7578a6-3521501-images-thumbs&n=13'),
('Сосиска в тесте', 'Нежное тесто с сочной сосиской - идеальный перекус', 65, 'https://avatars.mds.yandex.net/i?id=b2d4b31b7c90d4addf42dd1470551935d8ff4681-5869421-images-thumbs&n=13')
ON CONFLICT DO NOTHING;