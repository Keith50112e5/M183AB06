DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

INSERT INTO users (username, password) VALUES
    ('admin@gmail.com', '$2b$10$ldkQA2lSlb54opxRbQk17OoMoT1WRXbCAhfxVoSQLHhXDidfhbVe.'),
    ('user@gmail.com', '$2b$10$ldkQA2lSlb54opxRbQk17OoMoT1WRXbCAhfxVoSQLHhXDidfhbVe.');

SELECT * FROM users;