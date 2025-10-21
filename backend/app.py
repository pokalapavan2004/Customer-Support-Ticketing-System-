import os
from flask import Flask, redirect, url_for, request, jsonify, render_template
from routes.auth import auth_bp
from flask_cors import CORS
from flask_login import LoginManager,login_required,current_user
from models import db, bcrypt, User, Ticket
from routes.tickets import ticket_bp

# Absolute path to frontend
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../frontend'))


app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, 'templates'),
    static_folder=os.path.join(BASE_DIR, 'static')
)
CORS(app)

# Config
app.config.update(
    SECRET_KEY='supersecretkey',
    SQLALCHEMY_DATABASE_URI='postgresql+psycopg2://postgres:admin123@localhost:5432/flipkart_support',
    SQLALCHEMY_TRACK_MODIFICATIONS=False
)

# Init extensions
db.init_app(app)
bcrypt.init_app(app)

# Login manager
login_manager = LoginManager(app)
login_manager.login_view = 'auth.login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(ticket_bp, url_prefix='/tickets')

# Create tables
with app.app_context():
    db.create_all()


#dashboard routes
@app.route('/')
def home():
    return render_template('home.html')



@app.route('/user/dashboard')
@login_required
def user_dashboard():
    tickets = User.query.get(current_user.id).tickets 
    return render_template('userdashboard.html', tickets=tickets)

@app.route('/admin/dashboard')
@login_required
def admin_dashboard():
    tickets = Ticket.query.all()
    return render_template('admindashboard.html', tickets=tickets)


if __name__ == '__main__':
    app.run(debug=True)
