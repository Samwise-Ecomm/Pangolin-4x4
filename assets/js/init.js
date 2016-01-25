function resizeContent() {
	minHeight = $(window).height() - $('#Head').height() - $('#Foot').height();
	$('#Body-column').css('min-height', minHeight+'px');
}

$(document).ready( function() {
	resizeContent()
	// cleanCart();
	// connectCatalog();

	$(window).resize(function() {
		resizeContent()
	})

	// Check for catalog divs and fill them with catalog is present
	// $('.catalog').each(function() {
	// 	var catalog = $(this);

	// 	if (typeof catalog.data('tags') != 'undefined') {
	// 		var tags = catalog.data('tags');

	// 	} else {
	// 		var tags = 'null';
	// 	}
		
	// 	if (typeof catalog.data('limit') != 'undefined') {
	// 		var limit = catalog.data('limit');
	// 	} else {
	// 		var limit = 'null';
	// 	}

	// 	if (typeof catalog.data('recentdays') != 'undefined') {
	// 		var recentDays = catalog.data('recentdays');
	// 	} else {
	// 		var recentDays = 'null';
	// 	}
	// 	console.log(tags);
	// 	$.ajax({
	// 		type: "POST",
	// 		url: "/inc/echoCatalog.php",
	// 		data: { tags : tags, limit, limit, recentDays, recentDays },
	// 		success: function(data) {
	// 			catalog.html(data);
	// 			connectCatalog();
	// 		}
	// 	});
	// })

	// $('#Head-searchInput').keyup( $.debounce( 500, search ) )
	// $('#Head-searchInput').keyup( $.debounce( 2500, store ) )

	// function store() {
	// 	var q = $('#Head-searchInput').val() // Query
		
	// 	if (q != '') {
	// 		$.ajax({
	// 			type: "POST",
	// 			url: "/inc/store.php",
	// 			data: { q : q }
	// 		});
	// 	}
	// }

	// function search() {
	// 	var q = $('#Head-searchInput').val() // Query
		
	// 	if (q == '') {
	// 		$('#Search').html('')
	// 	} else {
	// 		$.ajax({
	// 			type: "POST",
	// 			url: "/inc/search.php",
	// 			data: { q : q },
	// 			success: function(data) {

	// 				$('#Search').html(data)
	// 			}
	// 		});
	// 	}
	// }
})