<!doctype html>
<html>
	<head>
		<title>Getting Cozy with Browserify</title>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
		<style>
			h1, p, div 	{ text-align: center; }
			html		{ background: #fffffe; }
		</style>
		<!-- <script type="text/javascript" src="{{ URL::asset('js/main.js') }}"></script> -->
	</head>
	<body>
		<div class="container">
			<h2>Welcome to the Client Side.</h2>

			<div class="well">
				<p>I see you've got some numbers. Why not let me see them?</p>

				<div id="response">
				</div>
			</div>
		</div>
		<script src="{{ URL::asset('js/main.js') }}"></script>
		<script src="{{ URL::asset('js/bundle.js') }}"></script>
	</body>
</html>