<template>
    <div class="indexbox">
      <Header/>
      <Home/>
      <Footer/>
    </div>
</template>

<script>
import Profile from '../components/profile.vue';
import Home from '../components/home.vue';
import Header from '../components/header.vue';
import Footer from '../components/footer.vue';
import Testbox from '../components/testbox.vue';
export default {
  components: { Profile, Home, Header, Footer, Testbox },
  name: 'CapstoneIndex',

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
.indexbox{
  width: 100%;
  min-width: 1920px;
  height: 100%;
  margin: 0 auto;
  position: relative;
}
</style>
