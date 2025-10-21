import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'supersecretkey'
    SQLALCHEMY_DATABASE_URI = (
        os.environ.get('DATABASE_URL')
        or 'postgresql+psycopg2://postgres:admin123@localhost:5432/flipkart_support'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
