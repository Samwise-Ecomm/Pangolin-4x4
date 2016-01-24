<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
	<title>P4x4: {{ $page['name'] }}</title>

	<link rel='stylesheet' href='http://fonts.googleapis.com/css?family=Roboto:400,100' type='text/css'>
	<link rel="stylesheet" href="/css/store/template.css">
	<link rel="stylesheet" href="/css/store/font-awesome.min.css">
	<link rel="stylesheet" href="/css/store/lightbox.css">

	<script src="/js/store/jquery.min.js"></script>
	<script src="/js/store/lightbox.min.js"></script>
	<script src="/js/store/cart.js"></script>
	<script src="/js/store/debounce.min.js"></script>

</head>
<body class="search"> {{-- or noSearch --}}
	<div id="Head">
		<div id="Head-highlightBar"></div>
		<div id="Head-titleBar">
			<div class="u-contentWrapper">
				<a href="/">
					<img id="Head-logo" src="/img/store/webLogo.svg" onerror="this.src='/img/store/webLogo.png;this.onerror=null;'">
				</a>
				<div id="Head-contact">
					For questions and ordering<br>
					Call us at <span class="u-active">{{ $phone }}</span><br>
					Or email us at <span class="u-active">{{ $email }}</span>
				</div>
			</div>
		</div>
		<div id="Head-navBar">
			<div class="u-contentWrapper">
				<div id="Head-menu" class="u-inverted">
					@foreach ($menu['header'] as $link)
						@if ($link['id'] == $page['id'])
							<span class='u-highlight'>{{ $link['name'] }}</span>
						@else
							<a href='{{ $link['path'] }}'>{{ $link['name'] }}</a>
						@endif

						@if ($link !== $menu['header']->last())
							 | 
						@endif
					@endforeach
				</div>
				<div id="Head-searchField">
					<span id="Head-searchIcon" class="fa fa-search"></span>
					<input type="text" name="search" id="Head-searchInput" placeholder="Search our inventory...">
				</div>
			</div>
		</div>
	</div>
	<div id="Body">
		<div id="Body-column" class="u-contentWrapper">
			<div id="Body-content">
				@if (isset($page['content']))
					{!! $page['content'] !!}
				@else
				@endif
			</div>
			<div id="SideNav">
				<div id="Search"></div>
				<div id="Cart"></div>
				SIDE NAVIGATION
			</div>
		</div>
	</div>
	<div id="Foot">
		<div id="Foot-blackBar"></div>
		<div id="Foot-navBar">
			@foreach ($menu['footer'] as $link)
				@if ($link['id'] == 1)
					<span class='u-highlight'>{{ $link['name'] }}</span>
				@else
					<a href='{{ $link['path'] }}'>{{ $link['name'] }}</a>
				@endif

				@if ($link !== $menu['footer']->last())
					 | 
				@endif
			@endforeach
			<br>
			{{ $copyright }}
		</div>
	</div>

	<script src="/js/store/init.js"></script>
</body>
</html>