// libraries
var Vue = 					require('vue')
var VueRouter = 		require('vue-router')
var VueResource = 	require('vue-resource')
Vue.use(VueRouter)
Vue.use(VueResource)

var App 			=	require('./app.vue')
var Page 			= require('./pages/page.vue')
var Catalog 	= require('./pages/catalog.vue')

// Set up routing and match routes to components
var router = new VueRouter({
	history: true,
})

// config Vue global settings
Vue.http.headers.common['X-CSRF-TOKEN'] = $('#csrf-token').attr('content')
Vue.config.debug = true

router.map({
	'catalog/:id': {
		component: Catalog
	},
	'*': {
		component: Page
	},
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

console.log(Vue.http.options)
router.start(App, '#app')