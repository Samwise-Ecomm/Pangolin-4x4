<template>
	<div class="upload-mask" v-show="show" transition="upload">
    <div class="upload-wrapper">
      <div class="upload-container">

        <div class="upload-header">
          <i class="fa fa-file-image-o"></i> Image Upload<br>
          <i class="u-thin">Select image below to insert.</i>
        </div>
        
        <div class="upload-body">
          <ul>
            <file :file="files" expanded></file>
          </ul>
        </div>

        <div class="upload-footer">
          <div class="error-message">{{ error }}&nbsp;</div>
          <br>
          <slot name="footer">
            <div class="Button Button--thin Button--dark"
							@click='show = false'>
							Cancel</div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
	data: function() {
		this.getFiles()
		return {
			files: {},
      error: "",
      errorDebouncer: 0,
		}
	},
  props: {
    show: {
      type: Boolean,
      required: true,
      twoWay: true    
    }
  },
  events: {
    error (message) {
      this.error = message
      this.errorDebouncer = Date.now() + 4500
      setTimeout(function() {
        if (this.errorDebouncer < Date.now()) {
          this.error = ""
        }
      }.bind(this), 5000)
    },
    
    closeUploads () {
      this.show = false
    }
  },
  methods: {
  	getFiles () {
  		this.$http.get('/admin/upload').then(function(response) {
  			this.$set('files',response.data)
  		})
  	},
  },
}
</script>

<style>
input[type=text] {
  border: 0;
  width: 40%;
  margin-left:1px;
  border-bottom: 1px solid #ccc;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}

input[type=text]:focus {
  outline: none;
  border-bottom: 1px solid #000;
}

ul > li {
  margin-left: 10px;
}

li div.u-active, li label.u-active, li i.u-active {
  color: black;
  background: white;
}

li div.u-active:hover, li label.u-active:hover {
  cursor: pointer;
  color: #ce3229;
}

.u-inActive {
  color: #666;
}

.bump {
  margin-top: 3px;
}

.error-message {
  margin-top: 8px;
  color: red;
}

.upload-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.upload-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.upload-container {
  width: 600px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
}

.upload-header h3 {
  margin-top: 0;
  color: #42b983;
}

.upload-body {
  margin: 20px 0;
  overflow-y: scroll;
  height: 400px;
}

.upload-default-button {
  float: right;
}

.grow-enter, .grow-leave {
  height: 0;
}

.grow-transition {
  transition: all .3s ease;
}

.upload-enter, .upload-leave {
  opacity: 0;
}

.upload-enter .upload-container,
.upload-leave .upload-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>