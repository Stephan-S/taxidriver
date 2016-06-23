/*
 * generates a rectangle house
 * param x: x coordinate of the chunk where the house should be created
 * param y: y coordinate of the chunk where the house should be created
 */
var houses = [];

module.exports = {
	generateRectHouse: function generateRectHouse(housesList,x,y,chunksize,streetsize) {
		houses = housesList;
		house = [{
			'x': x+streetsize+Math.random()*20,
			'y': y+streetsize+Math.random()*20
		},
		{
			'x': x+(chunksize-streetsize)+Math.random()*20,
			'y': y+streetsize+Math.random()*20
		},
		{
			'x': x+(chunksize-streetsize)+Math.random()*20,
			'y': y+(chunksize-streetsize)+Math.random()*20
		},
		{
			'x': x+streetsize+Math.random()*20,
			'y': y+(chunksize-streetsize)+Math.random()*20
		}];
		houses[houses.length]=house;
		return houses;
	},	
	generateTriangleHouse: function generateTriangleHouse(housesList,x,y,chunksize,streetsize){
		houses = housesList;
		house = [{
			'x': x+60+Math.random()*(chunksize-streetsize*2),
			'y': y+60+Math.random()*chunksize/10
		},
		{
			'x': x+(chunksize-streetsize)-Math.random()*(chunksize-streetsize*2)/3,
			'y': y+(chunksize-streetsize)-Math.random()*(chunksize-streetsize*2)/3
		},
		{
			'x': x+streetsize+Math.random()*(chunksize-streetsize)/3,
			'y': y+(chunksize-streetsize)-Math.random()*(chunksize-streetsize*2)/3
		}];
		houses[houses.length]=house;
		return houses;
	},
	generateDoubleTriangleHouse: function generateDoubleTriangleHouse(housesList,x,y,chunksize,streetsize){
		houses = housesList;
		house = [{
			'x': x+(chunksize-streetsize)+Math.random()*20,
			'y': y+streetsize*2+Math.random()*20
		},
		{
			'x': x+streetsize*2+Math.random()*10,
			'y': y+(chunksize-streetsize)+Math.random()*10
		},
		{
			'x': x+(chunksize-streetsize)+Math.random()*10,
			'y': y+(chunksize-streetsize)+Math.random()*10
		}];
		houses[houses.length]=house;
		house = [
		{
			'x': x+streetsize+Math.random()*10,
			'y': y+streetsize+Math.random()*10
		},
		{
			'x': x+(chunksize-streetsize*2)+Math.random()*10,
			'y': y+streetsize+Math.random()*10
		},
		{
			'x': x+streetsize+Math.random()*20,
			'y': y+(chunksize-streetsize*2)+Math.random()*20
		}];
		houses[houses.length]=house;

		return houses;
	}

}