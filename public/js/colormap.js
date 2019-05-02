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

		let file_id = $(this).text();
		
		let width = 1670;
		let height = 2991;

		canvas = addCanvas('body', 'chart', 'block', width, height);
		osCanvas = addCanvas('body', 'offscreen', 'none', width, height);
		
		let offscreen = osCanvas.transferControlToOffscreen();
		
		
		worker = new Worker('worker_colormap.js');
		worker.postMessage({
			key: file_id,
			canvas: offscreen
		}, [offscreen]);
		
		worker.onmessage = function(e) {
			if (e.data.msg == 'time') {
				console.log(e.data.e + ' took: ' + e.data.time + ' ms');
			}
			else {
				t1 = performance.now();
				let offscreenBitmap = e.data.bitmap;
				context = canvas.getContext("bitmaprenderer");
				context.transferFromImageBitmap(offscreenBitmap);
				let t2 = performance.now();
				res = t2 - t1;
				console.log('Generating image from bitmap took: ' + res + ' ms');
				worker.terminate();
			}
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

//http://geoexamples.com/d3-raster-tools-docs/plot/drawing-raster-data.html
function serialVisualization(dataset){
	
	
	//Remove any previous canvas drawn
	d3.selectAll("canvas").remove();
	
	$.getScript(('../data/' + dataset + '_rgb.js') , function (){
		var dataKey = dataset + '_rgb';

		let width = 1670; 
		let height = 2991;

		let canvas = d3.select("#body").append("canvas")
			.attr("width", width)
			.attr("height", height);

		let context = canvas.node().getContext("2d");

		let canvasRaster = d3.select("#body").append("canvas")
			.attr("width", width)
			.attr("height", height)
			.style("display","none");

		let contextRaster = canvasRaster.node().getContext("2d");
		let id = contextRaster.createImageData(width,height);

		let imageData = id.data;
		let pos = 0;
		let index = 0;
		for(var i = 0; i < data.length; i++) {
			imageData[i] = data[index]
			imageData[i + 1] = data[index + 1];
			imageData[i + 2] = data[index + 2];
			imageData[i + 3] = 255;
			i += 3;
			index += 3;
		}
		contextRaster.putImageData(id, 0, 0);
		context.drawImage(canvasRaster.node(), 0, 0);

		});
	
	
}

/***************************************************
		Previous code in case of error
***************************************************/
// time: t1,
// let t1 = performance.now();
// t1 = e.data.time;
				// let t2 = performance.now();
				// let res = t2 - t1;
				// console.log(e.data.e + ' took: ' + res + ' ms');
// var use_worker = true;
// var worker = null;
// var offscreen_exists = false;

// //This function will execute when the page is loaded
// function addCanvas(parentId, elementId, display, width, height) {
// 	let p = document.getElementById(parentId);
// 	let newElement = document.createElement('canvas');
// 	newElement.setAttribute('id', elementId);
// 	newElement.style.display = display;
// 	newElement.width = width;
// 	newElement.height = height;
// 	p.appendChild(newElement);
// 	return newElement;
// }

// function removeElement(elementId) {
// 	let element = document.getElementById(elementId);
// 	element.parentNode.removeChild(element);
// }

// $(document).ready(function(){
	
// 	if(use_worker == false) {
// 		// Adding a listener to each button.
// 		$(".dataButtons").click(function(){
// 			loadRastor($(this).text());
// 		});
// 	}
// 	else {
// 		$(".dataButtons").click(function(){
// 			if (worker != null) {
// 				worker.terminate();
// 			}
// 			worker = new Worker('worker_colormap.js');
// 			let file_id = $(this).text();
// 			// let d = data;
// 			let width = 1670;
// 			let height = 2991;
	
// 			if (offscreen_exists) {
// 				removeElement('offscreen');
// 				offscreen_exists = false;
// 			}

// 			let osCanvas = addCanvas('body', 'offscreen', 'none', width, height);
// 			// let os_canvas = document.createElement('canvas');
// 			// os_canvas.setAttribute('id', 'offscreen');

// 			offscreen_exists = true;
			
// 			let offscreen = osCanvas.transferControlToOffscreen();
// 			// var canvas = $('canvas#chart');
// 			// var tmpCanvas = $('<canvas>').attr('width', width).attr(w)
	
// 			let canvas = document.getElementById("chart")
// 			canvas.width = width;
// 			canvas.height = height;
	
// 			// let context = canvas.node().getContext("2d");
	
// 			// let canvasRaster = document.getElementById("raster")
	
// 			// let offscreen = canvasRaster.transferControlToOffscreen();
// 			// var contextRaster = canvasRaster.node().getContext("2d");
// 			// var id = contextRaster.createImageData(width,height);
	
// 			// worker.postMessage({
// 			// 	data: d
// 			// }, [d.buffer]);
	
// 			worker.postMessage({
// 				key: file_id,
// 				canvas: offscreen
// 				// data: d,
// 				// url: document.location.protocol + '//' + document.location.host
// 			}, [offscreen]);
			
// 			worker.onmessage = function(e) {
// 				d = e.data.data
// 				// let map = e.data.colormap;
// 				let offscreenBitmap = e.data.bitmap;
// 				context = canvas.getContext("bitmaprenderer");
// 				context.transferFromImageBitmap(offscreenBitmap);
				
// 				// for(var i = 0; i < map.length; i++) {
// 				// 	id.data[i] = map[i];
// 				// }
// 				// contextRaster.putImageData(id, 0, 0);
// 				// context.drawImage(canvasRaster, 0, 0);
				
// 				worker.terminate();
// 			};
// 		});
// 	}
// 	// $(".dataButtons").click(function(){
// 	// 	worker = new Worker('worker_colormap.js');
// 	// 	// let d = data;
// 	// 	let height = 2991;
// 	// 	let width = 1670;

// 	// 	// var offscreen = document.querySelector('canvas').transferControlToOffscreen();
// 	// 	// var canvas = $('canvas#chart');
// 	// 	// var tmpCanvas = $('<canvas>').attr('width', width).attr(w)

// 	// 	let canvas = document.getElementById("chart")
// 	// 	canvas.width = 1670;
// 	// 	canvas.height = 2991;

// 	// 	// let context = canvas.node().getContext("2d");

// 	// 	let canvasRaster = document.getElementById("raster")
// 	// 	canvasRaster.width = 1670;
// 	// 	canvasRaster.height = 2991;

// 	// 	let offscreen = canvasRaster.transferControlToOffscreen();
// 	// 	// var contextRaster = canvasRaster.node().getContext("2d");
// 	// 	// var id = contextRaster.createImageData(width,height);

// 	// 	// worker.postMessage({
// 	// 	// 	data: d
// 	// 	// }, [d.buffer]);

// 	// 	worker.postMessage({
// 	// 		canvas: offscreen
// 	// 		// data: d,
// 	// 		// url: document.location.protocol + '//' + document.location.host
// 	// 	}, [offscreen]);
		
// 	// 	worker.onmessage = function(e) {
// 	// 		d = e.data.data
// 	// 		// let map = e.data.colormap;
// 	// 		let offscreenBitmap = e.data.bitmap;
// 	// 		context = canvas.getContext("bitmaprenderer");
// 	// 		context.transferFromImageBitmap(offscreenBitmap);
			
// 	// 		// for(var i = 0; i < map.length; i++) {
// 	// 		// 	id.data[i] = map[i];
// 	// 		// }
// 	// 		// contextRaster.putImageData(id, 0, 0);
// 	// 		// context.drawImage(canvasRaster, 0, 0);
			
// 	// 		worker.terminate();
// 	// 	};
// 	// });
// });

// worker.onmessage = function(e) {
// 	d = e.data.data
// 	// let map = e.data.colormap;
// 	let offscreenBitmap = e.data.bitmap;
// 	context = canvas.getContext("bitmaprenderer");
// 	context.transferFromImageBitmap(offscreenBitmap);
	
// 	// for(var i = 0; i < map.length; i++) {
// 	// 	id.data[i] = map[i];
// 	// }
// 	// contextRaster.putImageData(id, 0, 0);
// 	// context.drawImage(canvasRaster, 0, 0);
	
// 	worker.terminate();
// };