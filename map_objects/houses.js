/*
 * generates a rectangle house
 * param x: x coordinate of the chunk where the house should be created
 * param y: y coordinate of the chunk where the house should be created
 */
var houses = [];

module.exports = {
	houseTypes: 6,
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
	generateCrossHouse: function generateCrossHouse(housesList,x,y,chunksize,streetsize){
		houses = housesList;
		for(var x_id= 0;x_id<2;x_id++){
			for(var y_id=0;y_id<2;y_id++) {
				house = [{
					'x': x+streetsize+Math.random()*5+(chunksize/2)*x_id+Math.pow(-1,x_id)*(streetsize/4),
					'y': y+streetsize+Math.random()*5+(chunksize/2)*y_id+Math.pow(-1,y_id)*(streetsize/4)
				},
				{
					'x': x+(chunksize-streetsize)/2+Math.random()*5+(chunksize/2)*x_id+Math.pow(-1,x_id)*(streetsize/4),
					'y': y+streetsize+Math.random()*5+(chunksize/2)*y_id+Math.pow(-1,y_id)*(streetsize/4)
				},
				{
					'x': x+(chunksize-streetsize)/2+Math.random()*5+(chunksize/2)*x_id+Math.pow(-1,x_id)*(streetsize/4),
					'y': y+(chunksize-streetsize)/2+Math.random()*5+(chunksize/2)*y_id+Math.pow(-1,y_id)*(streetsize/4)
				},
				{
					'x': x+streetsize+Math.random()*20+(chunksize/2)*x_id+Math.pow(-1,x_id)*(streetsize/4),
					'y': y+(chunksize-streetsize)/2+Math.random()*5+(chunksize/2)*y_id+Math.pow(-1,y_id)*(streetsize/4)
				}];
				houses[houses.length]=house;
			}
		}
		return houses;
	},
	generateDoubleHouseType1: function generateDoubleHouseType1(housesList,x,y,chunksize,streetsize){
		houses = housesList;
		for(var y_id=0;y_id<2;y_id++) {
			house = [{
				'x': x+streetsize+Math.random()*5,
				'y': y+streetsize+Math.random()*5+(chunksize/2)*y_id+Math.pow(-1,y_id)*(streetsize/4)
			},
			{
				'x': x+(chunksize-streetsize)+Math.random()*5,
				'y': y+streetsize+Math.random()*5+(chunksize/2)*y_id+Math.pow(-1,y_id)*(streetsize/4)
			},
			{
				'x': x+(chunksize-streetsize)+Math.random()*5,
				'y': y+(chunksize-streetsize)/2+Math.random()*5+(chunksize/2)*y_id+Math.pow(-1,y_id)*(streetsize/4)
			},
			{
				'x': x+streetsize+Math.random()*20,
				'y': y+(chunksize-streetsize)/2+Math.random()*5+(chunksize/2)*y_id+Math.pow(-1,y_id)*(streetsize/4)
			}];
			houses[houses.length]=house;
		}
		return houses;
	},
	generateDoubleHouseType2: function generateDoubleHouseType2(housesList,x,y,chunksize,streetsize){
		houses = housesList;
		for(var x_id= 0;x_id<2;x_id++){
				house = [{
					'x': x+streetsize+Math.random()*5+(chunksize/2)*x_id+Math.pow(-1,x_id)*(streetsize/4),
					'y': y+streetsize+Math.random()*5
				},
				{
					'x': x+(chunksize-streetsize)/2+Math.random()*5+(chunksize/2)*x_id+Math.pow(-1,x_id)*(streetsize/4),
					'y': y+streetsize+Math.random()*5
				},
				{
					'x': x+(chunksize-streetsize)/2+Math.random()*5+(chunksize/2)*x_id+Math.pow(-1,x_id)*(streetsize/4),
					'y': y+(chunksize-streetsize)+Math.random()*5
				},
				{
					'x': x+streetsize+Math.random()*20+(chunksize/2)*x_id+Math.pow(-1,x_id)*(streetsize/4),
					'y': y+(chunksize-streetsize)+Math.random()*5
				}];
				houses[houses.length]=house;
		}
		return houses;
	},
	generateDoubleTriangleHouseType1: function generateDoubleTriangleHouseType1(housesList,x,y,chunksize,streetsize){
		houses = housesList;
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
		return houses;
	},
	generateDoubleTriangleHouseType2: function generateDoubleTriangleHouseType2(housesList,x,y,chunksize,streetsize){
		houses = housesList;
		house = [{
		 			'x': x+streetsize*2+Math.random()*10,
		 			'y': y+streetsize+Math.random()*10
		 		},
		 		{
		 			'x': x+(chunksize-streetsize)+Math.random()*10,
		 			'y': y+streetsize+Math.random()*10
		 		},
		 		{
		 			'x': x+(chunksize-streetsize)+Math.random()*10,
		 			'y': y+(chunksize-streetsize)+Math.random()*10
		 		}];
		houses[houses.length]=house;
		house =  [{
 			'x': x+streetsize+Math.random()*10,
 			'y': y+streetsize*2+Math.random()*10
 		},
 		{
 			'x': x+(chunksize-streetsize*2)+Math.random()*10,
 			'y': y+(chunksize-streetsize)+Math.random()*10
 		},
 		{
 			'x': x+streetsize+Math.random()*10,
 			'y': y+(chunksize-streetsize)+Math.random()*10
 		}];
		houses[houses.length]=house;

		return houses;
	}
}