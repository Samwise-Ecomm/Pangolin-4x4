// libraries
var Vue = 					require('vue')
var VueResource = 	require('vue-resource')
Vue.use(VueResource)

var App =	require('./app.vue')

// config Vue global settings
Vue.http.headers.common['X-CSRF-TOKEN'] = $('#csrf-token').attr('content')
Vue.config.debug = true

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

new Vue(App)