# Customer Support Ticketing System
A full-stack web application designed to simplify customer support and issue tracking between users and administrators. It features secure authentication, role-based dashboards, and an intuitive interface for handling customer issues efficiently.

## 📖 Overview
The **Customer Support Ticketing System** enables users to raise tickets for their queries or issues and allows administrators to manage, prioritize, and resolve them effectively. The project is built using Flask (Python) as the backend framework with PostgreSQL as the database and a clean Bootstrap-based frontend for responsiveness.-

## 🚀 Features
### 👨‍💻 User Features
- User registration and login using email and password.
- Create new support tickets with details like category, description, and priority.
- View ticket status (Pending, In Progress, Resolved).
- Intuitive and responsive interface built using Bootstrap.

### 🧑‍🏫 Admin Features
- Separate admin dashboard for managing all user tickets.
- View, update, or close user tickets.
- Only admin can update and delete the tickets.
- Prioritize tickets based on urgency or priority level.
- Manage overall ticket workflow.
- Secure admin login credentials.

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | HTML, CSS, JavaScript, Bootstrap |
| **Backend** | Python (Flask Framework) |
| **Database** | PostgreSQL (Database Name: flipkart_support) |
| **Version Control** | Git & GitHub |
| **Environment Management** | python-dotenv |
| **ORM & Migrations** | SQLAlchemy + Flask-Migrate |

## ⚙️ Installation & Setup
Follow the steps below to set up the project on your local machine.

### 1. Clone the Repository
git clone https://github.com/pokalapavan2004/Customer-Support-Ticketing-System.git
cd Customer-Support-Ticketing-System

### 2. Create and Activate a Virtual Environment
# Windows
python -m venv venv
venv\Scripts\activate
# macOS / Linux
python3 -m venv venv
source venv/bin/activate

### 3. Install Dependencies
Install all required packages using:pip install -r requirements.txt

## 📦 Dependencies
| Package           | Version |
| ----------------- | ------- |
| alembic           | 1.16.5  |
| bcrypt            | 5.0.0   |
| blinker           | 1.9.0   |
| click             | 8.3.0   |
| colorama          | 0.4.6   |
| Flask             | 3.1.2   |
| Flask-Bcrypt      | 1.0.1   |
| flask-cors        | 6.0.1   |
| Flask-Login       | 0.6.3   |
| Flask-Migrate     | 4.1.0   |
| Flask-SQLAlchemy  | 3.1.1   |
| greenlet          | 3.2.4   |
| itsdangerous      | 2.2.0   |
| Jinja2            | 3.1.6   |
| Mako              | 1.3.10  |
| MarkupSafe        | 3.0.3   |
| pip               | 25.2    |
| psycopg2-binary   | 2.9.10  |
| PyMySQL           | 1.1.2   |
| python-dotenv     | 1.1.1   |
| SQLAlchemy        | 2.0.43  |
| typing_extensions | 4.15.0  |
| Werkzeug          | 3.1.3   |

## 🗄️ Database Configuration
1.Create a PostgreSQL database named:flipkart_support

2.Configure your .env file in the backend directory:
DATABASE_URL=postgresql://username:password@localhost/flipkart_support
FLASK_ENV=development
SECRET_KEY=your_secret_key

3.Apply database migrations:
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

## 🔑 Login Credentials
### 👑 Admin Login
Email: admin@gmail.com
Password: admin123
### 🙍‍♂️ User Login
Users can register from the signup page or use existing credentials defined in the database.

##  Run the Application
Once everything is set up, start the Flask app:python app.py
Then open your browser and go to:
http://127.0.0.1:5000/

## 📂 Project Structure
Customer-Support-Ticketing-System/
│
├── backend/
│ ├── pycache/
│ ├── instance/
│ ├── routes/
│ │ ├── pycache/
│ │ ├── init.py
│ │ ├── admin.py # Admin dashboard and user management routes
│ │ ├── auth.py # User authentication and registration routes
│ │ ├── tickets.py # Ticket creation, viewing, and update logic
│ │ └── init.py
│ ├── app.py # Main Flask application entry point
│ ├── config.py # Configuration file (database, secret key, etc.)
│ ├── create_admin.py # Script to create an admin user
│ ├── models.py # SQLAlchemy models (User, Ticket, etc.)
│ ├── setup_admin.py # Initial admin setup script
│
├── frontend/
│ ├── static/
│ │ ├── CSS/
│ │ │ ├── adminanalytics.css
│ │ │ ├── admindashboard.css
│ │ │ ├── adminusers.css
│ │ │ ├── home.css
│ │ │ ├── login.css
│ │ │ ├── signup.css
│ │ │ ├── style.css
│ │ │ ├── theme.css
│ │ │ ├── tickets.css
│ │ │ ├── useranalytics.css
│ │ │ └── userdashboard.css
│ │ ├── javascript/
│ │   └── dashboard.js # Handles dashboard interactivity and analytics
│ └── templates/
│ ├── admin_users.html
│ ├── admindashboard.html
│ ├── analytics_admin.html
│ ├── analytics_user.html
│ ├── base.html
│ ├── home.html
│ ├── login.html
│ ├── signup.html
│ ├── ticket_detail.html
│ ├── tickets.html
│ └── userdashboard.html
├── venv/ # Virtual environment (not committed to Git)
├── requirements.txt # Project dependencies


## 💡 Key Functionalities
Ticket creation, updating, and deletion.
Role-based access control (Admin & User).
Ticket priority management.
Secure password hashing with Flask-Bcrypt.
PostgreSQL database integration.
Migration support with Flask-Migrate.
CORS support for cross-origin requests.
Clean, responsive Bootstrap UI.

## 🔮 Future Enhancements
Email notifications for ticket updates.
Analytics dashboard for ticket statistics.
Advanced role-based permissions.
API integration for automated responses.
Multi-language support.

## 👨‍💻 Author
Pavan Pokala
📧 pokalapavan2004@gmail.com
🌐 GitHub Profile:https://github.com/pokalapavan2004

🪪 License
This project is licensed under the MIT License.
You are free to use, modify, and distribute it with attribution.

