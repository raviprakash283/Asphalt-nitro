CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(15,2) DEFAULT 0.00 CHECK (balance >= 0),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS  items (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    item_id BIGINT REFERENCES items(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, item_id)
);

CREATE TABLE  IF NOT EXISTS rewards (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS rewards_claimed (
    reward_id BIGINT REFERENCES rewards(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    claimed_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY(reward_id, user_id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    wallet_id BIGINT REFERENCES wallets(id) ON DELETE CASCADE,
    idempotency_key VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(20) CHECK (type IN ('CREDIT', 'DEBIT')) NOT NULL,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    reason VARCHAR,
    status VARCHAR(20) DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
    created_at TIMESTAMP DEFAULT NOW()
);


INSERT INTO users (id, email, password_hash, created_at, updated_at)
VALUES
(1, 'user1@example.com', '$2b$12$dummyhash1', NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days'),
(2, 'user2@example.com', '$2b$12$dummyhash2', NOW() - INTERVAL '9 days', NOW() - INTERVAL '4 days'),
(3, 'user3@example.com', '$2b$12$dummyhash3', NOW() - INTERVAL '8 days', NOW() - INTERVAL '3 days'),
(4, 'user4@example.com', '$2b$12$dummyhash4', NOW() - INTERVAL '7 days', NOW() - INTERVAL '2 days'),
(5, 'user5@example.com', '$2b$12$dummyhash5', NOW() - INTERVAL '6 days', NOW() - INTERVAL '1 day'),
(6, 'user6@example.com', '$2b$12$dummyhash6', NOW() - INTERVAL '5 days', NOW()),
(7, 'user7@example.com', '$2b$12$dummyhash7', NOW() - INTERVAL '4 days', NOW()),
(8, 'user8@example.com', '$2b$12$dummyhash8', NOW() - INTERVAL '3 days', NOW()),
(9, 'user9@example.com', '$2b$12$dummyhash9', NOW() - INTERVAL '2 days', NOW()),
(10,'user10@example.com','$2b$12$dummyhash10',NOW() - INTERVAL '1 day', NOW());


INSERT INTO wallets (id, user_id, balance, created_at, updated_at)
VALUES
(1, 1, 150.50, NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days'),
(2, 2,  75.00, NOW() - INTERVAL '9 days',  NOW() - INTERVAL '4 days'),
(3, 3, 200.00, NOW() - INTERVAL '8 days',  NOW() - INTERVAL '3 days'),
(4, 4,  30.25, NOW() - INTERVAL '7 days',  NOW() - INTERVAL '2 days'),
(5, 5, 500.00, NOW() - INTERVAL '6 days',  NOW() - INTERVAL '1 day'),
(6, 6, 120.75, NOW() - INTERVAL '5 days',  NOW()),
(7, 7,  85.00, NOW() - INTERVAL '4 days',  NOW()),
(8, 8, 250.00, NOW() - INTERVAL '3 days',  NOW()),
(9, 9,  45.50, NOW() - INTERVAL '2 days',  NOW()),
(10,10, 300.00, NOW() - INTERVAL '1 day',  NOW());


INSERT INTO items (id, title, created_at, updated_at)
VALUES
(1, 'Diamond Sword',         NOW() - INTERVAL '15 days', NOW() - INTERVAL '5 days'),
(2, 'Golden Apple',          NOW() - INTERVAL '14 days', NOW() - INTERVAL '4 days'),
(3, 'Magic Potion',          NOW() - INTERVAL '13 days', NOW() - INTERVAL '3 days'),
(4, 'Enchanted Armor',       NOW() - INTERVAL '12 days', NOW() - INTERVAL '2 days'),
(5, 'Flying Boots',          NOW() - INTERVAL '11 days', NOW() - INTERVAL '1 day'),
(6, 'Invisible Cloak',       NOW() - INTERVAL '10 days', NOW()),
(7, 'Lightning Staff',       NOW() - INTERVAL '9 days',  NOW()),
(8, 'Health Crystal',        NOW() - INTERVAL '8 days',  NOW()),
(9, 'Speed Scroll',          NOW() - INTERVAL '7 days',  NOW()),
(10,'Ancient Relic',         NOW() - INTERVAL '6 days',  NOW());


INSERT INTO rewards (id, title, created_at, updated_at)
VALUES
(1, 'Welcome Bonus',         NOW() - INTERVAL '20 days', NOW() - INTERVAL '10 days'),
(2, 'Daily Login Reward',    NOW() - INTERVAL '19 days', NOW() - INTERVAL '9 days'),
(3, 'First Purchase Reward', NOW() - INTERVAL '18 days', NOW() - INTERVAL '8 days'),
(4, 'Level 10 Milestone',    NOW() - INTERVAL '17 days', NOW() - INTERVAL '7 days'),
(5, 'Referral Bonus',        NOW() - INTERVAL '16 days', NOW() - INTERVAL '6 days'),
(6, 'Season Pass Reward',    NOW() - INTERVAL '15 days', NOW() - INTERVAL '5 days'),
(7, 'Event Winner Trophy',   NOW() - INTERVAL '14 days', NOW() - INTERVAL '4 days'),
(8, 'VIP Member Gift',       NOW() - INTERVAL '13 days', NOW() - INTERVAL '3 days'),
(9, 'Lucky Draw Prize',      NOW() - INTERVAL '12 days', NOW() - INTERVAL '2 days'),
(10,'Anniversary Gift',      NOW() - INTERVAL '11 days', NOW() - INTERVAL '1 day');