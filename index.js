"use strict";

var express= require('express');
var app = express();
var http = require('http').Server(app);
var houseFunctions= require('./map_objects/houses');
var baseFunctions= require('./map_objects/bases');
var io = require('socket.io')(http);
var usercount = 0;
var highscore = 0;
var highscore_name = "NoOne";
var active = false;
var chunksize = 400;
var streetsize = 60;
var bordersize = 120;

//Setting fieldsize to multiple of chunksize;
var fieldwidth = chunksize*10+2*bordersize;
var fieldheight = chunksize*10+2*bordersize;
var maxBases = 5;
var randomFaktor = 2;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  usercount++;
  active = true;
  
  	io.emit('score', {highscore:highscore, name:highscore_name});
	let map = {'fieldwidth':fieldwidth,
		'fieldheight': fieldheight,
		'chunksize': chunksize,
		'streetsize': streetsize,
		'bordersize': bordersize,
		'houses': houses,
		'bases':bases};
	
	io.emit('map', map);
	io.emit('projectiles', projectiles);
	io.emit('traffic',traffic);
	
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

app.use('/img',express.static('img'));

http.listen(3000, function(){
  console.log('listening on *:3000');
});

var cargo = [];
var taxis = [];
var houses = [];
var bases = [];
var base_chunks=[];
var projectiles = [];
let waypoints = [];


function pos(x,y){
  this.x = x;
  this.y = y;
}

var now = Date.now();
var time = now;
var lastCargo = now;

let distanceP = (x,y) => {
	return Math.sqrt(Math.pow(x.x-y.x,2) + Math.pow(x.y-y.y,2));
}

let maxChunks;
function generateBaseChunks() {
	base_chunks = [];
	maxChunks = Math.floor((fieldwidth-2*bordersize)/chunksize)*Math.floor((fieldheight-2*bordersize)/chunksize);

	for(var i=0;i<maxBases;i++) {
		let chunkid = Math.floor(Math.random()*maxChunks);
		var isAlreadyBase= false;
		for(var y=0;y<base_chunks.length;y++) {
			if(chunkid==base_chunks[i]) {
				isAlreadyBase=true;
			}
		}
		if(!isAlreadyBase) {
			base_chunks.push(chunkid);
		} else {
			i--;
		}

	}
}

var maxChunksX ;
var maxChunksY;
function generateWorld() {
	let baseId = 0;
	var x = bordersize;
	var y = bordersize;
	maxChunksX = Math.floor((fieldwidth-2*bordersize)/chunksize);
	maxChunksY = Math.floor((fieldheight-2*bordersize)/chunksize);

	for(var xId=0;xId<maxChunksX;xId++){
		x = bordersize + xId*chunksize;
		for(var yId=0;yId<maxChunksY;yId++){
			y = bordersize + yId*chunksize;
			let chunkid=yId*maxChunksY+xId;
			let isBase = false;
			for(var i=0;i<base_chunks.length;i++) {
				if(chunkid==base_chunks[i]) {
					isBase=true;
				}
			}

			if(isBase) {
				var basetype=Math.floor(Math.random()*baseFunctions.baseTypes*randomFaktor);
				let building;
				switch(basetype){
					case 0:
						bases = baseFunctions.generateRectBase(bases,baseId,x,y,chunksize,streetsize);
						break;
					case 1:
						building = baseFunctions.generateRectBaseHouseType1(bases,houses,baseId,x,y,chunksize,streetsize);
						bases = building.bases;
						houses = building.houses;
						break;
					case 2:
						building = baseFunctions.generateRectBaseHouseType2(bases,houses,baseId,x,y,chunksize,streetsize);
						bases = building.bases;
						houses = building.houses;
						break;
					case 3:
						building = baseFunctions.generateRectBaseHouseType3(bases,houses,baseId,x,y,chunksize,streetsize);
						bases = building.bases;
						houses = building.houses;
						break;
					case 4:
						building = baseFunctions.generateRectBaseHouseType4(bases,houses,baseId,x,y,chunksize,streetsize);
						bases = building.bases;
						houses = building.houses;
						break;
					default:
						bases = baseFunctions.generateRectBase(bases,baseId,x,y,chunksize,streetsize);
				}
				baseId++;
			} else {
				var housetype=Math.floor(Math.random()*houseFunctions.houseTypes*randomFaktor);
				switch(housetype){
					case 0:
						houses = houseFunctions.generateRectHouse(houses,x,y,chunksize,streetsize);
						break;
					case 1:
						houses = houseFunctions.generateCrossHouse(houses,x,y,chunksize,streetsize);
						break;
					case 2:
						houses = houseFunctions.generateDoubleHouseType1(houses,x,y,chunksize,streetsize);
						break;
					case 3:
						houses = houseFunctions.generateDoubleHouseType2(houses,x,y,chunksize,streetsize);
						break;
					case 4:
						houses = houseFunctions.generateDoubleTriangleHouseType1(houses,x,y,chunksize,streetsize);
						break;
					case 5:
						houses = houseFunctions.generateDoubleTriangleHouseType2(houses,x,y,chunksize,streetsize);
						break;
					default:
						houses = houseFunctions.generateRectHouse(houses,x,y,chunksize,streetsize);
				}
			}
		}
	}
}

generateBaseChunks();
generateWorld();

function TrafficCar () {

	var speed = 0;
	var acceleration = 30;
	var maxSpeed = 120;
	var turningRate = 4;
	var maxTurningAngle = 0.6;
	var height = 30;
	var width = 15;
	var pos = {x:0 , y:0 };
	var steerAngle = 0;
	var direction = 0;
	var targetWaypoint = -1;
	var lastChange = 0;
}

TrafficCar.prototype.reset = function(){
	this.speed = 0;
	this.acceleration = 10;
	this.maxSpeed = 40;
	this.turningRate = 3;
	this.maxTurningAngle = 0.6;
	this.height = 30;
	this.width = 15;
	this.pos = {x:0 , y:0 };
	this.steerAngle = 0;
	this.direction = 0;
	this.lastChange = 0;

	this.targetWaypoint = -1;

	let valid_pos = false;
	while(!valid_pos){

		valid_pos = true;

		this.pos.x = Math.floor((Math.random() * (fieldwidth-80)) + 40);
		this.pos.y = Math.floor((Math.random() * (fieldheight-80)) + 40);

		let c1 = rotatePoint([this.pos.x,this.pos.y], [this.pos.x+this.width/2, this.pos.y+this.height/2],this.direction);
		let c2 = rotatePoint([this.pos.x,this.pos.y], [this.pos.x+this.width/2, this.pos.y-this.height/2],this.direction);
		let c3 = rotatePoint([this.pos.x,this.pos.y], [this.pos.x-this.width/2, this.pos.y+this.height/2],this.direction);
		let c4 = rotatePoint([this.pos.x,this.pos.y], [this.pos.x-this.width/2, this.pos.y-this.height/2],this.direction);
		let mycorners = [
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

		for(let h=0; h < houses.length; h++){

			let collision = doPolygonsIntersect(mycorners,houses[h]);
			if(collision){
				valid_pos = false;
			}

		}

	}
}

TrafficCar.prototype.act = function (dt) {
	if(this.pos.x === 0 && this.pos.y === 0){ this.reset(); }

	if(this.lastChange > 10){
		this.lastChange = 0;
		let mindistance = -1;
		for(let x = 0; x < waypoints.length; x++){
			let between = Math.min( 2*Math.PI - Math.abs(this.direction-waypoints[x].direction), Math.abs(this.direction-waypoints[x].direction) );

			if( (x != this.targetWaypoint) && (( (Math.sin(between) > 0)) && (Math.sqrt(Math.pow( this.pos.x - waypoints[x].x,2) + Math.pow(this.pos.y - waypoints[x].y,2)) < mindistance)) || (mindistance == -1)  ){

				mindistance = (Math.sqrt(Math.pow( this.pos.x - waypoints[x].x,2) + Math.pow(this.pos.y - waypoints[x].y,2)));
				this.targetWaypoint = x;
			}
		}
	}
	this.lastChange += dt;

	if(this.targetWaypoint == -1){
		let mindistance = -1;
		this.targetWaypoint = -1;
		for(let x = 0; x < waypoints.length; x++){
			let between = Math.min( 2*Math.PI - Math.abs(this.direction-waypoints[x].direction), Math.abs(this.direction-waypoints[x].direction) );

			if( (( (Math.sin(between) > 0)) && (Math.sqrt(Math.pow( this.pos.x - waypoints[x].x,2) + Math.pow(this.pos.y - waypoints[x].y,2)) < mindistance)) || (mindistance == -1)  ){

				mindistance = (Math.sqrt(Math.pow( this.pos.x - waypoints[x].x,2) + Math.pow(this.pos.y - waypoints[x].y,2)));
				this.targetWaypoint = x;
			}
		}
	}

	if(this.targetWaypoint != -1){

		//console.log("waypoints length: " + waypoints.length + " target: " + this.targetWaypoint);
		let mindistance = (Math.sqrt(Math.pow( this.pos.x - waypoints[this.targetWaypoint].x,2) + Math.pow(this.pos.y - waypoints[this.targetWaypoint].y,2)));
		if( mindistance < 15 ){
			this.lastChange = 0;
			this.targetWaypoint = waypoints[this.targetWaypoint].connections[ Math.floor((Math.random() * (waypoints[this.targetWaypoint].connections.length)))];
		}

		let crossProduct = Math.sin(this.direction) * (this.pos.y - waypoints[this.targetWaypoint].y) - ( Math.cos(this.direction) * (this.pos.x - waypoints[this.targetWaypoint].x)  );
		if (Math.abs(crossProduct) > 0.05) {
			if (crossProduct > 0){
				this.steerAngle = Math.min(this.steerAngle + this.turningRate * dt, this.maxTurningAngle / (Math.max(100,Math.abs(this.speed))/100) );
			}
			else {
				if (crossProduct < 0){
					this.steerAngle = Math.max(this.steerAngle - this.turningRate * dt, - (this.maxTurningAngle / (Math.max(100,Math.abs(this.speed))/100)) );
				}
			}
		}
		else {
			this.steerAngle = 0;
		}

		let between = -Math.min( 2*Math.PI - Math.abs(this.direction- Math.atan2( waypoints[this.targetWaypoint].x - this.pos.x, waypoints[this.targetWaypoint].y -this.pos.y )),
			Math.abs(this.direction- Math.atan2(waypoints[this.targetWaypoint].x -  this.pos.x, waypoints[this.targetWaypoint].y -this.pos.y )) )

		if ( Math.abs(between) < Math.abs(this.steer_angle) && ((between*this.steer_angle) >= 0 )){
			this.steer_angle = between;
		}

		if (this.speed < this.maxSpeed) {
			this.speed = Math.min(this.speed + this.acceleration*dt, this.maxSpeed);
		}

		let frontWheel = {x: this.pos.x + (this.height*(2/5)) * Math.sin(this.direction),
			y: this.pos.y + (this.height*(2/5)) * Math.cos(this.direction)};
		let backWheel = {x: this.pos.x - (this.height*(2/5)) * Math.sin(this.direction),
			y: this.pos.y - (this.height*(2/5)) * Math.cos(this.direction)};

		frontWheel.x = frontWheel.x + this.speed * dt * Math.sin(this.direction+this.steerAngle);
		frontWheel.y = frontWheel.y + this.speed * dt * Math.cos(this.direction+this.steerAngle);
		backWheel.x =  backWheel.x + this.speed * dt * Math.sin(this.direction);
		backWheel.y = backWheel.y + this.speed * dt * Math.cos(this.direction);

		this.pos.x = (frontWheel.x + backWheel.x)/2;
		this.pos.y = (frontWheel.y + backWheel.y)/2;
		this.direction = Math.atan2((frontWheel.x-backWheel.x),(frontWheel.y-backWheel.y));

	}
}

createWaypoints();

let traffic = new Array(100);
let cars = new Array(100);
for(let i=0; i < traffic.length; i++){
	traffic[i] = new TrafficCar();
	traffic[i].reset();
	//console.log("acted. pos: " + traffic[i].pos.x + "/" + traffic[i].pos.y + "direction: " + traffic[i].direction);
	cars[i] = { x: traffic[i].pos.x, y: traffic[i].pos.y};
}

let dt;
function act() {

  now = Date.now();
  dt = (now - time) * 0.001;
  time = now;

  if (active) {
    //console.log("acting");
    generateCargo();
    sendTaxiData();
	  actProjectiles();
	  actTraffic(dt);
  }

  setTimeout(act,10);
}
act();

function actTraffic(dt){
	for(let i = 0; i < traffic.length; i++){
		traffic[i].act(dt);
		cars[i] = { x: traffic[i].pos.x, y: traffic[i].pos.y};
		//console.log("acted. pos: " + traffic[i].pos.x + "/" + traffic[i].pos.y + "direction: " + traffic[i].direction);
	}
	io.emit('traffic',traffic);
}

function sendTaxiData(){
  for(var t = 0; t < taxis.length; t++){
	 // console.log("index: " + taxis[t].id +  " now: " + now + " lastUpdate: " + taxis[t].lastUpdate + " diff: " + (now - taxis[t].lastUpdate));
    if( (now - taxis[t].lastUpdate) > 200){
		
	  
      taxis.splice(t,1);
    }
  }
  io.emit("taxis", taxis);
}






function createWaypoints(){

	for(let xId=0;xId<maxChunksX;xId++){
		for(let yId=0;yId<maxChunksY;yId++) {

			let xCh = bordersize + xId * chunksize;
			let yCh = bordersize + yId * chunksize;

			waypoints[waypoints.length] = {x: xCh + streetsize/2, y: yCh + chunksize - streetsize, direction: Math.PI, id: 0, matching: [1]};
			waypoints[waypoints.length] = {x: xCh + streetsize/2, y: yCh + streetsize , direction: Math.PI, id: 1, matching: [0,2,6]};
			waypoints[waypoints.length] = {x: xCh + streetsize, y: yCh + streetsize/2 , direction: Math.PI/2, id:2 , matching: [3]};
			waypoints[waypoints.length] = {x: xCh + chunksize - streetsize, y: yCh + streetsize/2, direction: Math.PI/2 ,id: 3, matching: [0,2,4]};
			waypoints[waypoints.length] = {x: xCh + chunksize - streetsize/2, y: yCh + streetsize, direction:0 ,id:4 , matching: [5]};
			waypoints[waypoints.length] = {x: xCh + chunksize - streetsize/2, y: yCh + chunksize - streetsize , direction: 0, id:5, matching: [2,4,6]};
			waypoints[waypoints.length] = {x: xCh + chunksize - streetsize, y: yCh + chunksize - streetsize/2, direction: -Math.PI/2, id:6 ,  matching: [7] };
			waypoints[waypoints.length] = {x: xCh + streetsize, y: yCh + chunksize - streetsize/2, direction: -Math.PI/2, id: 7,matching: [0,4,6] };
		}
	}
	let wp_distance = -1;
	for(let x = 0; x < waypoints.length; x++){
		let w1 = waypoints[x];
		w1.connections = [];
		//console.log("wp: " + w1.x + "/" + w1.y);
		for(let y = 0; y < waypoints.length; y++){
			let w2 = waypoints[y];
			wp_distance = distanceP(w1,w2);
			let between = Math.min( 2*Math.PI - Math.abs(w1.direction-w2.direction), Math.abs(w1.direction-w2.direction) );

			let minWpDistance = 0;
			let maxWpDistance = 0;
			let corners = [0,2,4,6];
			if( (corners.indexOf(w1.id)) != -1 ){
				minWpDistance = chunksize/2;
				maxWpDistance = chunksize - streetsize;
			}
			else{
				minWpDistance = 5;
				maxWpDistance = 2*streetsize + 15;
			}

			if( (x != y) && (wp_distance < maxWpDistance) && (wp_distance > minWpDistance) && (w1.matching.indexOf(w2.id) != -1) /*&& (between <= Math.PI/2)*/ ){
				w1.connections[w1.connections.length] = y;
				//console.log("	connected: " + w2.x + "/" + w2.y);
			}


		}

	}

}







function generateCargo() {
  if( (now-lastCargo) > 300){
    lastCargo = now;

    if(cargo.length<200) {

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

			for(var h=0; h < houses.length; h++){

				var collision = doPolygonsIntersect(mycorners,houses[h]);
				if(collision){
					//console.log("collide with house");
					valid_pos = false;
				}

			}

			for(var b=0;b < bases.length; b++) {
				var collision = doPolygonsIntersect(mycorners,bases[b].form);
				if(collision){
					//console.log("collide with base");
					valid_pos = false;
				}
			}

		}

    	let new_cargo = {
    	        x: pos_x,
    	        y: pos_y,
				color: Math.floor(Math.random() * (maxBases))
    	      };
    	
    	
      cargo[cargo.length] = new_cargo;
      //console.log('generated cargo');

      //console.log('send cargo');
    }
    io.emit('data', cargo);
  }
}

function actProjectiles(){
	for (let p = 0; p < projectiles.length; p++){

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

