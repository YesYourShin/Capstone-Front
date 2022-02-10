<template>
    <div class="testbox">
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
export default {
  components: { Profile, Home, Header, Footer },
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
.testbox{
  width: 100%;
  max-width: 1950px;
  min-width: none;
  display:flex;
  margin: 0 auto;
  text-align: center;
  margin-top: 100px;
  overflow: scroll;
  position: relative;
}
</style>
