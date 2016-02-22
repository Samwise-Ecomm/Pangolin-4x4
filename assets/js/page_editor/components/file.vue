<template>
<li>
	<div v-if="file.children" @click="expanded = !expanded" class="u-active">
		[<i class="fa fa-fw" :class="expanded?'fa-folder-open-o':'fa-folder-o'"></i>]
		 {{ file.name }}
	</div>
	<div v-else>
		[<i class="fa fa-fw fa-minus u-active" @click="deleteFile(file.path)"></i>]
		 <span class="u-active" @click="insert()">{{ file.name }}</span>
	</div>
	<ul v-if="file.children && expanded">
		<li v-if="file.path != 'uploads'">
			<div class="u-active" @click="deleteDirectory()">
				[<i class="fa fa-fw fa-trash"></i>]
				 Delete This Directory
			</div>
		</li>
		<file v-for="child in file.children" :file="child" :i="$index"></file>
		<li class="bump">
			<label :for="file.path" class="u-active">
				[<i class="fa fa-fw fa-upload" @click></i>]
				 Upload New Image
			</label>
			<input type="file" accept="image/bmp,image/gif,image/jpeg,image/png" :id="file.path" class="u-hide" multiple 
				@change="startUpload"
				v-el:uploader>
		</li>
		<li>
			<div>
				[<i class="fa fa-fw fa-plus" :class="validDirectory?'u-active':'u-inActive'" @click="createDirectory()"></i>]
				 <input type='text' name='newDirectory' maxlength='64' placeholder="Add New Directory" 
				 	@keyup.enter="createDirectory()"
				 	v-model='newDirectory'>
			</div>
		</li>
	</ul>
</li>
</template>

<script>
module.exports = {
	data () {
		return {
			progress: 0,
			newDirectory: ""
		}
	},

	computed: {
		validDirectory () {
			if (this.newDirectory) {
				return true
			} else {
				return false
			}
		}
	},

	props: {
		file: Object,

		expanded: {
			type: Boolean,
			default: false
		},

		i: {
			type: Number,
			default: 0
		}
	},

	methods: {
		startUpload() {
      this.progress = 0
      this.upload()
    },

  	upload () {
      if (this.progress >= this.$els.uploader.files.length) {
        return 1
      }

  		var request = new FormData()
    	request.append('uploader', this.$els.uploader.files[this.progress])
    	request.append('path', this.file.path)
      this.progress++

    	this.$http.post('/admin/upload', request).then(function(response) {
    		if (response.data.result == 'error') {
    			this.$dispatch('error', response.data.body)
    		}

    		if (response.data.result == 'success') {
    			this.file.children.push(response.data.body)
    		}

    		this.upload()
    	})
  	},

  	deleteFile (path) {
  		var request = {
  			file: path
  		}

  		this.$http.delete('/admin/upload', request).then(function(response) {
  			if (response.data.result == 'error') {
    			this.$dispatch('error', response.data.body)
    		}

    		if (response.data.result == 'success') {
    			this.$parent.file.children.splice(this.i, 1)
    		}
  		})
  	},

  	createDirectory () {
  		var request = {
  			path: this.file.path,
  			name: this.newDirectory
  		}

  		this.$http.post('/admin/upload/directory', request).then(function(response) {
  			if (response.data.result == 'error') {
    			this.$dispatch('error', response.data.body)
    		}

  			if (response.data.result == 'success') {
  				this.file.children.push(response.data.body)
  			}

  			this.newDirectory = ""
  		})
  	},

  	deleteDirectory () {
  		if (confirm("Are you sure you want to delete '"+this.file.name+"' along with all it's files?")) {
  			this.$http.delete('/admin/upload/directory', { path: this.file.path }).then(function(response) {
  				if (response.data.result == 'error') {
	    			this.$dispatch('error', response.data.body)
	    		}

	    		if (response.data.result == 'success') {
	    			this.$parent.file.children.splice(this.i, 1)
	    		}
  			})
  		}
  	},

  	insert() {
  		this.$dispatch('insert', '/img/'+this.file.path)
  		this.$dispatch('closeUploads')
  	}
	}
}
</script>