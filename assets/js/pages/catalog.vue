<template>
	<div class="row" v-if="loaded">
		<h1>{{ catalog.name }}</h1>
		<p>{{ catalog.description }}</p>

		<section v-if="catalog.tags.length > 1">
			<hr>
			<ul class="u-cols-3">
				<li v-for="tag in catalog.tags">
					<label for='{{ tag }}'} class='Checkbox'>
						<input type='checkbox' id='{{ tag }}' checked @click='toggleTag(tag)'>
						<i class="fa fa-fw" :class="(selected.indexOf(tag) != -1)?'fa-check-square':'fa-square'"></i> {{ tag.substring(trim) }}
					</label>
				</li>
			</ul>
			<br>
			<ul class="u-cols-3">
				<li class="u-active" @click="fillTags">
					<i class="fa fa-fw fa-plus-square"></i> Select All
				</li>
				<li class="u-active" @click="clearTags">
					<i class="fa fa-fw fa-minus-square"></i> Select None
				</li>
			</ul>
		</section>

		<hr>
		<i>Note: Shopping cart does not account for shipping. Once we receive your order, we will send you follow-up invoice that includes the calculated shipping amount. Thank you!</i>
		<hr>

		<catalog :tags.sync="selected" ></catalog>
	</div>
</template>

<script>
module.exports = {
	data () {
		return {
			catalog: {},
			selected: [],
			loaded: false
		}
	},

	components: {
		catalog: require('../components/catalog.vue')
	},

	route: {
		data () {
			this.getCatalog()
		},
	},

	computed: {
		trim () {
			if (this.catalog.tags.length <= 1) {
				return 0
			}

			var chunk = this.compareStartingChunks(this.catalog.tags[0], this.catalog.tags[1])
			if (this.catalog.tags.length == 2) {
				return chunk.length
			}

			for (var i = 2; i < this.catalog.tags.length; i++) {
				var tag = this.catalog.tags[i]
				chunk = this.compareStartingChunks(chunk, tag)
			}
			return chunk.length
		}
	},

	methods: {
		getCatalog () {
			this.$http.get('/api/catalog/'+this.$route.params.id).then(function(response) {
		  	this.$set('catalog', response.data)
		  	this.fillTags()
		  	this.loaded = true
	    })
		},

		fillTags () {
			this.selected = []
			for (var i = 0; i < this.catalog.tags.length; i++) {
				this.selected.push(this.catalog.tags[i])
			};
		},

		clearTags () {
			this.selected = []
		},

		toggleTag (tag) {
			var index = this.selected.indexOf(tag)
			if (index != -1) {
				this.selected.splice(index, 1)
			} else {
				this.selected.push(tag)
			}
		},

		compareStartingChunks(stringOne, stringTwo) {
			var firstDash = stringOne.indexOf('-')
			if (firstDash == -1) {
				return ""
			}

			var firstChunk = stringOne.substring(0,firstDash)

			var firstDash = stringTwo.indexOf('-')
			if (firstDash == -1) {
				return ""
			}

			if (stringTwo.substring(0,firstDash) == firstChunk) {
				return firstChunk+'-'
			} else {
				return ""
			}
		}
	},
}
</script>