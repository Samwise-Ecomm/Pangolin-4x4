<template>
<input type="text" v-model="query" class="input" placeholder="Search Within Catalog...">
</template>

<script>
export default {
  props: ["query"]
}
</script>
