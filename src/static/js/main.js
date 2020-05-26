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


var listener = new ROSLIB.Topic(
    {
        ros: ros,
        name: '/map',
        messageType: 'nav_msgs/OccupancyGrid'
    }
);

listener.subscribe(function(message)
{
    document.getElementById("loadscreen").style.display = "none";
    document.getElementById("content").style.display = "initial";
    var map_width = message.info.width;
    var map_height = message.info.height;
    var el_canvas = document.getElementById("canvas");
    var ctx = el_canvas.getContext("2d");
    el_canvas.width = map_width;
    el_canvas.height = map_height;
    RenderMap(ctx, message.data, map_width);
});

function RenderMap(ctx, data, width)
{
    var x_pos = 0;
    var y_pos = 0;
    ctx.fillStyle = "#FFF";
    for(var i=0; i<data.length; i++)
    {
        if(data[i] == 100)
        {
            ctx.fillRect(x_pos, y_pos, 1, 1);
        }
        if(x_pos == width)
        {
            x_pos = 0;
            y_pos++;
        }
        x_pos++;
    };
}
