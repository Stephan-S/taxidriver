/*
 * generates a rectangle house
 * param x: x coordinate of the chunk where the house should be created
 * param y: y coordinate of the chunk where the house should be created
 */
var basis = [];

module.exports = {
	generateRectbase: function generateRectbase(basisList,color,x,y,chunksize,streetsize) {
		basis = basisList;
		base = {
				'color':color,
				'form':[{
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
		}]};
		basis[basis.length]=base;
		return basis;
	},	
	generateTrianglebase: function generateTrianglebase(basisList,color,x,y,chunksize,streetsize){
		basis = basisList;
		base = {
				'color':color,
				'form':[{
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
				}]
		};
		basis[basis.length]=base;
		return basis;
	},

}