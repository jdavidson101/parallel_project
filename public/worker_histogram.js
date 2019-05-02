 
// helper function to draw gridlines
function drawLine(ctx, startX, startY, endX, endY,color){
    ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX,endY);
    ctx.stroke();
    ctx.restore();
}

// helper function draw bars on graph
function drawBar(ctx, upperLeftCornerX, upperLeftCornerY, width, height,color){
    ctx.save();
    ctx.fillStyle=color;
    ctx.fillRect(upperLeftCornerX,upperLeftCornerY,width,height);
    ctx.restore();
}

// find min in 2d array
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

// find max in 2d array
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

// event trigger when message received from main thread
onmessage = function( event ) {
	let key = event.data.key;
	importScripts('./data/' + key + '.js');
	let NUM_BINS = 10;
	let data_array = data[key];
	let bin_names = [];
	let bin_data = {};
	let canvas = event.data.canvas;

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
       	gridColor:"black",
       	data:bin_data,
       	colors:colors
	});
		
	histogram.draw();
	let bitmap = canvas.transferToImageBitmap();
	
	self.postMessage({
		key: key,
		bitmap: bitmap,
		names: bin_names,
		colors: colors
	}, [bitmap]);
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
  
        //drawing the bars
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
    }
}

//drawing the grid lines
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