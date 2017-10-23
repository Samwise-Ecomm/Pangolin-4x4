<template>
<li>
	<div>
		{{ file.name }}
	</div>
	<ul v-if="file.children">
		<upload-file-list 
      v-for="child in file.children"
      :file="child">
    </upload-file-list>
	</ul>
</li>
</template>

<script>
export default {
  props: {
    file: Object
  },

  components: {
    files: require("./files.vue")
  }
}
</script>