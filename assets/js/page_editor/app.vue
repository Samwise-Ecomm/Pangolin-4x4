<template>
<div>
	<div class="wrapper" v-if="loaded" :class="(page.search && !coding)?'search':'noSearch'">
		<div id="Head">
			<div id="Head-highlightBar"></div>
			<div id="Head-titleBar">
				<div class="u-contentWrapper">
					<a>
						<img id="Head-logo" src="/img/store/webLogo.svg" onerror="this.src='/img/store/webLogo.png;this.onerror=null;'">
					</a>
					<div id="Head-contact">
					</div>
				</div>
			</div>
			<div id="Head-navBar" class="u-unselectable">
				<div class="u-contentWrapper">
					<div class="u-floatLeft">
						<a href="/admin" style="color:white;"><span class="u-active"><i class="fa fa-home"></i> Return to Panel</span></a>
						&nbsp;|&nbsp;
						<span @click="save" class="u-active"><i class="fa fa-floppy-o js-save"></i> Save Page</span>
					</div>
					
					<div class='u-floatRight'>
						<span class="u-active" @click="page.search=!page.search">
							<i class="fa fa-fw" :class="page.search?'fa-check-square-o':'fa-square-o'"></i> Enable Sidebar
						</span>
						&nbsp;|&nbsp;
						<span class="u-active" @click="switchView">
							<span v-if="coding">View </span>
							<span v-else>Code </span>
							<i class="fa" :class="coding?'fa-toggle-off':'fa-toggle-on'"></i>
						</span>
					</div>

					<div class="u-center">
						<span class="u-active" v-if="coding" @click="showUpload = !showUpload">
							<i class="fa fa-image"></i> Upload/Select Picture
						</span>
					</div>
				</div>
			</div>
		</div>
		<div id="Body">
			<div id="Body-column" class="u-contentWrapper">
				<div id="Body-content" style="padding:0;" v-if="coding">
					<div id="editor">{{ page.content }}</div>
				</div>
				<div id="Body-content" v-else>
					{{{ page.content }}}
				</div>
				<div id="SideNav">
					<br>
					Sidebar
					<div class="u-thin">
						Uncheck 'Enable Sidebar' <br>
						to hide this.
						<br><br>
						Note: Disabling the sidebar will<br>
						also disable searching and cart<br> 
						modification on this page.
					</div>
				</div>
			</div>
		</div>
		<div id="Foot">
			<div id="Foot-blackBar"></div>
			<div id="Foot-navBar">
				{{ page.name }}<BR>
				{{ page.path }}
			</div>
		</div>

		<upload :show.sync="showUpload"></upload>
	</div>
</div>
</template>

<style>
	.ace_editor, .ace_editor * {
    font-family: "Monaco", "Menlo", "Ubuntu Mono", "Droid Sans Mono", "Consolas", monospace !important;
    font-size: 12px !important;
    font-weight: 400 !important;
    letter-spacing: 0 !important;
	}
	#editor {
		height: 100%;
	}
</style>

<script>
module.exports = {
	el: '#app',

	data () {
		this.loadPage()

		return {
			page: {},
			loaded: false,
  		search: true,
  		coding: true,
  		content: "",
  		showUpload: false,
  	}
	},

	components: {
		upload: require('./components/upload.vue')
	},

	events: {
		insert (htm) {
			ace.edit("editor").insert(htm)
		}
	},

	methods: {
		loadPage () {
			var id = window.location.href.split('/')[window.location.href.split('/').length - 1]
			this.$http.get('/admin/pages/'+id).then(function(response) {
				this.$set('page', response.data)
				this.loaded = true
				this.$nextTick(function() {
					this.loadEditor()	
				})
			})
		},

		save () {
			// mark icon as saving
			$('.js-save').removeClass("fa-floppy-o fa-check fa-times")
			$('.js-save').addClass("fa-cog fa-spin")

			if (this.coding) {
				var content = ace.edit("editor").getValue();
			} else {
				var content = this.page.content;
			}
			
			var request = {
				id: this.page.id,
				search: this.page.search,
				content: content
			}

			this.$http.post('/admin/page', request).then(function(response) {
				$(".js-save").removeClass("fa-cog fa-spin")
				$(".js-save").addClass("fa-check")
				setTimeout( function() {
					$(".js-save").removeClass("fa-check")
					$(".js-save").addClass("fa-floppy-o")
				}, 1500)
			}, function() { // Error Catcher
				$(".js-save").removeClass("fa-cog fa-spin")
				$(".js-save").addClass("fa-times")
				setTimeout( function() {
					$(".js-save").removeClass("fa-times")
					$(".js-save").addClass("fa-floppy-o")
				}, 1500)
			});
		},

		switchView () {
			if (this.coding) {
				this.page.content = ace.edit("editor").getValue();
			}

			this.coding = !this.coding;

			if (this.coding) {
				this.$nextTick(function() {
  				this.loadEditor()
  			});
			}
		},

		loadEditor () {
			var editor = ace.edit("editor");
	    editor.setTheme("ace/theme/monokai");
	    editor.getSession().setMode("ace/mode/html");
	    editor.$blockScrolling = Infinity;
	    if (this.page.content) {
	    	editor.setValue(this.page.content);
	    }
	    editor.selection.moveCursorFileStart();
	    this.resizeWindow()
		},

		resizeWindow () {
			var minHeight = $(window).height() - $('#Head').height() - $('#Foot').height();
			$('#Body-column').css('min-height', minHeight+'px');
			// $('#editor').css('min-height', minHeight+'px');
		}
	}
}
</script>