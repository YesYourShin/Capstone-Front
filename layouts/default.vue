<template>
  <div class="main" style="">
    <Nuxt />
  </div>
</template>

<script lang="ts">

export default {
  components: {},

  async created(){
    // getter 호출 하는 것만 다시 하면 됨
    const myInfo = this.$store.getters.getMyInfo;
    if(!myInfo) {
      await this.$store.dispatch("user/fetchMyInfo");
    }
  },
};
</script>

<style>
html {
  background-color: rgba(0, 0, 0, 0.76);
  height: 100%;
}
</style>
