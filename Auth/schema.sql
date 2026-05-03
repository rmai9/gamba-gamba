CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS player (
    user_id INTEGER NOT NULL,
    profile_picture INTEGER DEFAULT 1,
    profile_banner INTEGER DEFAULT 1,
    powerups INTEGER DEFAULT 0,
    
    money INTEGER DEFAULT 1000,
    
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS matchHistory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    p1id INTEGER NOT NULL,
    p2id INTEGER NOT NULL,
    victor INTEGER NOT NULL, -- 1 for p1, 2 for p2
    p1select INTEGER NOT NULL, --1 for rock, 2 for paper, 3 for scissors
    p2select INTEGER NOT NULL, --1 for rock, 2 for paper, 3 for scissors
    p1money INTEGER NOT NULL,
    p2money INTEGER NOT NULL,
    
    FOREIGN KEY (p1id) REFERENCES users (id),
    FOREIGN KEY (p2id) REFERENCES users (id)
);


CREATE TABLE IF NOT EXISTS matchSelections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    match_id INTEGER NOT NULL,
    selection INTEGER NOT NULL, --1 for rock, 2 for paper, 3 for scissors
    
    FOREIGN KEY (user_id) REFERENCES users (id)
    FOREIGN KEY (match_id) REFERENCES matchHistory (id)
);