import os
from flask import Flask
from flask_migrate import Migrate

def create_app(test_config=None):
    # Create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'dealmaker.sqlite'),
    )

    if test_config is None:
        # Load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # Load the test config if passed in
        app.config.from_mapping(test_config)

    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Initialize database
    from . import db
    db.init_app(app)
    
    # Register blueprints
    from . import auth, contacts, deals, activities
    app.register_blueprint(auth.bp)
    app.register_blueprint(contacts.bp)
    app.register_blueprint(deals.bp)
    app.register_blueprint(activities.bp)
    
    # Set up a simple index route
    @app.route('/')
    def index():
        return 'Dealmaker CRM API'
        
    return app
