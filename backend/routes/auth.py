# routes/auth.py
from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_user, logout_user, login_required, current_user,logout_user
from models import db, User

auth_bp = Blueprint('auth', __name__)

# ---------- SIGNUP ----------
@auth_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')

        # Check if user already exists
        if User.query.filter_by(email=email).first():
            flash('Email already exists. Please log in.', 'warning')
            return redirect(url_for('auth.login'))

        # Create new user
        user = User(name=name, email=email)
        user.set_password(password)  # Hash the password
        db.session.add(user)
        db.session.commit()

        flash('Account created successfully! Please log in.', 'success')
        return redirect(url_for('auth.login'))

    return render_template('signup.html')


# ---------- LOGIN ----------
@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first()

        # Check if user exists and password matches
        if not user or not user.check_password(password):
            flash('Invalid email or password.', 'danger')
            return redirect(url_for('auth.login'))

        # Log the user in
        login_user(user)
        flash('Login successful!', 'success')

        # Redirect based on admin or normal user
        if getattr(user, 'is_admin', False):
            return redirect(url_for('admin_dashboard'))
        else:
            return redirect(url_for('user_dashboard'))

    return render_template('login.html')


# ---------- PROFILE MANAGEMENT ----------
@auth_bp.route('/update-profile', methods=['PUT'])
@login_required
def update_profile():
    data = request.get_json()
    new_name = data.get('name')

    if not new_name or len(new_name.strip()) < 2:
        return jsonify({"error": "Name must be at least 2 characters long"}), 400

    current_user.name = new_name.strip()
    db.session.commit()
    
    return jsonify({"message": "Profile updated successfully"}), 200


# ---------- LOGOUT ----------
@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logged out successfully.', 'info')
    return redirect(url_for('home'))  # 'home' is the name of your home route


# ---------- ADMIN USERS PAGE ----------
@auth_bp.route('/admin/users')
@login_required
def admin_users():
    if not getattr(current_user, 'is_admin', False):
        flash('Unauthorized access.', 'danger')
        return redirect(url_for('auth.login'))

    users = User.query.order_by(User.id.asc()).all()
    return render_template('admin_users.html', users=users)
