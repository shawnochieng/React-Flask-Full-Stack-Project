from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from config import Config
from models import db

app = Flask(__name__)
app.config.from_object(Config)

mail = Mail(app)

CORS(app)
db.init_app(app)
jwt = JWTManager(app)

from routes import api

app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    with app.app_context():
        db.create_all() 
    app.run(debug=True, port=5000)
