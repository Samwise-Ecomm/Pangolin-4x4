<template>
<div>
	<span class="fa fa-chevron-left u-active" @click="changePage(page - 1)"></span>&nbsp;
	<span :class="(page == 1)?'u-highlight':'u-active'" @click="changePage(1)">1</span>
	<span v-if="page > 3">...</span>
	<span class="u-active" @click="changePage(page - 1)" v-if="page > 2">{{ page - 1}}</span>
	<span class="u-highlight" v-if="page > 1 && page < pages">{{ page }}</span>
	<span class="u-active" @click="changePage(page + 1)" v-if="page < pages - 1">{{ page + 1 }}</span>
	<span v-if="page < pages - 2">...</span>
	<span :class="(page == pages)?'u-highlight':'u-active'" @click="changePage(pages)">{{ pages }}</span>
	<span class="fa fa-chevron-right u-active" @click="changePage(page + 1)"></span>
</div>
</template>

<script>
module.exports = {
	props: ['givenPage', 'pages'],

	computed: {
		page () {
			return this.givenPage + 1
		}
	},

	methods: {
		changePage (page) {
			this.$dispatch('changePage', page - 1)
		}
	}
}
</script>