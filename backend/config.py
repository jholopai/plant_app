from decouple import config

class Config:
	SECRET_KEY = config('SECRET_KEY')
	SQLALCHEMY_TRACK_MODIFICATIONS=config('SQLALCHEMY_TRACK_MODIFICATIONS', cast=bool)


class Development(Config):
	SQLALCHEMY_DATABASE_URI='mysql+pymysql://' + config('DB_USER') + ':' + config('DB_PASSWORD') + '@' + config('DB_HOST') + '/' + config('DB_DATABASE')
	DEBUG=True

class Testing(Config):
	pass

class Production(Config):
	pass