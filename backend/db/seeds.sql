INSERT INTO users (id, color)
VALUES
    ('user1', '#e1ff00ff'),
    ('user2', '#0000ff'),
    ('user3', '#aa5500e2')
ON CONFLICT (id) DO NOTHING;