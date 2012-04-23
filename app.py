import os
BASE_PATH = os.path.dirname(os.path.realpath(__file__))

from flask import Flask
app = Flask(__name__)

from flask import render_template
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.restless import APIManager

# Configure Flask-SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_PATH, 'db/test.db')
db = SQLAlchemy(app)

# Models
class Lesson(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  title = db.Column(db.String(60))
  exercises = db.relationship('Exercise', backref='lesson', lazy='select')

class Exercise(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  order = db.Column(db.Integer)
  task = db.Column(db.String())
  test = db.Column(db.String())
  lesson_id = db.Column(db.Integer, db.ForeignKey('lesson.id'))

# Configure Restless
manager = APIManager(app, flask_sqlalchemy_db=db)

manager.create_api(Lesson, methods=['GET', 'POST', 'DELETE', 'PUT'])
manager.create_api(Exercise, methods=['GET', 'POST', 'DELETE', 'PUT'])

# Controller
@app.route('/')
def index():
  return render_template('pyrepl.html')

if __name__ == '__main__':
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port)