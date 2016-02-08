<template>
	<ul v-if="focused">
		<li v-for="result in results" :class="(selected == $index)?'u-light':''">
			<a v-link="{ path: '/item/'+result.id }"><small>{{{ result.name }}}</small><br>
			<small class="u-thin" v-if="result.type_info.part_number">Part #{{ result.type_info.part_number.split(',').join(', #') }}</small></a>
		</li>
	</ul>
</template>

<script>
module.exports = {
	data () {
		return {
			focused: false,
			selected: 0,
			results: []
		}
	},

	props: ['query'],

	watch: {
		query () {
			if (this.query.length > 2) {
				this.$http.post('/api/search/items', { query: this.query }).then(function(response) {
					$('#Head-searchIcon i').removeClass('fa-cog fa-spin')
					if (response.data.length > 0) {
						// TODO: log succesful query
						$('#Head-searchIcon i').addClass('fa-check')
					} else {
						$('#Head-searchIcon i').addClass('fa-times')
					}
					
					this.$set('results', response.data)
					this.selected = 0

					setTimeout(function() {
						$('#Head-searchIcon i').removeClass('fa-check fa-times')
						$('#Head-searchIcon i').addClass('fa-search')
					}, 1000);
				})
			} else { // length is less than 3
				this.results = []
				$('#Head-searchIcon i').removeClass('fa-check fa-times fa-cog fa-spin')
				$('#Head-searchIcon i').addClass('fa-search')
			}
		}
	},

	events: {
    searchEvent (data) {
      if (data.key == 'Down') {
      	this.selected++
      	if (this.selected >= this.results.length) {
      		this.selected = 0
      	}
      } else if (data.key == 'Up') {
      	this.selected--
      	if (this.selected < 0) {
      		this.selected = this.results.length - 1
      	}
      } else if (data.key == 'Enter') {
      	this.$router.go({ path: '/item/'+this.results[this.selected].id })
      }
    },

    searchFocus () {
    	this.focused = true
    },

    searchBlurred () {
    	setTimeout(function() { this.focused = false }.bind(this), 1000)
    	
    }
  }
}
</script>