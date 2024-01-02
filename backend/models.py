from db import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
	__tablename__ = 'users'
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(64), unique=True, index=True)
	email = db.Column(db.String, unique=True)
	password_hash = db.Column(db.String(128))
	date_joined = db.Column(db.Date)
	def __repr__(self):
		return '<User %r>' % self.username
	@property
	def password(self):
		raise AttributeError('password is not a readable attribute')
	@password.setter
	def password(self, password):
		self.password_hash = generate_password_hash(password)
	def verify_password(self, password):
		return check_password_hash(self.password_hash, password)
	
