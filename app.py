import os

from flask import Flask
app = Flask(__name__)

from flask import render_template

@app.route('/')
def index():
  return render_template('pyrepl.html')

if __name__ == '__main__':
  app.run(debug=True)