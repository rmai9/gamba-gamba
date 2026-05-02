from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from .db import get_db
import functools
import sqlite3
import sys

flask_bp = Blueprint('flask', __name__)

@flask_bp.route('/api/users', methods=['GET'])
def get_user():
    """Get all user info."""
    if 'user_id' in session:
        db = get_db()
        users = db.execute('SELECT id, username FROM users').fetchall()
        if users:
            return jsonify({'users': [dict(user) for user in users]}), 200
    return jsonify({'error': 'Unauthorized'}), 401


@flask_bp.route('/api/findMatch', methods=['GET'])
def find_match():
    """Find a match for the current user."""
    if 'user_id' in session:
        db = get_db()
        user = db.execute('SELECT user_id as id FROM matchSelections WHERE user_id != ? ORDER BY RANDOM() LIMIT 1', (session['user_id'],)).fetchone()
        print(user['id'], file=sys.stderr)
        if user:
            username = db.execute('SELECT username FROM users WHERE id = ?', (user['id'],)).fetchone()
            pfp = db.execute('SELECT profile_picture FROM player WHERE user_id = ?', (user['id'],)).fetchone()
            profile_banner = db.execute('SELECT profile_banner FROM player WHERE user_id = ?', (user['id'],)).fetchone()

            return jsonify({
                'user': user['id'], 
                "username": username['username'], 
                "pfp": pfp['profile_picture'], 
                "banner": profile_banner['profile_banner']
                }), 200
    return jsonify({'error': 'Unauthorized'}), 401