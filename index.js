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
io.emit('houses', houses);
	
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
var houses = [];


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

var fieldwidth = 2000;
var fieldheight = 1000;
var chunksize = 300;

/*
 * generates a rectangle house
 * param x: x coordinate of the chunk where the house should be created
 * param y: y coordinate of the chunk where the house should be created
 */
function generateRectHouse(x,y) {
	house = [{
		'x': x+60+Math.random()*20,
		'y': y+60+Math.random()*20
	},
	{
		'x': x+(chunksize-60)+Math.random()*20,
		'y': y+60+Math.random()*20
	},
	{
		'x': x+(chunksize-60)+Math.random()*20,
		'y': y+(chunksize-60)+Math.random()*20
	},
	{
		'x': x+60+Math.random()*20,
		'y': y+(chunksize-60)+Math.random()*20
	}];
	houses.push(house);
}
function generateTriangleHouse(x,y){
	house = [{
		'x': x+60+Math.random()*20,
		'y': y+60+Math.random()*20
	},
	{
		'x': x+(chunksize-60)+Math.random()*20,
		'y': y+60+Math.random()*20
	},
	{
		'x': x+60+Math.random()*20,
		'y': y+(chunksize-60)+Math.random()*20
	}];
	houses.push(house);
}

function generateDoubleTriangleHouse(x,y){
	house = [{
		'x': x+(chunksize-60)+Math.random()*20,
		'y': y+100+Math.random()*20
	},
	{
		'x': x+100+Math.random()*10,
		'y': y+(chunksize-60)+Math.random()*10
	},
	{
		'x': x+(chunksize-60)+Math.random()*10,
		'y': y+(chunksize-60)+Math.random()*10
	}]
	houses.push(house);
	house = [
	{
		'x': x+60+Math.random()*10,
		'y': y+60+Math.random()*10
	},
	{
		'x': x+(chunksize-100)+Math.random()*10,
		'y': y+60+Math.random()*10
	},
	{
		'x': x+60+Math.random()*20,
		'y': y+(chunksize-100)+Math.random()*20
	}];
	houses.push(house);
}

function generateHouses() {
	
	var maxHouses_x = Math.floor(fieldwidth/chunksize);
	var maxHouses_y = Math.floor(fieldwidth/chunksize);
	for(var x=0;x<maxHouses_x;x++){
		for(var y=0;y<maxHouses_y;y++){
			var housetype=Math.floor(Math.random()*3);
			var house = []
			switch(housetype){
				case 0:
					generateRectHouse(x*chunksize,y*chunksize);
					break;
				case 1:
					generateTriangleHouse(x*chunksize,y*chunksize);
					break;
				case 2:
					generateDoubleTriangleHouse(x*chunksize,y*chunksize); 
					break;
				default:
					generateRectHouse(x*chunksize,y*chunksize);
			}
		}
	}
	houses.splice(0,1);
}
generateHouses(); 

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
