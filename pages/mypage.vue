<template>
  <div class="mypagebox">
    <Header/>
    <p>test</p>
    <Footer/>
  </div>
</template>

<script>
import Footer from '../components/footer.vue';
import Header from '../components/header.vue';
export default {
  components: { Header, Footer },
  name: 'CapstoneMypage',

  data() {
    return {

    };
  },

  mounted() {

  },

  methods: {

  },
};
</script>

<style lang="scss" scoped>
.mypagebox{
  height: 100vh;
}
</style>
