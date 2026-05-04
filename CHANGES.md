# Auth - Change Log

## Overview
This document tracks all changes made to the authentication system and related areas during development.

2026-05-01

### Added
- **Flask Authentication System**
  - User registration with username/password
  - Secure login with session management
  - Password hashing using Werkzeug security helpers
  - SQLite database for user storage
  - Session-based authentication
  - Route protection with `@login_required` decorator
  - JSON API endpoints for frontend integration

- **Database Schema**
  - Users table with id, username, password_hash
  - Automatic database initialization on app startup
  - SQLite connection helper functions

- **Security Features**
  - Password hashing with salt
  - Session management
  - Input validation
  - SQL injection prevention
  - Secure logout with form clearing

### Changed
- **File Organization**
  - Reorganized current project structure into organized `UI/` and `Auth/` folders
  - Moved frontend assets to `UI/templates/` and `UI/static/`
  - Moved auth logic to `Auth/` package
  - Updated Flask configuration for folder structure
  - Fixed import paths and relative references

- **UI Enhancements**
  - Styled signup button to match login button
  - Added password visibility toggles to both forms
  - Improved form UX with better error messages
  - Enhanced logout to clear username (unless remembered)

### Fixed
- **Import and Path Issues**
  - Fixed relative imports in Auth package
  - Corrected static file paths for Flask serving
  - Fixed database schema file path resolution
  - Resolved form submission conflicts (removed type="submit")

- **UI Bugs**
  - Fixed signup form flashing issue (removed auto-redirect)
  - Corrected password toggle emoji switching
  - Fixed form button types to prevent unwanted submissions
  - Resolved CSS path issues after reorganization

- **Database Issues**
  - Fixed table creation conflicts with IF NOT EXISTS
  - Corrected schema file loading path
  - Ensured proper database initialization

### Technical Details

#### Authentication Flow
1. User enters credentials on casino-themed login form
2. Frontend sends POST to `/api/login` with JSON payload
3. Backend validates credentials against hashed passwords
4. On success: stores user_id/username in session, returns user data
5. Frontend transitions to main menu
6. Protected routes check session with `@login_required` decorator

#### Password Security
- Uses `werkzeug.security.generate_password_hash()` with default settings
- Includes salt and multiple iterations
- Passwords never stored in plain text
- Verification uses `check_password_hash()` for timing-safe comparison

#### Session Management
- Flask server-side sessions
- Stores minimal data: user_id and username
- Automatic cleanup on logout
- Remember username feature preserves username across sessions

#### Database Design
```sql
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);
```
- Unique username constraint
- Auto-incrementing IDs

#### API Endpoints
- `POST /api/signup` - Create new account
- `POST /api/login` - Authenticate user
- `POST /api/logout` - Clear session
- `GET /api/me` - Get current user info (protected)

### Dependencies
- Flask 3.x
- Werkzeug (included with Flask)
- SQLite3 (built-in Python)

### File Structure
```
gamba-gamba/
├── app.py                    # Main Flask application
├── requirements.txt          # Python dependencies
├── CHANGES.md               # This file
├── Auth/                     # Authentication module
│   ├── __init__.py
│   ├── auth.py              # Auth routes and helpers
│   ├── db.py                # Database helpers
│   └── schema.sql           # Database schema
└── UI/                      # Frontend assets
    ├── templates/
    │   └── index.html       # Main page template
    └── static/
        ├── script.js        # Frontend logic
        ├── styles.css       # Casino styling
        ├── audio/           # Sound effects
        └── images/          # UI assets
```

### Known Issues
- Forgot password functionality not implemented
- No rate limiting on auth endpoints
- Session secret key to be changed

### Future Enhancements
- Password reset functionality (Security Question?)
- Account lockout after failed attempts
- User profile management
- Admin panel for user management

---