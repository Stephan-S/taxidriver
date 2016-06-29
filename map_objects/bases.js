/*
 * generates a rectangle house
 * param x: x coordinate of the chunk where the house should be created
 * param y: y coordinate of the chunk where the house should be created
 */
var bases = [];

module.exports = {
	baseTypes: 4,
	generateRectBase: function generateRectBase(basesList,color,x,y,chunksize,streetsize) {
		bases = basesList;
		base = {
				'color':color,
				'form':[{
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
		}]};
		bases[bases.length]=base;
		return bases;
	},		
	generateRectBaseHouseType1: function generateRectBaseHouseType1(basesList,houseList,color,x,y,chunksize,streetsize) {
		bases = basesList;
		houses = [];
		houses = houseList;
		base = {
				'color':color,
				'form':[{
					'x': x+streetsize,
					'y': y+streetsize
				},
				{
					'x': x+streetsize+(chunksize-streetsize*2)/2,
					'y': y+streetsize
				},
				{
					'x': x+streetsize+(chunksize-streetsize*2)/2,
					'y': y+(chunksize-streetsize)
				},
				{
					'x': x+streetsize,
					'y': y+(chunksize-streetsize)
		}]};
		bases[bases.length]=base;
		house = [{
					'x': x+streetsize+(chunksize-streetsize*2)/2,
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
					'x': x+streetsize+(chunksize-streetsize*2)/2,
					'y': y+(chunksize-streetsize)
		}];
		houses[houses.length]=house;
		building={bases:bases,houses:houses};
		return building;
	},
	generateRectBaseHouseType2: function generateRectBaseHouseType2(basesList,houseList,color,x,y,chunksize,streetsize) {
		bases = basesList;
		houses = [];
		houses = houseList;
		base = {
				'color':color,
				'form':[{
					'x': x+streetsize,
					'y': y+streetsize
				},
				{
					'x': x+(chunksize-streetsize),
					'y': y+streetsize
				},
				{
					'x': x+(chunksize-streetsize),
					'y': y+streetsize+(chunksize-streetsize*2)/2
				},
				{
					'x': x+streetsize,
					'y': y+streetsize+(chunksize-streetsize*2)/2
		}]};
		bases[bases.length]=base;
		house = [{
					'x': x+streetsize,
					'y': y+streetsize+(chunksize-streetsize*2)/2
				},
				{
					'x': x+(chunksize-streetsize),
					'y': y+streetsize+(chunksize-streetsize*2)/2
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
		building={bases:bases,houses:houses};
		return building;
	},
	generateRectBaseHouseType3: function generateRectBaseHouseType3(basesList,houseList,color,x,y,chunksize,streetsize) {
		bases = basesList;
		houses = [];
		houses = houseList;
		base = {
				'color':color,
				'form':[{
					'x': x+streetsize+(chunksize-streetsize*2)/2,
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
					'x': x+streetsize+(chunksize-streetsize*2)/2,
					'y': y+(chunksize-streetsize)
		}]};
		bases[bases.length]=base;
		house = [{
					'x': x+streetsize,
					'y': y+streetsize
				},
				{
					'x': x+streetsize+(chunksize-streetsize*2)/2,
					'y': y+streetsize
				},
				{
					'x': x+streetsize+(chunksize-streetsize*2)/2,
					'y': y+(chunksize-streetsize)
				},
				{
					'x': x+streetsize,
					'y': y+(chunksize-streetsize)
		}];
		houses[houses.length]=house;
		building={bases:bases,houses:houses};
		return building;
	},
	generateRectBaseHouseType4: function generateRectBaseHouseType4(basesList,houseList,color,x,y,chunksize,streetsize) {
		bases = basesList;
		houses = [];
		houses = houseList;
		base = {
				'color':color,
				'form':[{
					'x': x+streetsize,
					'y': y+streetsize+(chunksize-streetsize*2)/2
				},
				{
					'x': x+(chunksize-streetsize),
					'y': y+streetsize+(chunksize-streetsize*2)/2
				},
				{
					'x': x+(chunksize-streetsize),
					'y': y+(chunksize-streetsize)
				},
				{
					'x': x+streetsize,
					'y': y+(chunksize-streetsize)
		}]};
		bases[bases.length]=base;
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
					'y': y+streetsize+(chunksize-streetsize*2)/2
				},
				{
					'x': x+streetsize,
					'y': y+streetsize+(chunksize-streetsize*2)/2
		}];
		houses[houses.length]=house;
		building={bases:bases,houses:houses};
		return building;
	},

}