from flask import Flask, request, jsonify, make_response
from config import Development
from models import User, Plant, Note
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required
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
		error_response = {"message": "This username is taken.", "success":False}
		return (jsonify(error_response))

	current_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
	new_user = User(email=data_email,
				username=data_username,
				password=data_password,
				date_joined=current_date)
	db.session.add(new_user)
	db.session.commit()
	return jsonify({"message":"The account was registered succesfully!", "success":True})

@app.route('/auth/login', methods=['GET', 'POST'])
def login():

	data = request.get_json()
	data_username = data.get('username')
	data_password = data.get('password')

	user = User.query.filter_by(username=data_username).first()
	if user is not None and user.verify_password(data_password):
		access_token=create_access_token(identity=user.username)
		refresh_token=create_refresh_token(identity=user.username)
		return jsonify({"access_token":access_token, "refresh_token":refresh_token, "username":user.username, "success":True})
	else:
		return jsonify({"message":"The login credentials were invalid."})

@app.route('/auth/password', methods=['GET', 'POST'])
@jwt_required()
def password_change():

	data = request.get_json()
	data_username = data.get('username')
	data_old_password = data.get('old_password')
	data_new_password = data.get('new_password')

	user = User.query.filter_by(username=data_username).first()
	if user is not None and user.verify_password(data_old_password):
		user.password = data_new_password
		db.session.commit()
		return jsonify({"message":"The password has been updated.", "success":True})
	else:
		return jsonify({"message": "The old password was incorrect.", "success":False})

@app.route('/add_plant', methods=['POST'])
@jwt_required()
def add_plant():

	data = request.get_json()
	data_plant_name = data.get('plant_name')
	data_username = data.get('username')

	user = User.query.filter_by(username=data_username).first()
	if user is None:
		return jsonify({"message": "There was an error. Please contact admin if the issue persists", "success":False})
	check_plant = Plant.query.filter_by(user_id=user.id, name=data_plant_name).first()
	if check_plant is None:
		new_plant = Plant(name=data_plant_name, user_id=user.id)
		db.session.add(new_plant)
		db.session.commit()
		return jsonify({"message": f"{new_plant.name} was added.", "success": True})
	else:
		return jsonify({"message": "This plant already exists.", "success":False})

@app.route('/plants_list', methods=['GET', 'POST'])
@jwt_required()
def plants_list():

	data = request.get_json()
	data_username = data.get('username')

	user = User.query.filter_by(username=data_username).first()
	if user is not None:
		plants = Plant.query.filter_by(user_id=user.id).all()
		plant_data = [{"plant_name": plant.name, "id": plant.id} for plant in plants]
		return jsonify({"plants": plant_data, "success": True})
	else:
		return jsonify({"message": "There was an error. Please contact admin if the issue persists", "success":False})
	

@app.route('/notes_list', methods=['GET', 'POST'])
@jwt_required()
def notes_list():

	data = request.get_json()
	data_username = data.get('username')
	data_plant_name = data.get('plant_name')

	user = User.query.filter_by(username=data_username).first()
	if user is not None:
		notes = Note.query.filter_by(user_id=user.id, plant_name=data_plant_name).all()
		notes_data = [{"date": note.date, "content":note.content, "id":note.id} for note in notes]
		return jsonify({"notes": notes_data, "success": True})
	else:
		return jsonify({"message": "There was an error. Please contact admin if the issue persists", "success":False})