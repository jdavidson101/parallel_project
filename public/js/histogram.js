// Global variables to manage interruptions and subsequent requests in main event handler functions
var use_worker = false;
var worker = null;
// var offscreen_exists = false;

// Function to add new canvas element to be used by web worker
function addCanvas(parentId, elementId, display, width, height) {
	let p = document.getElementById(parentId);
	let newElement = document.createElement('canvas');
	newElement.setAttribute('id', elementId);
	newElement.style.display = display;
	newElement.width = width;
	newElement.height = height;
	p.appendChild(newElement);
	return newElement;
}

function addParallelEventHandler() {
	$(".dataButtons").click(function(){
		d3.selectAll("canvas").remove();

		if (worker != null) {
			worker.terminate();
		}

		worker = new Worker('worker_histogram.js');
		let file_id = $(this).text();
		
		let width = 1200;
		let height = 800;

		canvas = addCanvas('body', 'chart', 'block', width, height);
		osCanvas = addCanvas('body', 'offscreen', 'none', width, height);
		
		let offscreen = osCanvas.transferControlToOffscreen();

		// console.log('launching worker');
		worker.postMessage({
			key: file_id,
			canvas: offscreen
		}, [offscreen]);
		
		worker.onmessage = function(e) {
			// console.log('completed worker job');
			drawLegend(e.data.names, e.data.colors);
			let offscreenBitmap = e.data.bitmap;
			context = canvas.getContext("bitmaprenderer");
			context.transferFromImageBitmap(offscreenBitmap);
			worker.terminate();
		};
	});
}

function addSerialEventHandler() {
	// Adding a listener to each button.
	$(".dataButtons").click(function(){
		serialVisualization($(this).text());
	});
}

// This function will execute when the page is loaded
$(document).ready(function(){

	$("#toggle").click(function() {
		$('.dataButtons').off('click');
		if(use_worker == false) {
			use_worker = true;
			$(this).html("Do Not Use Workers");
			addParallelEventHandler();
		}
		else {
			use_worker = false;
			$(this).html("Use Workers");
			addSerialEventHandler();
		}	
	})
	
	// Adding a listener to each button.
	$(".dataButtons").click(function(){
		serialVisualization($(this).text());
	});
});

function drawLine(ctx, startX, startY, endX, endY,color){
    ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX,endY);
    ctx.stroke();
    ctx.restore();
}

function drawBar(ctx, upperLeftCornerX, upperLeftCornerY, width, height,color){
    ctx.save();
    ctx.fillStyle=color;
    ctx.fillRect(upperLeftCornerX,upperLeftCornerY,width,height);
    ctx.restore();
}

 //draw legend
function drawLegend(data, colors) {
    barIndex = 0;
    var legend = document.querySelector("legend[for='myCanvas']");
    var ul = document.createElement("ul");
    legend.append(ul);
    for (categ in data){
        var li = document.createElement("li");
        li.style.listStyle = "none";
        li.style.borderLeft = "20px solid "+colors[barIndex%colors.length];
        li.style.padding = "5px";
        li.textContent = data[categ];
        ul.append(li);
        barIndex++;
    }
}

function findMin(data) {
	let result = Number.MAX_SAFE_INTEGER;
	for(var i = 0; i < data.length; i++) {
		for(var j = 0; j < data[i].length; j++) {
			let cur = data[i][j];
			if(cur < result) {
				result = cur;
			}
		}
	}
	return result;
}

function findMax(data) {
	let result = Number.MIN_SAFE_INTEGER;
	for(var i = 0; i < data.length; i++) {
		for(var j = 0; j < data[i].length; j++) {
			let cur = data[i][j];
			if(cur > result) {
				result = cur;
			}
		}
	}
	return result;
}

//http://geoexamples.com/d3-raster-tools-docs/plot/drawing-raster-data.html
function serialVisualization(dataset){
	
	
	//Remove any previous canvas drawn
	// d3.selectAll("canvas").remove();
	
	$.getScript(('./data/' + dataset + '.js') , function (){
		let key = dataset;

		let data_array = data[key];
		let bin_names = [];
		let bin_data = {};

		let canvas = document.getElementById('chart');

		canvas.width = 1200;
		canvas.height = 800;

		let context = canvas.getContext('2d');

		let NUM_BINS = 10;

		let bins = new Uint32Array(NUM_BINS);
		let min = findMin(data_array);
		let max = findMax(data_array);

		let range = Math.floor(Math.abs((max - min))/(NUM_BINS+2));

		for(var i = 0; i < bins.length - 1; i++) {
			let bin_name = '< ' + Math.floor((min + range * (1 + i)));
			bin_names.push(bin_name);
		}

		bin_names.push('> ' + Math.floor((min + range * (1 + 10))));

		for(var i = 0; i < data_array.length; i++) {
			for (var j = 0; j < data_array[i].length; j++) {
				for (var k = 0; k <= bins.length; k++) {
					let cur = data_array[i][j];
					if (cur < (min + range * (1 + k))) {
						bins[k] += 1;
						k = NUM_BINS;
					}
				}
			}
		}

		for(var i = 0; i < NUM_BINS; i++) {
			bin_data[bin_names[i]] = bins[i];
		}

		colors = ['grey', 'blue', 'purple', 'yellow', 'black', 'brown', 'red', 'orange', 'green', 'cyan'];
		 
		var histogram = new Barchart(
    	{
        	canvas:canvas,
        	seriesName:key,
        	padding:20,
        	gridScale:5,
        	gridColor:"#eeeeee",
        	data:bin_data,
        	colors:colors
		});
		
		histogram.draw();
	});
}

var Barchart = function(options){
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.colors = options.colors;
  
    this.draw = function(){
        var maxValue = 0;
        for (var categ in this.options.data){
            maxValue = Math.max(maxValue,this.options.data[categ]);
        }
        var canvasActualHeight = this.canvas.height - this.options.padding * 2;
        var canvasActualWidth = this.canvas.width - this.options.padding * 2;
 
        var barIndex = 0;
        var numberOfBars = Object.keys(this.options.data).length;
        var barSize = (canvasActualWidth)/numberOfBars;
 
        for (categ in this.options.data){
            var val = this.options.data[categ];
            var barHeight = Math.round( canvasActualHeight * val/maxValue) ;
            drawBar(
                this.ctx,
                this.options.padding + barIndex * barSize,
                this.canvas.height - barHeight - this.options.padding,
                barSize,
                barHeight,
                this.colors[barIndex%this.colors.length]
            );
 
            barIndex++;
        }
 
        //drawing series name
        this.ctx.save();
        this.ctx.textBaseline="bottom";
        this.ctx.textAlign="center";
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "bold 14px Arial";
        this.ctx.fillText(this.options.seriesName, this.canvas.width/2,this.canvas.height);
        this.ctx.restore();  
         
        // draw legend
        barIndex = 0;
        var legend = document.querySelector("legend[for='myCanvas']");
        var ul = document.createElement("ul");
        legend.append(ul);
        for (categ in this.options.data){
            var li = document.createElement("li");
            li.style.listStyle = "none";
            li.style.borderLeft = "20px solid "+this.colors[barIndex%this.colors.length];
            li.style.padding = "5px";
            li.textContent = categ;
            ul.append(li);
            barIndex++;
        }
    }
}
// //drawing the grid lines
        // var gridValue = 0;
        // while (gridValue <= maxValue){
        //     var gridY = canvasActualHeight * (1 - gridValue/maxValue) + this.options.padding;
        //     drawLine(
        //         this.ctx,
        //         0,
        //         gridY,
        //         this.canvas.width,
        //         gridY,
        //         this.options.gridColor
        //     );
             
        //     //writing grid markers
        //     this.ctx.save();
        //     this.ctx.fillStyle = this.options.gridColor;
        //     this.ctx.textBaseline="bottom"; 
        //     this.ctx.font = "bold 10px Arial";
        //     this.ctx.fillText(gridValue, 10,gridY - 2);
        //     this.ctx.restore();
 
        //     gridValue+=this.options.gridScale;
        // }      
  
        //drawing the bars
// for(var i = 0; i < data_array.length; i++) {
		// 	for(var j = 0; j < data_array[i].length; j++) {
		// 		let cur = data_array[i][j];
		// 		if(cur > max) {
		// 			max = cur;
		// 		}
		// 		else if(cur < min) {
		// 			min = cur;
		// 		}
		// 	}
		// }
		// console.log('min, max');
		// console.log([min, max]);
		// console.log('data array rows');
		// console.log(data_array.length);
		// console.log('data array cols');
		// console.log(data_array[0].length);
		// console.log('range');
		// console.log(range);

		// console.log(bin_names);
		// let bins = [0,0,0,0,0,0,0,0,0,0];
		// console.log(bin_data);
		// let colors = ["#a55ca5","#67b6c7", "#bccd7a","#eb9743"];
		// let bar_heights = new Array(NUM_BINS);
		// let max_bin = 0;
		// for(var i = 0; i < NUM_BINS; i++) {
		// 	if (bins[i] > max_bin) {
		// 		max_bin = bins[i]
		// 	}
		// }

		// for(var i = 0; i < NUM_BINS; i++) {
		// 	bar_heights[i] = Math.ceil(bins[i]/max_bin * (canvas.height - 200));
		// }
