<template>
	<div class="row" v-if="loaded">
		{{{ page.content }}}
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
	},

	methods: {
		getPage () {
			this.$http.get('/api/page'+this.$route.path).then(function(response) {
		  	this.$set('page', response.data)
		  	this.$parent.search = response.data.search
		  	this.loaded = true
	    })
		},
	},
}
</script>