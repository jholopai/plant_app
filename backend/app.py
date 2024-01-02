from flask import Flask, request, jsonify
from config import Development
from models import User
from flask_jwt_extended import JWTManager
from datetime import datetime
from db import db

app = Flask(__name__)
app.config.from_object(Development)
JWTManager(app)

db.init_app(app)

@app.route("/auth/register", methods =["GET", "POST"])
def register():

	data = request.get_json()
	data_email = data.get('email')
	data_username = data.get('username')
	data_password = data.get('password')

	check_user = User.query.filter_by(username=data_username).first()

	if check_user is not None:
		return jsonify({"message":"User already exists."})

	current_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
	new_user = User(email=data_email,
				username=data_username,
				password=data_password,
				date_joined=current_date)
	db.session.add(new_user)
	db.session.commit()
	return jsonify({"message":"The new user was added"})