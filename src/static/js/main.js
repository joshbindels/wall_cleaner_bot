var ros = new ROSLIB.Ros({
url : 'ws://192.168.1.104:9090'
});

ros.on('connection', function() {
    console.log('Connected to websocket server.');
});

ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
});

ros.on('close', function() {
    console.log('Connection to websocket server closed.');
});

// Publishing a Topic
// ------------------

var cmdChatter = new ROSLIB.Topic({
    ros : ros,
    name : '/chatter',
    messageType : 'std_msgs/String'
});

var msg = new ROSLIB.Message({
    data: "Hello"
});

function sendMessage()
{
    cmdChatter.publish(msg);
}

// Subscribing to a Topic
// -----------------------
var elInfo = document.getElementById("info");
var elHeader = document.getElementById("header");
var elData = document.getElementById("data");
var el_canvas = document.getElementById("canvas");
var ctx = el_canvas.getContext("2d");
var map_width;
var map_height;
var map_data;


var map_listener = new ROSLIB.Topic(
    {
        ros: ros,
        name: '/map',
        messageType: 'nav_msgs/OccupancyGrid'
    }
);

map_listener.subscribe(function(message)
{
    document.getElementById("loadscreen").style.display = "none";
    document.getElementById("content").style.display = "initial";
    map_width = message.info.width;
    map_height = message.info.height;
    map_data = message.data;
    console.log(message);
    el_canvas.width = map_width;
    el_canvas.height = map_height;
    RenderMap();
});

/*
var odom_listener = new ROSLIB.Topic(
{
    ros: ros,
    name: "/odom",
    messageType: "nav_msgs/Odometry"
});

var robot_x_pos;
var robot_y_pos;
var d = false;
odom_listener.subscribe(function(message)
{
    if(!d)
    {
        console.log(message);
        d = true;
    }
    else
    {
        return;
    }
    robot_x_pos = message.twist.twist.linear.x * 1e7;
    robot_y_pos = message.twist.twist.linear.y * 1e7;
    //console.log("y: ", robot_y_pos);
    RenderRobot();
});
*/

var image_listener = new ROSLIB.Topic(
{
    ros: ros,
    name: "/camera/rgb/image_raw/compressed",
    messageType: "sensor_msgs/CompressedImage"
});


function GetImageData()
{
    document.getElementById("GetImageButton").disabled = true;
    image_listener.subscribe(function(message)
    {
        var img_element = document.getElementById("img");
        img_element.setAttribute("src", "data:image/jpg;base64," + message.data);
        image_listener.unsubscribe()
        console.log("Unsubscribed from topic /camera/rgb/image_raw");
        document.getElementById("GetImageButton").disabled = false;
});
}

function RenderRobot()
{
    ctx.fillStyle = "#F00";
    ctx.fillRect(robot_x_pos, robot_y_pos, 5, 5);
}

function RenderMap()
{
    var x_pos = 0;
    var y_pos = 0;
    ctx.fillStyle = "#FFF";
    for(var i=0; i<map_data.length; i++)
    {
        if(map_data[i] == 100)
        {
            ctx.fillRect(x_pos, y_pos, 1, 1);
        }
        if(x_pos == map_width)
        {
            x_pos = 0;
            y_pos++;
        }
        x_pos++;
    };
}
