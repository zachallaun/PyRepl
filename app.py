import os
BASE_PATH = os.path.dirname(os.path.realpath(__file__))

from flask import Flask
app = Flask(__name__)

from flask import render_template
from flask.ext.sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_PATH, 'db/test.db')
db = SQLAlchemy(app)

class Lesson(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  task = db.Column(db.String())
  test = db.Column(db.Unicode())

@app.route('/')
def index():
  return render_template('pyrepl.html')

if __name__ == '__main__':
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port)