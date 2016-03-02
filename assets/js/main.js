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
			window.location.href = "/404"
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
}
$(window).scroll(function(){
	resizeWindow()
})
$(window).resize(function(){
	resizeWindow()
})

router.start(App, '#app')