<!DOCTYPE html>
<html>
  <head>
  <meta charset="utf-8">
  <meta id="csrf-token" content="{{ csrf_token() }}" />
	<title>Pangolin 4x4</title>

	<link rel='stylesheet' href='//fonts.googleapis.com/css?family=Roboto:500,400,100' type='text/css'>
	<link rel="stylesheet" href="/css/store/template.css">
	<link rel="stylesheet" href="/css/store/font-awesome.min.css">
	<link rel="stylesheet" href="/css/store/lightbox.css">
</head>
<body>
	<div id="app"></div>
	<noscript>
		<h1>Pangolin 4x4 requires javascript to function.</h1>
		<h4>Though it appears that your browser either does not support javascript or has it disabled.<br>
		To use Pangolin4x4 enable Javascript in your options and <a href="/">try again</a></h4>
	</noscript>

	<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', '{{ env('GA_KEY') }}', 'auto');
</script>
	<script src="/js/store/jquery.min.js"></script>
	<script src="/js/store/lightbox.min.js"></script>
	<script src="/js/store/main.js"></script>
</body>
</html>
