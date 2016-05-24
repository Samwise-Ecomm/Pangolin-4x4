<template>
<div class='CheckoutCart-variant'>
	<div class='CheckoutCart-varTitle'><h4 v-if="item.name">{{{ item.name }}} -&nbsp;</h4></div>
	<div class='CheckoutCart-price'>
		<h4>{{ item.price / 100 | currency }}<span v-if="item.unit != 'Unit'"> {{ '\/' + item.unit }}</span></h4>
	</div>
	<div class='CheckoutCart-counter'>
		<div class='CheckoutCart-minus'>
			<i class='fa fa-fw' 
				:class="(item.count > 0)?'fa-minus-square u-active':'fa-minus-square-o'"
				@click="changeCount(-1)"></i>
		</div>
		<div class='CheckoutCart-cnt'>
			<input type='text' maxlength=4 
				v-model="item.count"
				@keydown="checkKey"
				@input="checkCount(item)">
		</div>
		<div class='CheckoutCart-plus'>
			<i class='fa fa-fw' 
				:class="(item.infinite || item.count < item.stock)?'fa-plus-square u-active':'fa-plus-square-o'"
				@click="changeCount(1)"></i>
		</div>
	</div>
</div>
</template>

<script>
module.exports = {
	props: ['item'],

	methods: {
		changeCount(change) {
			this.item.count = parseInt(this.item.count) + change
			this.$parent.$parent.storeCart()
		},

		checkKey(event) {
			if (event.keyCode == 8) {
				return 0
			} else if (event.keyCode < 48 || 57 < event.keyCode) {
				event.preventDefault()
			}
		},

		checkCount() {
			if (this.item.count < 0) {
				this.item.count = 0
			} else if (!this.item.infinite && this.item.count > this.item.stock) {
				this.item.count = this.item.stock
			}

			this.$parent.$parent.storeCart()
		}
	}
}
</script>