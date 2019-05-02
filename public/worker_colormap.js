 
 
 /* Message Event */
 onmessage = function( event ) {
	let key = event.data.key;

	t1 = performance.now();	
	importScripts('./data/' + key + '_rgb.js');
	t2 = performance.now();
	let res = t2 - t1;
	postMessage({
		msg: 'time',
		e: 'import data',
		time: res
	});

	let canvas = event.data.canvas;
	let context = canvas.getContext("2d");

	var map = new Uint8Array(data.length + data.length/3);

	t1 = performance.now();
	var index = 0;
	for(var i = 0; i < data.length; i+=4) {
		map[i] = data[index]
		map[i + 1] = data[index + 1];
		map[i + 2] = data[index + 2];
		map[i + 3] = 255;
		index += 3;
	}
	
	let image_data = context.createImageData(canvas.width, canvas.height);

	for(var i = 0; i < map.length; i++) {
		image_data.data[i] = map[i];
	}
	t2 = performance.now();
	res = t2 - t1;
	postMessage({
		msg: 'time',
		e: 'process data',
		time: res
	});

	context.putImageData(image_data, 0, 0);
	let bitmap = canvas.transferToImageBitmap();
	self.postMessage({
		msg: 'Worker complete',
		e: 'Finished generating image data',
		bitmap: bitmap
	}, [bitmap]);
}

/****************************************************************
	 previous attempts at working parallel visualization
****************************************************************/
// let t1 = event.data.time;
	// if (event.data) {
	// 	let t2 = performance.now();
	// 	var res = t1 - t2;
	// }
	// postMessage({
	// 	msg: 'time',
	// 	e: 'launch worker',
	// 	time: res
	// });
// t1 = performance.now();
// time: t1,
// let data_array = data[key];
// self.importScripts("../data/" + event.data.data + "_rgb.js");
// let d = event.data.data;
	// for(var i = 0; i < 1000000000; i++) {
	// 	let j = i;	
	// }
	// console.log(data);
	// let height = 2991;
	// let width = 1670;
	// let canvas = new OffscreenCanvas(width, height);
	// canvas.style.display = 'none';
	// canvas.width = width;
	// canvas.height = height;
	// var tmpCanvas = new OffscreenCanvas(width, height).style("display", "none");
	// var tmpCanvasCtx = tmpCanvas.getContext('2d');

	// context.commit();
	// let colors = [0, 0, 0, 255];
	// for(var i = 0; i<num; i++) {
	// 	colors[0] = parseInt(data[i*3]);
	// 	colors[1] = parseInt(data[i*3+1]);
	// 	colors[2] = parseInt(data[i*3+2]);
	// 	let color = `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[3]}, ${255})`;
	// 	// console.log(color);
	// 	context.fillStyle = color;
	// 	context.fillRect((i%width), (i/width), 10, 10);
	// }

	// self.postMessage({
	// 	bitmap: bitmap
	// 	// data: d
	// 	// colormap: map
	// }, [bitmap, d.buffer]);

	// var canvasRaster = d3.select("body").append("canvas")
	// 		.attr("width", width)
	// 		.attr("height", height)
	// 		.style("display","none");

	// 	var contextRaster = canvasRaster.node().getContext("2d");
	// 	var id = contextRaster.createImageData(width,height);

	// 	//drawing the image
	// 	var imageData = id.data;
	// 	var pos = 0;
	// 	for(var j = 0; j<height; j++){
	// 		for(var i = 0; i<width; i++){
	// 				imageData[j * width*4 + i*4] = parseInt(data[dataKey][j][i][0]);
	// 				imageData[j * width*4 + i*4 + 1] = parseInt(data[dataKey][j][i][1]);
	// 				imageData[j * width*4 + i*4 + 2] = parseInt(data[dataKey][j][i][2]);
	// 				imageData[j * width*4 + i*4 + 3] = 255;

	// 			}
	// 		}
	// 	contextRaster.putImageData(id, 0, 0);
	// 	context.drawImage(canvasRaster.node(), 0, 0);
	//  context.drawImage(canvas, 0, 0); //sometimes causes black screen??????