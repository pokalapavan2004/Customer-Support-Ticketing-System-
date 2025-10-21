#!/usr/bin/env python3
"""
Script to create admin user with admin@gmail.com and admin123 password
"""
from app import app
from models import db, User

def create_admin_user():
    with app.app_context():
        print("Creating admin user...")
        
        # Check if admin already exists
        admin = User.query.filter_by(email='admin@gmail.com').first()
        
        if admin:
            print(f"Admin user already exists: {admin.email}")
            # Update existing admin
            admin.is_admin = True
            admin.role = 'admin'
            admin.set_password('admin123')
            db.session.commit()
            print("✅ Admin user updated successfully!")
        else:
            # Create new admin user
            admin = User(
                name='Admin User',
                email='admin@gmail.com',
                is_admin=True,
                role='admin'
            )
            admin.set_password('admin123')
            
            db.session.add(admin)
            db.session.commit()
            print("✅ Admin user created successfully!")
        
        print(f"Email: admin@gmail.com")
        print(f"Password: admin123")
        print(f"Is Admin: {admin.is_admin}")
        print(f"Role: {admin.role}")

if __name__ == '__main__':
    create_admin_user()
