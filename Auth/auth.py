from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from .db import get_db
import functools
import sqlite3

auth_bp = Blueprint('auth', __name__)

def login_required(f):
    """Decorator to require login for a route."""
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated_function

def get_current_user():
    """Get the current logged-in user info."""
    if 'user_id' in session:
        db = get_db()
        user = db.execute('SELECT id, username FROM users WHERE id = ?', (session['user_id'],)).fetchone()
        return dict(user) if user else None
    return None

@auth_bp.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    db = get_db()
    try:
        password_hash = generate_password_hash(password)
        db.execute('INSERT INTO users (username, password_hash) VALUES (?, ?)', (username, password_hash))
        user = db.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
        db.execute('INSERT INTO player (user_id) VALUES (?)', (user['id'],))
        db.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Username already exists'}), 409

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    db = get_db()
    user = db.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    if user and check_password_hash(user['password_hash'], password):
        session['user_id'] = user['id']
        session['username'] = user['username']
        return jsonify({'message': 'Logged in successfully', 'user': {'id': user['id'], 'username': user['username']}}), 200
    
    player = db.execute('SELECT * FROM player WHERE username = ?', (username,)).fetchone()
    if not player:
        db.execute('INSERT INTO player (user_id) VALUES (?)', (user['id'],))
    return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200

@auth_bp.route('/api/me', methods=['GET'])
@login_required
def me():
    user = get_current_user()
    if user:
        return jsonify({'user': user}), 200
    return jsonify({'error': 'Not logged in'}), 401