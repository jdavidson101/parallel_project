// Riffed heavily from: https://gist.github.com/SpencerCarstens/bd5117e217efc0dffaaf
/*** Build Worker - From Anonymous Function Body
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/


var workerURL = URL.createObjectURL( new Blob( [ '(',
function() {

   /* Message Event */
   onmessage = function( event ) {

    // jsdom has been browserified, now usable in a web worker!
    // importScripts(event.data.url + '/js/jsdom_browserify.js');
	// var jsdom = require('jsdom_capsule');
	
	// var data = event.data.data;
	
    // jsdom.env(
    //     '<svg class="chart"></svg>',
    //     function (err, window) {

	// 		//"document" isn't a member of a worker's global object, so we'll attach
    //     	//jsdom's implementation so d3 can reference it.
	// 		self.document = window.document;
	// 		importScripts( 'http://d3js.org/d3.v3.min.js' );

			// d3.selectAll('canvas').remove();
			
	$.getScript(('../data/' + data + '_rgb.js') , function (){
		var dataKey = data + '_rgb';
		
		// var width = 1670; 
		// var height = 2991;
	
		var canvas = event.canvas;
		canvas.width = 1670;
		canvas.height = 2991;
		
		var context = canvas.getContext("2d");
		
		// var canvasRaster = d3.select("body").append("canvas")
		// 	.attr("width", width)
		// 	.attr("height", height)
		// 	.style("display","none");
		
		// var contextRaster = canvasRaster.node().getContext("2d");
		// var id = contextRaster.createImageData(width,height);
		
		//drawing the image
		// var imageData = id.data;
		// var pos = 0;
		let colors = [0, 0, 0, 255];
		for(var j = 0; j<height; j++){
			for(var i = 0; i<width; i++){
				for(var k = 0; i < 3; k++) {
					colors[k] = parseInt(data[dataKey[j][i][k]]);
				}
				let color = `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[3]})`;
				context.fillStyle = color;
				context.drawRect(j, i, 1, 1);
			}
		}
		// contextRaster.putImageData(id, 0, 0);
		// context.drawImage(canvasRaster.node(), 0, 0);		
	});

	postMessage();

        	// //The following example lifted from: https://bost.ocks.org/mike/bar/2/
        	// var width = 420,
            // 	barHeight = 20;

        	// var x = d3.scale.linear()
            // 	.domain( [0, d3.max(data)] )
            // 	.range( [0, width] );

        	// var chart = d3.select( '.chart' )
            // 	.attr( 'width', width )
            // 	.attr( 'height', barHeight * data.length );


        	// var bar = chart.selectAll( 'g' )
            // 	.data(data)
          	//   .enter().append( 'g' )
            // 	.attr( 'transform', function(d, i) { return 'translate(0,' + i * barHeight + ')'; } );

        	// bar.append( 'rect' )
            // 	.attr( 'width', x )
            // 	.attr( 'height', barHeight - 1 );

        	// bar.append( 'text' )
            // 	.attr( 'x', function(d) { return x(d) - 3; } )
            // 	.attr( 'y', barHeight / 2 )
            // 	.attr( 'dy', '.35em' )
            // 	.text( function(d) { return d; } );

        	// var svg = window.document.body.querySelector( '.chart' );
        	// postMessage(svg.outerHTML);

    //    });
    }
}.toString(), ')()' ], { type: 'application/javascript' } ) ),

/* Init Worker */
worker = new Worker( workerURL );

/*** Main Script
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

// /* Listen for Worker */
// worker.addEventListener( 'message', function( e ) {
// 	if( e.data !== undefined ) {
// 		var fragment = document.createRange().createContextualFragment(e.data);
// 		document.body.appendChild(fragment);
// 	}
// }, false );

/* Start Worker - Pass Seed Data */
// var data = [4, 8, 15, 16, 23, 42];

// worker.postMessage( {
// 	testData: data,
// 	url: document.location.protocol + '//' + document.location.host
// });

/* Revoke Blob */
// URL.revokeObjectURL( workerURL );


//This function will execute when the page is loaded
$(document).ready(function(){
	
	//Adding a listener to each button.
	$(".dataButtons").click(function(){
		var d = $(this.text());	
		var offscreen = document.querySelector('canvas').transferControlToOffscreen();
		worker.postMessage({
			canvas: offscreen,
			data: d,
			url: document.location.protocol + '//' + document.location.host
		}, [offscreen]);
		URL.revokeObjectURL( workerURL );
	});
});

// //http://geoexamples.com/d3-raster-tools-docs/plot/drawing-raster-data.html
// function loadRastor(dataset){
	
	
// 	//Remove any previous canvas drawn
// 	d3.selectAll("canvas").remove();
	
	
// 	/*
// 	Not the cleanest way to do this but we did this to avoid using
// 	Node and a server.

// 	the data is now in variable "data" as a 3d array
	
// 	This also loads in a datafile of rgb values. This is problematic if we wanted
// 	to create legends or dynamically create our rgb values based off of data, which
// 	we could have also done
// 	*/
// 	$.getScript(('../data/' + dataset + '_rgb.js') , function (){
// 		var dataKey = dataset + '_rgb';

// 		//var width = 600;
// 		//var height = 800;
// 		var width = 1670; 
// 		var height = 2991;

// 		var canvas = d3.select("body").append("canvas")
// 			.attr("width", width)
// 			.attr("height", height);

// 		var context = canvas.node().getContext("2d");

// 		var canvasRaster = d3.select("body").append("canvas")
// 			.attr("width", width)
// 			.attr("height", height)
// 			.style("display","none");

// 		var contextRaster = canvasRaster.node().getContext("2d");
// 		var id = contextRaster.createImageData(width,height);

// 		//drawing the image
// 		var imageData = id.data;
// 		var pos = 0;
// 		for(var j = 0; j<height; j++){
// 			for(var i = 0; i<width; i++){
// 					imageData[j * width*4 + i*4] = parseInt(data[dataKey][j][i][0]);
// 					imageData[j * width*4 + i*4 + 1] = parseInt(data[dataKey][j][i][1]);
// 					imageData[j * width*4 + i*4 + 2] = parseInt(data[dataKey][j][i][2]);
// 					imageData[j * width*4 + i*4 + 3] = 255;

// 				}
// 			}
// 		contextRaster.putImageData(id, 0, 0);
// 		context.drawImage(canvasRaster.node(), 0, 0);

// 	});
// }



