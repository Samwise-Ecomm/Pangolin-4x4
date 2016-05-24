<template>
<div class="row" v-if="loaded">
	<div id="Title">
		<h1>{{ offer.name }}</h1>
		<h4 v-if="offer.partNumbers">Part #{{ offer.partNumbers.join(', #') }}</h4>
		<hr>

		<i class="u-center">
			Note: Shopping cart does not account for shipping. Once we receive your order, we will send you follow-up invoice that includes the calculated shipping amount. Thank you!
		</i>
		<hr>
	</div>

	<div id="Pictures">
		<!-- Lightbox links and selected picture img -->
		<a v-for="picture in offer.pictures" :href="`/img/${picture.source.lg}`" id='js-currentPicLink' data-lightbox="pic">
			<img :src="`/img/${picture.source.md}`" id='Pictures-current' class="u-activeImg" v-if="picture.selected">
		</a>

		<!-- Thumbs to set selected picture -->
		<img v-for="picture in offer.pictures" class="u-activeImg Pictures-thumb"
			:src="`/img/${picture.source.sm}`"
			:class="($index % 3 == 0)?'isLeft':($index % 3 == 1)?'':'isRight'"
			@click="selectPic($index)">
	</div>

	<div id="Information">
		<h5>{{ offer.name }}</h5>
		<br>
		<p>
			{{{ offer.description | nl2br }}}
			<br><br>
			<span v-if="offer.partNumbers">Part #{{ offer.partNumbers.join(', #') }}.</span>
			<span v-if="offer.ssPartNumbers">Supersedes by Part #{{ offer.ssPartNumbers.join(', #') }}.</span>
		</p>
	</div>

	<div id="Variations">
		<section v-if="offer.items.length == 1">
			<b class="Variations-price">
				{{ offer.items[0].price / 100 | currency }}
				<span v-if="offer.items[0].unit != 'Unit'" class='u-thin'> / {{ offer.items[0].unit }}</span>
			</b>
			<add-to-cart class="inVariations u-floatRight"
				:item="offer.items[0]"
				:thumb="offer.pictures[0].source.sm" 
				:part-numbers="partNumbers">
			</add-to-cart>
		</section>

		<table id='VariationsTable' v-else>
			<tr v-for="item in offer.items">
				<td>{{ item.name }}</td>
				<td class="VariationsTable-price"><b>
					{{ item.price / 100 | currency }}
					<span v-if="item.unit != 'Unit'" class='u-thin'> / {{ item.unit }}</span>
				</b></td>
				<td class="VariationsTable-button">
					<add-to-cart class="inVariations u-floatRight"
						:item="item"
						:thumb="offer.pictures[0].source.sm" 
						:part-numbers="partNumbers">
					</add-to-cart>
				</td>
			</tr>
		</table>

		<hr class="u-clear u-paddingTop">
	</div>

	<div id="Applications">
		<div v-if="offer.other_applications">
			<h2>Other Applications:</h2><br>
			<ul>
				<li v-for="application in offer.other_applications.split(',')">{{ application }}</li>
			</ul>
		</div>
	</div>
</div>
</template>

<script>
module.exports = {
	data () {
		return {
			offer: {},
			loaded: false
		}
	},

	components: {
		addToCart: require('../components/addToCart.vue')
	},

	computed: {
		partNumbers () {
			var numbers = [];
			for (var i = 0; i < this.offer.items.length; i++) {
				if (this.offer.items[i]['part_number'] && !numbers.includes(this.offer.items[i]['part_number'])) {
					numbers.push(this.offer.items[i]['part_number'])
				}
			}
		},

		ssPartNumbers () {
			var numbers = [];
			for (var i = 0; i < this.offer.items.length; i++) {
				if (this.offer.items[i]['ss_part_number'] && !numbers.includes(this.offer.items[i]['ss_part_number'])) {
					numbers.push(this.offer.items[i]['ss_part_number'])
				}
			}
		}
	},

	route: {
		data() {
			this.getOffer()
		},
	},

	methods: {
		getOffer () {
			this.$http.get(`offer/${this.$route.params.id}`).then(response => {
				this.$set('offer', response.data)
				for (var i = 0; i < this.offer.pictures.length; i++) {
					this.$set(`offer.pictures[${i}].selected`, false)
				}
				this.selectPic(0)
				document.title = "Pangolin 4x4: "+this.offer.name

				this.loaded = true
			})
		},

		selectPic(index) {
			for (var i = 0; i < this.offer.pictures.length; i++) {
				this.offer.pictures[i].selected = false
			}
			this.offer.pictures[index].selected = true

		}
	},
}
</script>
