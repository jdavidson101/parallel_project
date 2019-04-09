
//This function will execute when the page is loaded
$(document).ready(function(){
	
	//Adding a listener to each button.
	$(".dataButtons").click(function(){
		loadRastor($(this).text());

	});



});

//http://geoexamples.com/d3-raster-tools-docs/plot/drawing-raster-data.html
function loadRastor(dataset){
	
	
	//Remove any previous canvas drawn
	d3.selectAll("canvas").remove();
	
	
	/*
	Not the cleanest way to do this but we did this to avoid using
	Node and a server.

	the data is now in variable "data" as a 3d array
	
	This also loads in a datafile of rgb values. This is problematic if we wanted
	to create legends or dynamically create our rgb values based off of data, which
	we could have also done
	*/
	$.getScript(('../data/' + dataset + '_rgb.js') , function (){
		var dataKey = dataset + '_rgb';
		
		var width = 1670; 
		var height = 2991;

		var canvas = d3.select("body").append("canvas")
			.attr("width", width)
			.attr("height", height);

		var context = canvas.node().getContext("2d");

		var canvasRaster = d3.select("body").append("canvas")
			.attr("width", width)
			.attr("height", height)
			.style("display","none");

		var contextRaster = canvasRaster.node().getContext("2d");
		var id = contextRaster.createImageData(width,height);

		//drawing the image
		var imageData = id.data;
		var pos = 0;
		for(var j = 0; j<height; j++){
			for(var i = 0; i<width; i++){
					imageData[j * width*4 + i*4] = parseInt(data[dataKey][j][i][0]);
					imageData[j * width*4 + i*4 + 1] = parseInt(data[dataKey][j][i][1]);
					imageData[j * width*4 + i*4 + 2] = parseInt(data[dataKey][j][i][2]);
					imageData[j * width*4 + i*4 + 3] = 255;

				}
			}
		contextRaster.putImageData(id, 0, 0);
		context.drawImage(canvasRaster.node(), 0, 0);

		});
	
	
}

