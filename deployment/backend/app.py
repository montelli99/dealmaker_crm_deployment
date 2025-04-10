from flask import Flask, jsonify, request
from flask_restful import Api
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os

# Initialize Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///dealmaker_crm.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-for-prototype')

# Enable CORS
CORS(app)

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Initialize Flask-RESTful
api = Api(app)

# Import models and routes after initializing db to avoid circular imports
from models import Contact, Deal, Activity, Document, User
from routes import initialize_routes

# Initialize routes
initialize_routes(api)

@app.route('/')
def index():
    return jsonify({
        'message': 'Welcome to Dealmaker CRM API',
        'version': '0.1.0',
        'status': 'prototype'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
