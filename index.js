var app = require('express')();
var http = require('http').Server(app);
var houseFunctions= require('./map_objects/houses');
var spawnFunctions= require('./map_objects/bases');
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
	io.emit('bases', bases);
	io.emit('projectiles', projectiles);
	
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

	socket.on("projectile", function(projectile){
		console.log("projectile added");
		projectiles[projectiles.length] = projectile;
		io.emit('projectiles', projectiles);
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
var bases = [];
var base_chunks=[];
var projectiles = [];


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
	  actProjectiles();
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

var fieldwidth = 4000;
var fieldheight = 4000;
var chunksize = 400;
var streetsize = 60;
var bordersize = 120;
var maxBases = 5;


function generateBaseChunks() {
	base_chunks = [];
	maxChunks = Math.floor((fieldwidth-2*bordersize)*(fieldheight-2*bordersize)/chunksize);
	for(var i=0;i<maxBases;i++) {
		base_chunks.push(Math.floor(Math.random()*maxChunks));
	}
}


function generateWorld() {
	baseId = 0;
	for(var x=bordersize;x<(fieldwidth-bordersize-chunksize);x+=chunksize){
		for(var y=bordersize;y<(fieldheight-bordersize-chunksize);y+=chunksize){
			chunkid=Math.floor(((y-bordersize)+(y-bordersize)*(fieldwidth-bordersize-chunksize))/chunksize);
			if(chunkid in base_chunks) {
				var basetype=Math.floor(Math.random()*2);
				baseId++;
				switch(basetype){
				case 0:
					bases = houseFunctions.generateRectBase(bases,x,y,baseId,chunksize,streetsize);
					break;
				case 1:
					bases = houseFunctions.generateTriangleBase(bases,x,y,baseId,chunksize,streetsize);
					break;
				default:
					bases = houseFunctions.generateRectBase(bases,x,y,baseId,chunksize,streetsize);
				}
			} else {
				var housetype=Math.floor(Math.random()*3);
				switch(housetype){
					case 0:
						houses = houseFunctions.generateRectHouse(houses,x,y,chunksize,streetsize);
						break;
					case 1:
						houses = houseFunctions.generateTriangleHouse(houses,x,y,chunksize,streetsize);
						break;
					case 2:
						houses = houseFunctions.generateDoubleTriangleHouse(houses,x,y,chunksize,streetsize); 
						break;
					default:
						houses = houseFunctions.generateRectHouse(houses,x,y,chunksize,streetsize);
				}
			}
		}
	}
}
generateWorld();

function generateCargo() {
  if( (now-lastCargo) > 1500){
    lastCargo = now;

    if(cargo.length<45) {

		var pos_x = Math.floor((Math.random() * (fieldwidth-40) ) + 20);
		var pos_y = Math.floor((Math.random() * (fieldheight-40) ) + 20);
		var valid_pos = false;
		while(!valid_pos){
			valid_pos = true;

			pos_x = Math.floor((Math.random() * (fieldwidth-40) ) + 20);
			pos_y = Math.floor((Math.random() * (fieldheight-40)) + 20);

			var c1 = [pos_x + 8, pos_y + 8 ];
			var c2 = [pos_x + 8, pos_y - 8 ];
			var c3 = [pos_x - 8, pos_y - 8 ];
			var c4 = [pos_x - 8, pos_y + 8 ];
			var mycorners = [
				{ 	x: c1[0],
					y: c1[1]
				},
				{ 	x: c2[0],
					y: c2[1]
				},
				{ 	x: c3[0],
					y: c3[1]
				},
				{ 	x: c4[0],
					y: c4[1]
				}
			];

			for(h=0; h < houses.length; h++){

				var collision = doPolygonsIntersect(mycorners,houses[h]);
				if(collision){
					//console.log("collide with house");
					valid_pos = false;
				}

			}


		}

    	new_cargo = {
    	        x: pos_x,
    	        y: pos_y,
				color: /Math.floor(Math.random() * (maxBases))
    	      };
    	
    	
      cargo[cargo.length] = new_cargo;
      //console.log('generated cargo');

      //console.log('send cargo');
    }
    io.emit('data', cargo);
  }
}

function actProjectiles(){
	for (p = 0; p < projectiles.length; p++){

		projectiles[p].x = projectiles[p].x + (Math.sin(projectiles[p].direction) * projectiles[p].speed * dt);
		projectiles[p].y = projectiles[p].y + (Math.cos(projectiles[p].direction) * projectiles[p].speed * dt);

		projectiles[p].distance -= (Math.sqrt(Math.pow(Math.sin(projectiles[p].direction) * projectiles[p].speed * dt,2)
			+ Math.pow(Math.cos(projectiles[p].direction) * projectiles[p].speed * dt ,2)));

		if(projectiles[p].distance < 0){
			projectiles.splice(p);
		}
	}
}

function rotatePoint(pivot, point, angle) {
	// Rotate clockwise, angle in radians
	var x = Math.round((Math.cos(angle) * (point[0] - pivot[0])) -
			(Math.sin(angle) * (point[1] - pivot[1])) +
			pivot[0]),
		y = Math.round((Math.sin(angle) * (point[0] - pivot[0])) +
			(Math.cos(angle) * (point[1] - pivot[1])) +
			pivot[1]);
	return [x, y];
}

/**
 * Helper function to determine whether there is an intersection between the two polygons described
 * by the lists of vertices. Uses the Separating Axis Theorem
 *
 * @param a an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @param b an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @return true if there is any intersection between the 2 polygons, false otherwise
 */
function doPolygonsIntersect (a, b) {
	var polygons = [a, b];
	var minA, maxA, projected, i, i1, j, minB, maxB;

	for (i = 0; i < polygons.length; i++) {

		// for each polygon, look at each edge of the polygon, and determine if it separates
		// the two shapes
		var polygon = polygons[i];
		for (i1 = 0; i1 < polygon.length; i1++) {

			// grab 2 vertices to create an edge
			var i2 = (i1 + 1) % polygon.length;
			var p1 = polygon[i1];
			var p2 = polygon[i2];

			// find the line perpendicular to this edge
			var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

			minA = maxA = undefined;
			// for each vertex in the first shape, project it onto the line perpendicular to the edge
			// and keep track of the min and max of these values
			for (j = 0; j < a.length; j++) {
				projected = normal.x * a[j].x + normal.y * a[j].y;
				if ((minA == undefined) || projected < minA) {
					minA = projected;
				}
				if ((maxA == undefined) || projected > maxA) {
					maxA = projected;
				}
			}

			// for each vertex in the second shape, project it onto the line perpendicular to the edge
			// and keep track of the min and max of these values
			minB = maxB = undefined;
			for (j = 0; j < b.length; j++) {
				projected = normal.x * b[j].x + normal.y * b[j].y;
				if ((minB == undefined) || projected < minB) {
					minB = projected;
				}
				if ((maxB == undefined) || projected > maxB) {
					maxB = projected;
				}
			}

			// if there is no overlap between the projects, the edge we are looking at separates the two
			// polygons, and we know there is no overlap
			if (maxA < minB || maxB < minA) {
				//CONSOLE("polygons don't intersect!");
				return false;
			}
		}
	}
	return true;
}

