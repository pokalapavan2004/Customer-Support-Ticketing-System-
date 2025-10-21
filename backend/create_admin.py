# create_admin.py
# Script to create or update an admin user for the Support Desk system
# Author: Pavan (Intern)
# Date: 2025-10-15

from app import app
from models import db, User, bcrypt

with app.app_context():
    print("=== Create Admin User ===")

    name = "Admin"
    email = "admin@gmail.com"
    password = "admin123"

    # Hash password
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    # Check if admin exists
    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        existing_user.name = name
        existing_user.password = hashed_password
        existing_user.is_admin = True
        print(f"Existing user '{email}' updated as admin.")
    else:
        admin_user = User(
            name=name,
            email=email,
            password=hashed_password,
            is_admin=True
        )
        db.session.add(admin_user)
        print(f"Admin user '{email}' created successfully.")

    db.session.commit()
    print("✅ Done! Admin account ready.")
