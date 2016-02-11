<template>
	<div class="wrapper" :class="search?'search':'noSearch'">
		<div id="Head" v-if="loaded">
			<div id="Head-highlightBar"></div>
			<div id="Head-titleBar">
				<div class="u-contentWrapper">
					<a v-link="{ path: '/home' }">
						<img id="Head-logo" src="/img/store/webLogo.svg" onerror="this.src='/img/store/webLogo.png;this.onerror=null;'">
					</a>
					<div id="Head-contact">
						For questions and ordering<br>
						Call us at <span class="u-light">{{ settings.phone }}</span><br>
						Or email us at <span class="u-light">{{ settings.email }}</span>
					</div>
				</div>
			</div>
			<div id="Head-navBar">
				<div class="u-contentWrapper">
					<div id="Head-menu" class="u-inverted">
						<span v-for="link in settings.menus.header">
							<a v-link="{ path: link.path }">{{ link.name }}</a>
							<span v-if="settings.menus.header.length > $index + 1">|</span>
						</span>
					</div>
					<div id="Head-searchField" v-if="search">
						<span id="Head-searchIcon"><i class="fa fa-search"></i></span>
						<input type="text" name="search" id="Head-searchInput" placeholder="Search our inventory..." autocomplete="off"
							v-model="query" 
							debounce="500"
							@keyup="queryChanged"
							@focus="$broadcast('searchFocus')"
							@blur="$broadcast('searchBlurred')">
					</div>
				</div>
			</div>
		</div>
		<div id="Body" v-if="loaded">
			<div id="Body-column" class="u-contentWrapper">
				<div id="Body-content">
					<router-view></router-view>
				</div>
				<div id="SideNav" v-if="search">
					<search v-ref:search :query.sync="query"></search>
					<cart v-ref:cart :checkout="false"></cart>
					<section id="SideNav-catalogs">
						<span v-for="link in settings.menus.sidebar">
							<b v-if="link.label">{{ link.name }}</b>
							<a v-else v-link="{ path: '/catalog/'+link.slug }">{{ link.name }}</a>
							<br><br>
						</span>
					</section>
				</div>
			</div>
		</div>
		<div id="Foot" v-if="loaded">
			<div id="Foot-blackBar"></div>
			<div id="Foot-navBar">
				<span v-for="link in settings.menus.footer">
					<a v-link="{ path: link.path }">{{ link.name }}</a>
					<span v-if="settings.menus.footer.length > $index + 1">|</span>
				</span>
				<br>
				{{ settings.copyright }}
			</div>
		</div>
	</div>
</template>

<script>
module.exports = {
	data () {
		return {
			search: true,
			settings: {},
			query: '',
			loaded: false
		}
	},

	ready() {
		this.getSettings()
	},

	components: {
		search: require('./components/search.vue'),
		cart: require('./components/cart.vue')
	},

	methods: {
		getSettings () {
			this.$http.get('/api/settings').then(function(response) {
		  	this.$set('settings', response.data)
		  	this.loaded = true
		  	this.$nextTick(function() {
		  		$(window).scroll()
		  	})
	    })
		},

		queryChanged (event) {
			if (event.keyCode == 27) { // esc
				$('#Head-searchInput').blur()
				this.$set('query', '')
			}
			if (event.keyIdentifier == 'Enter' || event.keyIdentifier == 'Up' || event.keyIdentifier == 'Down') {
				this.$broadcast('searchEvent', { key: event.keyIdentifier })
			}
			if (event.keyCode == 8 || (46 < event.keyCode && event.keyCode < 91) || event.keyCode > 145) {
				$('#Head-searchIcon i').removeClass('fa-check fa-times fa-search')
				$('#Head-searchIcon i').addClass('fa-cog fa-spin')
				this.$refs.search.searching = true
			}
		}
	},
}
</script>