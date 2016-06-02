<template>
<div>
	<small class="u-thin">{{{ item.name }}}</small><br v-if="item.name">
	<small>{{ item.price / 100 | currency }} <span v-if="item.unit != 'Unit'"> {{ '\/' + item.unit }}</span></small>
	<span class="u-floatRight">
		<i class="fa fa-fw" 
			:class="(item.count > 0)?'fa-minus-square u-active':'fa-minus-square-o'"
			@click="changeCount(-1)"></i>
		{{ item.count }}
		<i class="fa fa-fw" 
			:class="(item.infinite || item.count < item.stock)?'fa-plus-square u-active':'fa-plus-square-o'"
			@click="changeCount(1)"></i>
	</span>
</div>
</template>

<script>
module.exports = {
	props: ['item'],

	methods: {
		changeCount(change) {
			this.item.count = parseInt(this.item.count) + change
			if (this.item.count < 0) {
				this.item.count = 0
			}
			this.$parent.$parent.storeCart()
		}
	}
}
</script>