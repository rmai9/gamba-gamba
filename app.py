from flask import Flask, render_template
from Auth.auth import auth_bp
from Auth.flask import flask_bp
from Auth.db import init_db

app = Flask(__name__,
            template_folder='UI/templates',
            static_folder='UI/static')

app.secret_key = 'secret_key'

app.register_blueprint(auth_bp)

app.register_blueprint(flask_bp)    

with app.app_context():
    init_db()

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)