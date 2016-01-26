<template>
	<div class="wrapper">
		<div id="Head" v-if="loaded">
			<div id="Head-highlightBar"></div>
			<div id="Head-titleBar">
				<div class="u-contentWrapper">
					<a href="/">
						<img id="Head-logo" src="/img/store/webLogo.svg" onerror="this.src='/img/store/webLogo.png;this.onerror=null;'">
					</a>
					<div id="Head-contact">
						For questions and ordering<br>
						Call us at <span class="u-active">{{ settings.phone }}</span><br>
						Or email us at <span class="u-active">{{ settings.email }}</span>
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
					<div id="Head-searchField">
						<span id="Head-searchIcon" class="fa fa-search"></span>
						<input type="text" name="search" id="Head-searchInput" placeholder="Search our inventory...">
					</div>
				</div>
			</div>
		</div>
		<div id="Body" v-if="loaded">
			<div id="Body-column" class="u-contentWrapper">
				<div id="Body-content">
					<router-view></router-view>
				</div>
				<div id="SideNav">
					<div id="Search"></div>
					<div id="Cart"></div>
					<br>
					<span v-for="link in settings.menus.sidebar">
						<b v-if="link.label">{{ link.name }}</b>
						<a v-else v-link="{ path: '/catalog/'+link.id }">{{ link.name }}</a>
						<br><br>
					</span>
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
			settings: {},
			loaded: false
		}
	},

	ready() {
		this.getSettings()
	},

	methods: {
		getSettings () {
			console.log('here')
			this.$http.get('/api/settings').then(function(response) {
		  	this.$set('settings', response.data)
		  	this.loaded = true
		  	this.$nextTick(function() {
		  		$(window).scroll()
		  	})
	    })
		},
	},
}
</script>