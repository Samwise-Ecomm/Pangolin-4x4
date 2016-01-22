<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
	<title><?php if (isset($title)) {echo STORE_SHORT_NAME.": ".htmlspecialchars($title);}else{echo STORE_SHORT_NAME;} ?></title>

	<link rel='stylesheet' href='http://fonts.googleapis.com/css?family=Roboto:400,100' type='text/css'>
	<link rel="stylesheet" href="/css/template.css">
	<link rel="stylesheet" href="/css/font-awesome.min.css">
	<link rel="stylesheet" href="/css/lightbox.css">

	<script src="/js/jquery.min.js"></script>
	<script src="/js/lightbox.min.js"></script>
	<script src="/js/cart.js"></script>
	<script src="/js/debounce.min.js"></script>

</head>
<body class="<?=($search?'search':'noSearch')?>">
	<div id="Head">
		<div id="Head-highlightBar"></div>
		<div id="Head-titleBar">
			<div class="u-contentWrapper">
				<a href="/">
					<img id="Head-logo" src="/img/webLogo.svg" onerror="this.src='/img/webLogo.png;this.onerror=null;'">
				</a>
				<div id="Head-contact">
					For questions and ordering<br>
					Call us at <span class="u-active"><?=STORE_PHONE_NUMBER?></span><br>
					Or email us at <span class="u-active"><?=STORE_EMAIL?></span>
				</div>
			</div>
		</div>
		<div id="Head-navBar">
			<div class="u-contentWrapper">
				<div id="Head-menu" class="u-inverted"><?echoTopNav($title)?></div>
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
			
			</div>
			<div id="SideNav">
				<div id="Search"></div>
				<div id="Cart"></div>
				<?=echoSideNav()?>
			</div>
		</div>
	</div>
	<div id="Foot">
		<div id="Foot-blackBar"></div>
		<div id="Foot-navBar">
			<?echoBottomNav($title)?><br>
			<?=COPYRIGHT?>
		</div>
	</div>

	<script src="/js/init.js"></script>
</body>
</html>