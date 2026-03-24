CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    color TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS territories (
    cell_id TEXT PRIMARY KEY,
    owner_user_id TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    user_id TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_cells (
    activity_id INTEGER REFERENCES activities(id),
    cell_id TEXT
);