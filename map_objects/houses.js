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
			'x': x+streetsize,
			'y': y+streetsize
		},
		{
			'x': x+(chunksize-streetsize),
			'y': y+streetsize
		},
		{
			'x': x+(chunksize-streetsize),
			'y': y+(chunksize-streetsize)
		},
		{
			'x': x+streetsize,
			'y': y+(chunksize-streetsize)
		}];
		houses[houses.length]=house;
		return houses;
	},	
	generateCrossHouse: function generateCrossHouse(housesList,x,y,chunksize,streetsize){
		houses = housesList;
		for(x_id= 0;x_id<2;x_id++){
			for(y_id=0;y_id<2;y_id++) {
				house = [{
					'x': x+streetsize+((chunksize-streetsize)/2)*x_id + (streetsize/6)*x_id,
					'y': y+streetsize+((chunksize-streetsize)/2)*y_id+(streetsize/6)*y_id
				},
				{
					'x': x+(chunksize-streetsize)/2+((chunksize-streetsize)/2)*x_id + (streetsize/6)*x_id-streetsize/6,
					'y': y+streetsize+((chunksize-streetsize)/2)*y_id+(streetsize/6)*y_id
				},
				{
					'x': x+(chunksize-streetsize)/2+((chunksize-streetsize)/2)*x_id + (streetsize/6)*x_id-streetsize/6,
					'y': y+(chunksize-streetsize)/2+((chunksize-streetsize)/2)*y_id+(streetsize/6)*y_id-streetsize/6
				},
				{
					'x': x+streetsize+((chunksize-streetsize)/2)*x_id + (streetsize/6)*x_id,
					'y': y+(chunksize-streetsize)/2+((chunksize-streetsize)/2)*y_id+(streetsize/6)*y_id-streetsize/6
				}];
				houses[houses.length]=house;
			}
		}
		return houses;
	},
	generateDoubleHouseType1: function generateDoubleHouseType1(housesList,x,y,chunksize,streetsize){
		houses = housesList;
		for(y_id=0;y_id<2;y_id++) {
			house = [{
				'x': x+streetsize,
				'y': y+streetsize+((chunksize-streetsize)/2)*y_id+(streetsize/4)*y_id
			},
			{
				'x': x+(chunksize-streetsize),
				'y': y+streetsize+((chunksize-streetsize)/2)*y_id+(streetsize/4)*y_id
			},
			{
				'x': x+(chunksize-streetsize),
				'y': y+(chunksize-streetsize)/2+((chunksize-streetsize)/2)*y_id+(streetsize/4)*y_id-streetsize/4
			},
			{
				'x': x+streetsize,
				'y': y+(chunksize-streetsize)/2+((chunksize-streetsize)/2)*y_id+(streetsize/4)*y_id-streetsize/4
			}];
			houses[houses.length]=house;
		}
		return houses;
	},
	generateDoubleHouseType2: function generateDoubleHouseType2(housesList,x,y,chunksize,streetsize){
		houses = housesList;
		for(x_id= 0;x_id<2;x_id++){
				house = [{
					'x': x+streetsize+((chunksize-streetsize)/2)*x_id + (streetsize/4)*x_id,
					'y': y+streetsize
				},
				{
					'x': x+(chunksize-streetsize)/2+((chunksize-streetsize)/2)*x_id + (streetsize/4)*x_id-streetsize/4,
					'y': y+streetsize
				},
				{
					'x': x+(chunksize-streetsize)/2+((chunksize-streetsize)/2)*x_id + (streetsize/4)*x_id-streetsize/4,
					'y': y+(chunksize-streetsize)
				},
				{
					'x': x+streetsize+((chunksize-streetsize)/2)*x_id + (streetsize/4)*x_id,
					'y': y+(chunksize-streetsize)
				}];
				houses[houses.length]=house;
		}
		return houses;
	},
	generateDoubleTriangleHouseType1: function generateDoubleTriangleHouseType1(housesList,x,y,chunksize,streetsize){
		houses = housesList;
		house = [
		 		{
		 			'x': x+streetsize,
		 			'y': y+streetsize
		 		},
		 		{
		 			'x': x+(chunksize-streetsize*2),
		 			'y': y+streetsize
		 		},
		 		{
		 			'x': x+streetsize,
		 			'y': y+(chunksize-streetsize*2)
		 		}];
		houses[houses.length]=house;
		house = [{
			'x': x+(chunksize-streetsize),
			'y': y+streetsize*2
		},
		{
			'x': x+streetsize*2,
			'y': y+(chunksize-streetsize)
		},
		{
			'x': x+(chunksize-streetsize),
			'y': y+(chunksize-streetsize)
		}];
		houses[houses.length]=house;
		return houses;
	},
	generateDoubleTriangleHouseType2: function generateDoubleTriangleHouseType2(housesList,x,y,chunksize,streetsize){
		houses = housesList;
		house = [{
		 			'x': x+streetsize*2,
		 			'y': y+streetsize
		 		},
		 		{
		 			'x': x+(chunksize-streetsize),
		 			'y': y+streetsize
		 		},
		 		{
		 			'x': x+(chunksize-streetsize),
		 			'y': y+(chunksize-streetsize*2)
		 		}];
		houses[houses.length]=house;
		house =  [{
 			'x': x+streetsize,
 			'y': y+streetsize*2
 		},
 		{
 			'x': x+(chunksize-streetsize*2),
 			'y': y+(chunksize-streetsize)
 		},
 		{
 			'x': x+streetsize,
 			'y': y+(chunksize-streetsize)
 		}];
		houses[houses.length]=house;

		return houses;
	}
}