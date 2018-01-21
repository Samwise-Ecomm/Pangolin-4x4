<template>
	<div class="wrapper" :class="search?'search':'noSearch'">
		<div id="Social">
			<ul>
				<li>
					<a href="https://www.facebook.com/Pangolin4x4-253570924656290/">
						<i class="fa fa-2x fa-facebook-square"></i>
					</a>
				</li>
				<li>
					<a href="https://www.instagram.com/explore/tags/pangolin4x4/">
						<i class="fa fa-2x fa-instagram"></i>
					</a>
				</li>
				<li>
					<a href="http://www.roverdose.com/">
						<i class="fa fa-2x fa-rss-square"></i>
					</a>
				</li>
			</ul>
		</div>
		<div id="Head" v-if="loaded">
			<div id="Head-highlightBar"></div>
			<div id="Head-titleBar">
				<div class="u-contentWrapper">
					<a v-link="{ path: '/home' }">
						<img id="Head-logo" src="/img/webLogo.svg">
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
						<span v-for="link in menus.header">
							<a v-link="{ path: link.path }">{{ link.name }}</a>
							<span v-if="menus.header.length > $index + 1">|</span>
						</span>
					</div>
					<div id="Head-searchField" v-if="search">
						<span id="Head-searchIcon"><status-icon icon="fa-search" v-ref:search-icon></status-icon></span>
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
					<cart v-ref:cart></cart>
					<section id="SideNav-catalogs">
						<span v-for="link in menus.sidebar">
							<b v-if="link.label">{{ link.name }}</b>
							<a v-else v-link="{ name: 'catalog', params: { slug: link.slug, id: link.id } }">{{ link.name }}</a>
							<br><br>
						</span>
					</section>
				</div>
			</div>
		</div>
		<div id="Foot" v-if="loaded">
			<div id="Foot-blackBar"></div>
			<div id="Foot-navBar">
				<span v-for="link in menus.footer">
					<a v-link="{ path: link.path }">{{ link.name }}</a>
					<span v-if="menus.footer.length > $index + 1">|</span>
				</span>
				<br>
				{{ settings.copyright }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
  data() {
    return {
      search: true,
      settings: {},
      menus: {},
      query: "",
      loaded: false
    }
  },

  ready() {
    this.getSettings()
  },

  components: {
    statusIcon: require("./components/statusIcon.vue"),
    search: require("./components/search.vue"),
    cart: require("./components/cart.vue")
  },

  methods: {
    getSettings: async function() {
      const { data } = await this.$http.get("settings");
      this.$set("settings", data);
      this.getMenus();
    },

    getMenus: async function() {
      const { data } = await this.$http.get("menus");
			this.$set("menus", data);
			this.loaded = true
			this.$nextTick(() => {
				$(window).scroll()
			})
    },

    queryChanged(event) {
      if (event.keyCode == 27) {
        // esc
        $("#Head-searchInput").blur()
        this.$set("query", "")
      }
      if (
        event.keyIdentifier == "Enter" ||
        event.keyIdentifier == "Up" ||
        event.keyIdentifier == "Down"
      ) {
        this.$broadcast("searchEvent", { key: event.keyIdentifier })
      }
      if (
        event.keyCode == 8 ||
        (46 < event.keyCode && event.keyCode < 91) ||
        event.keyCode > 145
      ) {
        this.$refs.searchIcon.working()
        this.$refs.search.searching = true
      }
    },

    catalogSlugToId(slug) {
      for (var i = 0; i < this.menus["sidebar"].length; i++) {
        if (this.menus["sidebar"][i].slug == slug) {
          return this.menus["sidebar"][i].id
        }
      }

      return null
    }
  }
}
</script>
