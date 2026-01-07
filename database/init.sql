-- Création des tables TaskWatch

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
    time_logged INTEGER DEFAULT 0,
    timer_started_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE INDEX idx_tasks_user_id ON tasks(user_id);
-- CREATE INDEX idx_tasks_status ON tasks(status);
-- CREATE INDEX idx_tasks_name ON tasks(name);
-- CREATE INDEX idx_tasks_created_at ON tasks(created_at);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table pour les métriques API (temps de réponse endpoints)
CREATE TABLE IF NOT EXISTS api_metrics (
    id SERIAL PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_api_metrics_endpoint ON api_metrics(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_metrics_timestamp ON api_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_api_metrics_method ON api_metrics(method);

-- Insertion d'un utilisateur de test
-- Le hash bcrypt pour "password123" : $2b$10$hu2yioi3FgY/t5lJvtyaZ.CdQG8hjk04mJx5bpwyU5PIeG9KJrlfK
INSERT INTO users (email, password, name) VALUES
    ('test@example.com', '$2b$10$hu2yioi3FgY/t5lJvtyaZ.CdQG8hjk04mJx5bpwyU5PIeG9KJrlfK', 'Utilisateur Test')
ON CONFLICT (email) DO NOTHING;

-- Insertion de données de test pour les métriques API
INSERT INTO api_metrics (endpoint, method, status_code, response_time_ms, timestamp, user_id) VALUES
    ('/api/tasks', 'GET', 200, 45, NOW() - INTERVAL '1 hour', 1),
    ('/api/tasks', 'GET', 200, 52, NOW() - INTERVAL '2 hours', 1),
    ('/api/tasks', 'POST', 201, 89, NOW() - INTERVAL '3 hours', 1),
    ('/api/tasks/1', 'GET', 200, 23, NOW() - INTERVAL '4 hours', 1),
    ('/api/tasks/1', 'PUT', 200, 67, NOW() - INTERVAL '5 hours', 1),
    ('/api/tasks/1', 'DELETE', 204, 34, NOW() - INTERVAL '6 hours', 1),
    ('/api/auth/login', 'POST', 200, 156, NOW() - INTERVAL '7 hours', NULL),
    ('/api/auth/register', 'POST', 201, 234, NOW() - INTERVAL '8 hours', NULL),
    ('/api/users/me', 'GET', 200, 12, NOW() - INTERVAL '9 hours', 1),
    ('/api/tasks', 'GET', 200, 48, NOW() - INTERVAL '10 hours', 1),
    ('/api/tasks', 'GET', 200, 51, NOW() - INTERVAL '11 hours', 1),
    ('/api/tasks', 'GET', 500, 1200, NOW() - INTERVAL '12 hours', 1),
    ('/api/tasks/2', 'GET', 404, 15, NOW() - INTERVAL '13 hours', 1),
    ('/api/auth/login', 'POST', 401, 78, NOW() - INTERVAL '14 hours', NULL),
    ('/api/tasks', 'POST', 201, 92, NOW() - INTERVAL '15 hours', 1);
