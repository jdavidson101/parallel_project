<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/home', function() {
	return view('home');
});

Route::get('/intro', function() {
	return view('intro');
});

Route::get('/colormap', function() {
	return view('colormap');
});

Route::get('/histogram', function() {
	return view('histogram');
});