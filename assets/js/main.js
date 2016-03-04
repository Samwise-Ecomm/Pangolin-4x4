// libraries
var Vue = 					require('vue')
var VueRouter = 		require('vue-router')
var VueResource = 	require('vue-resource')
Vue.use(VueRouter)
Vue.use(VueResource)

// Vue-filters
var nl2br 		= require('./filters/nl2br.js')
Vue.filter('nl2br', nl2br)

var App 					=	require('./app.vue')
var Page 					= require('./pages/page.vue')
var Catalog 			= require('./pages/catalog.vue')
var Checkout 			= require('./pages/checkout.vue')
var Item 					= require('./pages/item.vue')
var fileNotFound 	= require('./pages/404.vue')

// Set up routing and match routes to components
var router = new VueRouter({
	history: true,
})

// config Vue global settings
Vue.http.headers.common['X-CSRF-TOKEN'] = $('#csrf-token').attr('content')
Vue.config.debug = true
// Vue.config.async = false

router.map({
	'item/:id': {
		component: Item
	},
	'catalog/:id': {
		component: Catalog
	},
	'checkout/:step': {
		component: Checkout
	},
	'404': {
		component: fileNotFound
	},
	'*': {
		component: Page
	},
})

// Set http interceptor for errors returned
Vue.http.interceptors.push({
	response: function(response) {
		if (response.status == 404) {
			if (window.location.href.includes("/land-rover-parts-products/drivetrain-suspension-steering")) {
				window.location.href = "/catalog/axles-drive-shafts-and-wheels"
			} else if (window.location.href.includes("/land-rover-parts-products/accessories")) {
				window.location.href = "/catalog/accessories-and-optional-equipment"
			} else if (window.location.href.includes("/land-rover-parts-products/badges-decals-data-plates")) {
				window.location.href = "/catalog/accessories-and-optional-equipment"
			} else if (window.location.href.includes("/land-rover-parts-products/body-fittings")) {
				window.location.href = "/catalog/body-trim-seats-and-fixings"
			} else if (window.location.href.includes("/land-rover-parts-products/body-panels-tops")) {
				window.location.href = "/catalog/body-trim-seats-and-fixings"
			} else if (window.location.href.includes("/land-rover-parts-products/breaks-clutch")) {
				window.location.href = "/catalog/brakes-and-brake-controls"
			} else if (window.location.href.includes("/land-rover-parts-products/breaks-clutch")) {
				window.location.href = "/catalog/brakes-and-brake-controls"
			} else if (window.location.href.includes("/land-rover-parts-products/cooling-exhaust-fuel")) {
				window.location.href = "/catalog/fuel-exhaust-and-emission-systems"
			} else if (window.location.href.includes("/land-rover-parts-products/dash-instruments-controls")) {
				window.location.href = "/catalog/instruments-and-controls"
			} else if (window.location.href.includes("/land-rover-parts-products/electrical")) {
				window.location.href = "/catalog/electrical-lamps-and-lenses"
			} else if (window.location.href.includes("/land-rover-parts-products/engine-gearbox-t-case")) {
				window.location.href = "/catalog/engine"
			} else if (window.location.href.includes("/land-rover-parts-products/rubber-parts-seals")) {
				window.location.href = "/land-rover-parts-products"
			} else if (window.location.href.includes("/land-rover-parts-products/optional-equipment")) {
				window.location.href = "/catalog/accessories-and-optional-equipment"
			} else if (window.location.href.includes("/land-rover-parts-products/paint")) {
				window.location.href = "/catalog/paint"
			} else if (window.location.href.includes("/land-rover-parts-products/mercedes")) {
				window.location.href = "/catalog/mercedes-parts"
			} else if (window.location.href.includes("/land-rover-parts-products/t-shirts-toys-gifts")) {
				window.location.href = "/catalog/t-shirts-toys-and-gifts"
			} else if (window.location.href.includes("/land-rover-parts-products/tools")) {
				window.location.href = "/catalog/accessories-and-optional-equipment"
			} else if (window.location.href.includes("/land-rover-parts-products/rare-parts")) {
				window.location.href = "/home/featured-parts"
			} else if (window.location.href.includes("/land-rover-parts-products/recently-added")) {
				window.location.href = "/home/recently-added-parts"
			} else if (window.location.href.includes("/land-rover-parts-products")) {
				window.location.href = "/land-rover-parts-and-products"
			} else {
				ga('send', 'event', 'error', '404', window.location.href)
				window.location.href = "/404"
			}
		} else if (response.status == 200) {
			return response
		}
	}
})

router.beforeEach(function (transition) {
	transition.to.router.app.search = true
	transition.next()
})

router.afterEach(function (transition) {
	ga('send', 'pageview', transition.to.path)
})

// Jquery watcher to modify div positioning on scroll
function resizeWindow() {
	var minHeight = $(window).height() - $('#Head').height() - $('#Foot').height();
	$('#Body-column').css('min-height', minHeight+'px');

	if ($(window).scrollTop() < 147) {
		$('#Social').css('top', (147 - $(window).scrollTop())+'px')
	} else if ($('#Social').css('top') != '2px') {
		$('#Social').css('top', '2px')
	}
}
$(window).scroll(function(){
	resizeWindow()
})
$(window).resize(function(){
	resizeWindow()
})

router.start(App, '#app')