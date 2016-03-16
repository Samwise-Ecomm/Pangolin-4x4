<template>
<div class="row" v-if="loaded">
	<div id="Title">
		<h1>{{{ item.name + ', ' + item.type_info.state }}}</h1>
		<h4 v-if="item.type_info.part_number">Part #{{ item.type_info.part_number.split(',').join(', #') }}</h4>
		<hr>

		<i class="u-center">
			Note: Shopping cart does not account for shipping. Once we receive your order, we will send you follow-up invoice that includes the calculated shipping amount. Thank you!
		</i>
		<hr>
	</div>

	<div id="Pictures">
		<a :href="'/img/'+pic.path+'?u='+item.updated" id='js-currentPicLink' data-lightbox="pic" v-for="pic in item.images.large">
			<img :src="'/img/'+item.images.medium[$index]+'?u='+item.updated" id='Pictures-current' class="u-activeImg" v-if="pic.selected">
		</a>
	  <img :src="'/img/'+pic+'?u='+item.updated" class="u-activeImg Pictures-thumb"
	  	:class="($index % 3 == 0)?'isLeft':($index % 3 == 1)?'':'isRight'"
	  	v-for="pic in item.images.small"
	  	@click="selectPic($index)">
	</div>

	<div id="Information">
		<h5>{{{ item.name + ', ' + item.type_info.state }}}</h5>
		<br>
		<p>
			{{{ item.description | nl2br }}}
			<br><br>
			{{ item.type_info.quality }}, {{ (item.type_info.state == 'NOS')?'New/Old Stock':item.type_info.state }}.
			<span v-if="item.type_info.part_number">Part #{{ item.type_info.part_number.split(',').join(', #') }}.</span>
			<span v-if="item.type_info.ss_part_number">Supersedes by Part #{{ item.type_info.ss_part_number.split(',').join(', #') }}.</span>
		</p>
	</div>

	<div id="Variations">
		<section v-if="item.variants.length == 1">
			<b class="Variations-price">
				{{ item.variants[0].price | currency }}
				<span v-if="item.variants[0].unit != 'Unit'" class='u-thin'> / {{ item.variants[0].unit }}</span>
			</b>
			<div class="Button Button--active inVariations u-floatRight js-addToCart"
				v-if="item.variants[0].stock > 0 || item.variants[0].infinite"
				:variant-id="item.variants[0].id"
				@click="addToCart(item.variants[0])">
				<i class="fa fa-cart-plus"></i> Add to Cart
			</div>
			<div class="Button Button--active inVariations u-floatRight isDisabled" v-else>
				Out of Stock
			</div>
		</section>

		<table id='VariationsTable' v-else>
			<tr v-for="variant in item.variants">
				<td>{{ variant.name }}</td>
				<td class="VariationsTable-price"><b>
					{{ variant.price | currency }}
					<span v-if="variant.unit != 'Unit'" class='u-thin'> / {{ variant.unit }}</span>
				</b></td>
				<td class="VariationsTable-button">
					<div class="Button Button--active inVariations u-floatRight js-addToCart"
						v-if="variant.stock > 0 || variant.infinite"
						:variant-id="variant.id"
						@click="addToCart(variant)">
						<i class="fa fa-cart-plus"></i> Add to Cart
					</div>
					<div class="Button Button--active inVariations u-floatRight isDisabled" v-else>
						Out of Stock
					</div>
				</td>
			</tr>
		</table>

		<hr class="u-clear u-paddingTop">
	</div>

	<div id="Specs">
		<div v-if="item.x"> Dimensions: {{ item.x }}"
			<span v-if="item.y"> x {{ item.y }}"
				<span v-if="item.z"> x {{ item.z }}"</span>
			</span>
		</div>
		<div v-if="item.weight">{{ item.weight }} lbs.</div>
		<hr v-if="item.weight || item.x">
	</div>

	<div id="Applications">
		<div v-if="item.type_info.other_applications">
			<h2>Other Applications:</h2><br>
			<ul>
				<li v-for="application in item.type_info.other_applications.split(',')">{{ application }}</li>
			</ul>
		</div>
	</div>
</div>
</template>

<script>
module.exports = {
	data () {
		return {
			item: {},
			loaded: false
		}
	},

	route: {
		data() {
			this.getItem()
		},
	},

	methods: {
		getItem () {
			this.$http.get('/api/item/'+this.$route.params.id).then(function(response) {
		  	this.$set('item', response.data)
		  	this.selectPic(0)
		  	document.title = "Pangolin 4x4: "+this.item.name

		  	this.loaded = true
		  	this.$nextTick(function() {
					this.$parent.$refs.cart.setAddToCartButtons()
				})
	    })
		},

		selectPic(index) {
			for (var i = 0; i < this.item.images.large.length; i++) {
	  		this.item.images.large[i].selected = false
	  	}
	  	this.item.images.large[index].selected = true
		},

		addToCart(variant) {
			var cartItem = {
				name: this.item.name,
				images: this.item.images,
				part_number: this.item.type_info.part_number,
				state: this.item.type_info.state,
				variants: {},
			}

			cartItem.variants[variant.id] = {
				name: variant.name,
				price: variant.price,
				unit: variant.unit,
				stock: variant.stock,
				infinite: variant.infinite,
				count: 1
			}

			this.$parent.$refs.cart.addToCart(cartItem, this.item.id, variant.id)
		}
	},
}
</script>
