var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var usercount = 0;
var highscore = 0;
var highscore_name = "NoOne";
var active = false;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  usercount++;
  active = true;

  io.emit('score', {highscore:highscore, name:highscore_name});

  socket.on('disconnect', function(){
    console.log('user disconnected');
    usercount--;
    if(usercount==0){
      console.log('No More users. Deactivating');
      active = false;
      cargo = [];
    }
    //active = false;
    //cargo = [];
  });
  
  socket.on("data", function(data){
	  console.log("data: " + data.msg);
  });

  socket.on("cargo", function(data){
    console.log("cargo remove: " + data);
    cargo.splice(data,1);
    io.emit('data', cargo);
  });

  socket.on("GameOver", function(data){
    //console.log("Player lost: " + data.id + " points: " + data.points);
    if(usercount==1){
        cargo = [];
    }
    if(data.points > highscore){
        highscore = data.points;
        highscore_name = data.name;
        console.log("Highscore: " + data.id + " points: " + data.points);
        io.emit('score', {highscore:highscore, name:highscore_name});
    }
  });

  socket.on("position", function(taxi){
    //console.log("taxi data received: " + taxi.id);
    var id = -1;
    for(var t = 0; t < taxis.length; t++){
      if(taxis[t].id == taxi.id){
        id = t;
      }
    }
    if(id == -1) {
      taxis[taxis.length] = taxi;
      taxis[taxis.length-1].lastUpdate = Date.now();
    }
    else{
      taxis[id].pos_x = taxi.pos_x;
      taxis[id].pos_y = taxi.pos_y;
      taxis[id].direction = taxi.direction;
      taxis[id].taxiWidth = taxi.taxiWidth;
      taxis[id].taxiHeight = taxi.taxiHeight;
      taxis[id].lastUpdate = Date.now();
      taxis[id].passengers = taxi.passengers;
      taxis[id].speed = taxi.speed;
      taxis[id].leftPressed = taxi.leftPressed;
      taxis[id].rightPressed = taxi.rightPressed;
    }
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

var cargo = [];
var taxis = [];

function pos(x,y){
  this.x = x;
  this.y = y;
}

var now = Date.now();
var time = now;
var lastCargo = now;

function act() {

  now = Date.now();
  dt = (now - time) * 0.001;
  time = now;

  if (active) {
    //console.log("acting");
    generateCargo();
    sendTaxiData();
  }

  setTimeout(act,20);
}
act();

function sendTaxiData(){
  for(var t = 0; t < taxis.length; t++){
	 // console.log("index: " + taxis[t].id +  " now: " + now + " lastUpdate: " + taxis[t].lastUpdate + " diff: " + (now - taxis[t].lastUpdate));
    if( (now - taxis[t].lastUpdate) > 200){
		
	  
      taxis.splice(t,1);
    }
  }
  io.emit("taxis", taxis);
}

var fieldwidth = 1920;
var fieldheight= 965;

function generateCargo() {
  if( (now-lastCargo) > 1500){
    lastCargo = now;

    if(cargo.length<45) {

      cargo[cargo.length] = {
        x: (Math.floor((Math.random() * (fieldwidth - 30)) + 15)),
        y: (Math.floor((Math.random() * (fieldheight - 30)) + 15))
      };

      //console.log('generated cargo');

      //console.log('send cargo');
    }
    io.emit('data', cargo);
  }
}
