from flask import Flask
from flask import render_template
from RosWrapper import RosWrapper

app = Flask(__name__)
ros = RosWrapper()

@app.route("/")
def index(name=None):
    return render_template("index.html")

@app.route("/hello_world")
def hello_world():
    return "%s" % ros.Test()

if __name__ == "__main__":
    ros.Init()
    app.run(debug=True)
    ros.Kill()
