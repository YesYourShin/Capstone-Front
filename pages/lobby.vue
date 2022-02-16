<template lang="">
  <div class="flex">
    <profile></profile>
    <gameLobby></gameLobby>
  </div>
</template>
<script>
import profile from "@/components/profileInGame.vue";
import gameLobby from "@/components/gameLobby.vue";

export default {
  components: {
    profile,
    gameLobby,
  },
};
</script>
<style lang=""></style>
