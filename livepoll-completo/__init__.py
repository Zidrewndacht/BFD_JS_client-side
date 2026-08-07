# livepoll/__init__.py
import os
from flask import Flask

def create_app():
    app = Flask(__name__)
    app.secret_key = os.urandom(42) # Essencial para a sessão funcionar
    
    from . import enquete
    app.register_blueprint(enquete.bp)
    
    return app