<!DOCTYPE html>
<html>
  <head>
  <meta charset="utf-8">
  <meta id="csrf-token" content="{{ csrf_token() }}" />
	<title>Pangolin 4x4</title>

	<link rel='stylesheet' href='http://fonts.googleapis.com/css?family=Roboto:500,400,100' type='text/css'>
	<link rel='stylesheet' href='http://fonts.googleapis.com/css?family=Inconsolata' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="/css/store/template.css">
	<link rel="stylesheet" href="/css/store/font-awesome.min.css">
	<link rel="stylesheet" href="/css/store/lightbox.css">

	<style>
		.ace_editor, .ace_editor * {
	    font-family: "Monaco", "Menlo", "Ubuntu Mono", "Droid Sans Mono", "Consolas", monospace !important;
	    font-size: 12px !important;
	    font-weight: 400 !important;
	    letter-spacing: 0 !important;
		}
	</style>
</head>
<body>
	<script type="x/template" id="upload-template">
	  <div class="upload-mask" v-show="show" transition="upload">
	    <div class="upload-wrapper">
	      <div class="upload-container">

	        <div class="upload-header">
	          <i class="fa fa-upload"></i> Image Upload<br>
	          <i class="u-thin">Select image below to insert.</i>
	        </div>
	        
	        <div class="upload-body">
	          <ul>
	          	<li v-for="image in images">
	          		[<span class="fa fa-minus fa-sm u-active"></span>] <span class="u-active">${ image }</span>
	          	</li>
	          	<li>
								<label for="uploader">
									<span class="u-active">[<span class="fa fa-plus"></span>] Upload new picture</span>
								</label>
								<input type="file" name="img" accept="image/bmp,image/gif,image/jpeg,image/png" id="uploader" class="u-hide">
	          	</li>
	          </ul>
	        </div>

	        <div class="upload-footer">
	          <slot name="footer">
	            <div class="Button Button--thin Button--dark"
								@click='show = false'>
								Cancel</div>
	          </slot>
	        </div>
	      </div>
	    </div>
	  </div>
	</script>

	<div class="wrapper" :class="(search && !coding)?'search':'noSearch'">
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
						<span class="u-active" @click="search=!search">
							<i class="fa fa-fw" :class="search?'fa-check-square-o':'fa-square-o'"></i> Enable Sidebar
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
							<i class="fa fa-image"> Upload/Select Picture</i>	
						</span>
					</div>
				</div>
			</div>
		</div>
		<div id="Body">
			<div id="Body-column" class="u-contentWrapper">
				<div id="Body-content" style="padding:0;" v-if="coding">
					<div id="editor">{{ $page['content'] }}</div>
				</div>
				<div id="Body-content" v-else>
					!{ content }
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
				{{ $page['name'] }}<BR>
				{{ $page['path'] }}
			</div>
		</div>
		<upload :show.sync="showUpload">
	</div>

	<script src="/js/ace/ace.js"></script>
	<script src="/js/vue.js"></script>
	<script src="/js/vue-resource.min.js"></script>
	<script src="/js/store/jquery.min.js"></script>
	<script src="/js/store/lightbox.min.js"></script>

	<script type="text/javascript">
	$(document).ready(function() {
    Vue.config.delimiters = ['${', '}']
		Vue.config.unsafeDelimiters = ['!{', '}']
		Vue.http.headers.common['X-CSRF-TOKEN'] = $('#csrf-token').attr('content')

    new Vue({
    	el: 'body',
    	data: {
    		id: {{ $page['id'] }},
    		search: {{ $page['search'] }},
    		coding: true,
    		content: "",
    		showUpload: false
    	},

    	components: {
    		upload: {
    			template: '#upload-template',
    			data: function() {
    				return {
    					images: [
	    					'foo', 'bar', 'baz'
	    				]
	    			}
    			},
				  props: {
				    show: {
				      type: Boolean,
				      required: true,
				      twoWay: true    
				    }
				  }
    		}
    	},

    	created: function() {
    		this.$nextTick(function() {
    			$(window).scroll(function(){
						this.resizeWindow();
					}).bind(this)
					$(window).resize(function(){
						this.resizeWindow();
					}).bind(this)

					this.loadEditor();
    		})
    	},

    	methods: {
    		save: function() {
    			// mark icon as saving
					$('.js-save').removeClass("fa-floppy-o fa-check fa-times")
					$('.js-save').addClass("fa-cog fa-spin")

    			if (this.coding) {
    				var content = ace.edit("editor").getValue();
    			} else {
    				var content = this.content;
    			}
    			
    			var request = {
    				id: this.id,
    				search: this.search,
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

    		switchView: function() {
    			if (this.coding) {
    				this.content = ace.edit("editor").getValue();
    			}

    			this.coding = !this.coding;

    			if (this.coding) {
    				this.$nextTick(function() {
	    				this.loadEditor()
	    			});
    			}
    		},

    		loadEditor: function() {
    			var editor = ace.edit("editor");
			    editor.setTheme("ace/theme/monokai");
			    editor.getSession().setMode("ace/mode/html");
			    editor.$blockScrolling = Infinity;
			    if (this.content) {
			    	editor.setValue(this.content);
			    }
			    editor.selection.moveCursorFileStart();

			    this.resizeWindow();
    		},

    		resizeWindow: function() {
    			var minHeight = $(window).height() - $('#Head').height() - $('#Foot').height();
					$('#Body-column').css('min-height', minHeight+'px');
					$('#editor').css('min-height', minHeight+'px');
    		}
    	}
    });
	})
	</script>
</body>
</html>