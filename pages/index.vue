<template>
    <div class="testbox">
      <Profile/>
      <Home/>
    </div>
</template>

<script>
import Profile from '../components/profile.vue';
import Home from '../components/home.vue';
export default {
  components: { Profile, Home },
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
  text-align: center;
  height: 100%;
  min-height: 735px;
  margin-top: 100px;
  background-color: rgba(0, 0, 0, 0.829);
  display:flex;
}
</style>
