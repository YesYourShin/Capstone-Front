<template lang="">
  <div class="body">
    <profile></profile>
    <gameLobby></gameLobby>
  </div>
</template>
<script>
import profile from "@/components/profile.vue";
import gameLobby from "@/components/gameLobby.vue";

export default {
  components: {
    profile,
    gameLobby,
  },
};
</script>
<style lang="scss">
@import "~assets/lobby.scss";
</style>
