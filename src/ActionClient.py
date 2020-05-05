from flask import Flask
from flask import render_template
from RosWrapper import RosWrapper
import roslibpy

app = Flask(__name__)

client = roslibpy.Ros(host="192.168.1.104", port=9090)


@app.route("/")
def index(name=None):
    return render_template("index.html")

@app.route("/hello_world")
def hello_world():
    action_client = roslibpy.actionlib.ActionClient(client)
    goal = roslibpy.actionlib.Goal(action_client, roslibpy.Message({"order": 8}))
    goal.send()
    result = goal.wait(10)
    action_client.dispose()
    return render_template("index.html", {"data": result})

if __name__ == "__main__":
    client.run()
    app.run(debug=True)
