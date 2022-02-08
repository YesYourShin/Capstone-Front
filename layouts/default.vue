<template>
  <div>
    <Header/>
    <index/>
    <Footer/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Footer from '../components/footer.vue'
import Header from '../components/header.vue'
import index from '../pages/index.vue'

export default Vue.extend({
  components: { index, Header, Footer },

})
</script>

<style lang="" scoped>

</style>
