function changeCartItem(id, cnt, pId, name, pri, avl) {
	cart = returnCart();
	newItem = true;

	for (var i = 0; i < cart.length; i++) {
		if (cart[i]['id'] == id) {
			if (cart[i]['avl'] == '∞' || cart[i]['cnt'] + cnt <= cart[i]['avl']) {
				cart[i]['cnt'] = cart[i]['cnt'] + cnt;
			}
			newItem = false;
			break;
		}
	};

	if (newItem && typeof(pId) == 'number' && typeof(name) == 'string' && typeof(pri) == 'number' && (typeof(avl) == 'number' || avl == '∞')) {
		if (avl == '∞' || cnt <= avl) {
			cart.push({id:id,pId:pId,cnt:cnt,name:name,pri:pri,avl:avl});
		}
	}

	sessionStorage.cart = JSON.stringify(cart);
	fillCart();
}

function newCartCnt(id, cnt) {
	cart = returnCart();

	for (var i = 0; i < cart.length; i++) {
		if (cart[i]['id'] == id) {
			if (cart[i]['avl'] == '∞' || cnt <= cart[i]['avl']) {
				cart[i]['cnt'] = cnt;
			}
			break;
		}
	};

	sessionStorage.cart = JSON.stringify(cart);
}

function returnCart() {
	if (typeof(sessionStorage.cart) == "undefined") {
		return [];
	} else {
		return JSON.parse(sessionStorage.cart);
	}
}

function fillCart() {
	cart = returnCart();
	var htm = '';

	htm += "<div id='Cart-head'>Cart</div>";

	$(".js-addToCart.inCatalog").each(function() {
		var variant = $("#"+$(this).data('pid')+"-variations option:selected");
		if (variant.data('avl') == 0) {
			$(this).html("Out of Stock");
			$(this).addClass('isDisabled')
			return;
		}

		$(this).html("<i class='fa fa-shopping-cart'></i> Add to Cart");
		$(this).removeClass('isDisabled');
		for (var i = 0; i < cart.length; i++) {
			if (variant.data('id') == cart[i]['id']) {
				// While we are here, double check info
				cart[i]['pId'] = variant.data('pid');
				cart[i]['name'] = variant.data('name');
				cart[i]['pri'] = variant.data('pri');
				cart[i]['avl'] = variant.data('avl');

				if (cart[i]['cnt'] == 0) {
					$(this).html("<i class='fa fa-shopping-cart'></i> Add to Cart");
					$(this).removeClass('isDisabled');
				} else if (variant.data('avl') != '∞' && variant.data('avl') <= cart[i]['cnt']) {
					cart[i]['cnt'] = variant.data('avl');
					$(this).html("All In Cart ("+cart[i]['cnt']+")");
					$(this).addClass('isDisabled')
				} else {
					$(this).html("<i class='fa fa-cart-plus'></i> "+cart[i]['cnt']+" In Cart");
					$(this).removeClass('isDisabled')
				}
				break;
			}
		}
	})

	var subtotal = 0;
	for (var i = 0; i < cart.length; i++) {
		if (i != 0) {
			htm += "<hr>";
		}
		htm += "<div class='Cart-item'>";

		id 			= cart[i]['id'];
		cnt 		= cart[i]['cnt'];
		

		$(".js-addToCart.inVariations").each(function() {
			
			if ($(this).data('id') == id) {
				// While we are here, double check info
				cart[i]['pId'] = $(this).data('pid');
				cart[i]['name'] = $(this).data('name');
				cart[i]['pri'] = $(this).data('pri');
				cart[i]['avl'] = $(this).data('avl');

				if (cnt == 0) {
					$(this).html("<i class='fa fa-shopping-cart'></i> Add to Cart");
					$(this).removeClass('isDisabled');
				} else if ($(this).data('avl') != '∞' && $(this).data('avl') <= cnt) {
					cart[i]['cnt'] = $(this).data('avl');
					cnt = cart[i]['cnt'];
					$(this).html("All In Cart ("+cnt+")");
					$(this).addClass('isDisabled')
				} else {
					$(this).html("<i class='fa fa-cart-plus'></i> "+cnt+" In Cart");
					$(this).removeClass('isDisabled')
				}
			}
			
		})

		name 		= cart[i]['name'].replace(/\\n/g, ':<br>');
		pId			= cart[i]['pId'];
		itemTotal 	= cart[i]['pri'].toFixed(2);
		availible 	= cart[i]['avl'];
		subtotal 	+= itemTotal * cnt;

		if (cnt > 0) {
			sub = " u-active' onmousedown='changeCartItem("+id+",-1)'";
		} else {
			sub = "-o'";
		}
		if (availible == '∞' || cnt < availible) {
			add = " u-active' onmousedown='changeCartItem("+id+",1)'";
		} else {
			add = "-o'";
		}

		htm += "<a href='/item.php?id="+pId+"'><h5>"+name+"</h5></a>";
		htm += "<h6 class='u-inline'>$"+itemTotal+"</h6>";
		htm += "<span class='u-floatRight'><i class='fa fa-minus-square"+sub+"'></i> "+cnt+" <i class='fa fa-plus-square"+add+"'></i></span>";

		htm += "</div>";

		
	};

	htm += "<a href='/checkout.php'><div id='Cart-foot' class='u-active'><b>Subtotal:</b> $"+subtotal.toFixed(2)+"<b class='u-floatRight'>Checkout</b></div></a>"

	$('#Cart').html(htm);
	sessionStorage.cart = JSON.stringify(cart);
}

function clearCart() {
	sessionStorage.cart = '[]';
	$(".js-addToCart").html('<i class="fa fa-shopping-cart"></i> Add to Cart');
	$(".js-addToCart").removeClass('isDisabled');
	$('#Cart').html('');
}

function cleanCart() {
	cart = returnCart();

	for (var i = cart.length - 1; i >= 0; i--) {
		if (cart[i]['cnt'] == 0) {
			if (i == cart.length - 1) {
				cart = cart.slice(0,i)
			} else {
				cart = cart.slice(0,i).concat(cart.slice(i+1));
			}
		}
	};
	sessionStorage.cart = JSON.stringify(cart);
}

function connectCatalog() {
	$('.js-addToCart').mousedown(function() {
		if ($(this).data('variants')) {
			var variant = $("#"+$(this).data('pid')+"-variations option:selected");
			var id = variant.data('id');
			var cnt = 1;
			var pId = variant.data('pid');
			var name = variant.data('name');
			var pri = variant.data('pri');
			var avl = variant.data('avl');
		} else {
			var id = $(this).data('id');
			var cnt = 1;
			var pId = $(this).data('pid');
			var name = $(this).data('name');
			var pri = $(this).data('pri');
			var avl = $(this).data('avl');
		}
		changeCartItem(id, cnt, pId, name, pri, avl);
	})

	$('.CatalogItem-variations').change(function() {
		if (sessionStorage.cart != '[]') {
			fillCart();
		}
	})

	if (sessionStorage.cart != '[]') {
		fillCart();
	}
}