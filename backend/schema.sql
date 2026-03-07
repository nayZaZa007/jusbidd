CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL
);

INSERT INTO roles (name) VALUES
('bidder'), ('seller'), ('admin');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    display_name VARCHAR(100) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auctions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  image TEXT,
  starting_price INTEGER,
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bids (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  auction_id INTEGER REFERENCES auctions(id),
  bid_amount INTEGER,
  bid_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);