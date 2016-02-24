<template>
	<div id="page">
	</div>
</template>

<script>
module.exports = {
	data () {
		return {
			page: {},
			loaded: false
		}
	},

	route: {
		data() {
			this.getPage()
		},

		canReuse: false,
	},

	components: {
		default: {
			template: '<div>Loading</div>'
		}
	},

	methods: {
		getPage () {
			this.$http.get('/api/page'+this.$route.path).then(function(response) {
		  	this.$set('page', response.data)
		  	document.title = "Pangolin 4x4: "+this.page.name

		  	var vue = require('vue')
		  	var pageContent = vue.component('page'+this.page.id, {
		  		template: this.page.content,
		  		created () {
		  			
		  		},
		  		components: {
		  			catalog: require('../components/catalog.vue')
		  		}
		  	})
		  	var thisPage = new pageContent

		  	// TODO: Find the correct way to apped thisPage as a child to 'this'
		  	thisPage.$mount().$appendTo('#page')
		  	// HACK the correct root into these children
		  	for (var i = 0; i < thisPage.$children.length; i++) {
		  		thisPage.$children[i].$root = this.$root
		  	}
		  	this.$children.push(thisPage)

		  	this.$parent.search = response.data.search
		  	this.loaded = true
	    })
		},
	},
}
</script>