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
        user = db.execute('SELECT user_id as id, selection FROM matchSelections WHERE user_id != ? ORDER BY RANDOM() LIMIT 1', (session['user_id'],)).fetchone()
        print(user['id'], file=sys.stderr)
        if user:
            username = db.execute('SELECT username FROM users WHERE id = ?', (user['id'],)).fetchone()
            pfp = db.execute('SELECT profile_picture, profile_banner, money FROM player WHERE user_id = ?', (user['id'],)).fetchone()

            return jsonify({
                'user': user['id'], 
                "username": username['username'], 
                "pfp": pfp['profile_picture'], 
                "banner": pfp['profile_banner'],
                "money": pfp['money'],
                "selection": user['selection']
                }), 200
    return jsonify({'error': 'Unauthorized'}), 401

@flask_bp.route('/api/playerInfo', methods=['GET'])
def getPlayerInfo():
    """Get player info for the current user."""
    db = get_db()
    player_info = db.execute('SELECT profile_picture, profile_banner, money, powerups FROM player WHERE user_id = ?', (session['user_id'],)).fetchone()
    return jsonify({
        "username": session['username'],
        "pfp": player_info['profile_picture'], 
        "banner": player_info['profile_banner'],
        "money": player_info['money'],
        "powerups": player_info['powerups']

    }), 200


@flask_bp.route('/api/postResults', methods=['POST'])
def post_results():
    """Post match results for the current user."""
    data = request.get_json()
    db = get_db()
    try:
        db.execute('UPDATE player SET money = ? WHERE user_id = ?', (data['money'], session['user_id']))
        db.execute('INSERT INTO matchHistory (p1id, p2id, victor, p1select, p2select, p1money, p2money) VALUES (?, ?, ?, ?, ?, ?, ?)', (session['user_id'], data['opponent'], data['result'], data['p1select'], data['p2select'], data['money'], data['p2money']))
        matchid = db.execute('SELECT id FROM matchHistory WHERE p1id = ? AND p2id = ? ORDER BY id DESC LIMIT 1', (session['user_id'], data['opponent'])).fetchone()
        print(matchid['id'])
        db.execute('INSERT INTO matchSelections (user_id, selection, match_id) VALUES (?, ?, ?)', (session['user_id'], data['p1select'], matchid['id']))
        db.commit()
        return jsonify({'message': 'Results posted successfully'}), 200
    except Exception as e:
        print(e, file=sys.stderr)
        return jsonify({'error': 'Failed to post results'}), 500



@flask_bp.route('/api/matchHistory', methods=['GET'])
def match_history():
    """Get match history for the current user."""
    db = get_db()
    matches = db.execute('SELECT DISTINCT * FROM matchHistory WHERE p1id = ? OR p2id = ? ORDER BY id DESC', (session['user_id'], session['user_id'])).fetchall()

    matches = [dict(match) for match in matches]
    for match in matches:
        playerName = db.execute('SELECT username FROM users WHERE id = ?', (session['user_id'],)).fetchone()
        otherName = db.execute('SELECT username FROM users WHERE id = ?', (match['p1id'] if match['p1id'] != session['user_id'] else match['p2id'],)).fetchone()
        match['playerName'] = playerName['username']
        match['otherName'] = otherName['username']
    
    return jsonify({'matches': [dict(match) for match in matches], 'userId': session['user_id']}), 200


@flask_bp.route('/api/buyPowerup', methods=['POST'])
def buy_powerup():
    """Buy a powerup for the current user."""
    data = request.get_json()
    db = get_db()
    try:
        db.execute('UPDATE player SET powerups = ?, money = ? WHERE user_id = ?', (data['newPowerups'], data['newMoney'], session['user_id']))
        db.commit()
        return jsonify({'message': 'Powerup purchased successfully'}), 200
    except Exception as e:
        print(e, file=sys.stderr)
        return jsonify({'error': 'Failed to purchase powerup'}), 500

@flask_bp.route('/api/usePowerup', methods=['POST'])
def use_powerup():
    """Use a powerup for the current user."""
    data = request.get_json()
    db = get_db()
    try:
        db.execute('UPDATE player SET powerups = ? WHERE user_id = ?', (data['newPowerups'], session['user_id']))
        db.commit()
        return jsonify({'message': 'Powerup used successfully'}), 200
    except Exception as e:
        print(e, file=sys.stderr)
        return jsonify({'error': 'Failed to use powerup'}), 500
