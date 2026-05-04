import sqlite3
import os

DATABASE = 'app.db'

def get_db():
    """Get a database connection."""
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row  # Enable column access by name
    return db

def init_db():
    """Initialize the database with the schema."""
    schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
    with get_db() as db:
        with open(schema_path, 'r') as f:
            db.executescript(f.read())