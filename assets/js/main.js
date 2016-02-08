// libraries
var Vue = 					require('vue')
var VueRouter = 		require('vue-router')
var VueResource = 	require('vue-resource')
Vue.use(VueRouter)
Vue.use(VueResource)

var App 			=	require('./app.vue')
var Page 			= require('./pages/page.vue')
var Catalog 	= require('./pages/catalog.vue')
var Checkout 	= require('./pages/checkout.vue')
var Item 			= require('./pages/item.vue')

// Set up routing and match routes to components
var router = new VueRouter({
	history: true,
})

// config Vue global settings
Vue.http.headers.common['X-CSRF-TOKEN'] = $('#csrf-token').attr('content')
Vue.config.debug = true

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
	'*': {
		component: Page
	},
})

router.beforeEach(function (transition) {
	transition.to.router.app.search = true
	transition.next()
})

// Jquery watcher to modify div positioning on scroll
function resizeWindow() {
	var minHeight = $(window).height() - $('#Head').height() - $('#Foot').height();
	$('#Body-column').css('min-height', minHeight+'px');
}
$(window).scroll(function(){
	resizeWindow()
})
$(window).resize(function(){
	resizeWindow()
})

router.start(App, '#app')