<!DOCTYPE html>
<html>
<meta charset="utf-8">
<head>
	<title>Your Title Here</title>
	
	<!--Libraries------>
	<script src="https://d3js.org/d3.v4.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	<!----------------->
	
	<!--Linking files-->
	<link rel="stylesheet" href="cssStyle.css">
	<script type="text/javascript" src="{{ URL::asset('js/colormap.js') }}"></script>
	<!----------------->
	)
	
	
</head>
<body>

	<div id="container">
		<center>
		<button type="button" class="dataButtons">bed</button>
		<button type="button" class="dataButtons">smb</button>
		<button type="button" class="dataButtons">surface</button>
		<button type="button" class="dataButtons">t2m</button>
		<button type="button" class="dataButtons">thickness</button>
		<button type="button" class="dataButtons">velocity</button>
		</center>
	</div>

</body>
</html>