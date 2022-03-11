<template>
  <div class="h-screen" id="lobbybox">
    <div class="proFileBox">
      <!-- <NuxtLink to="/">
      <img src="@/assets/Logow.png" class="proimg">
      </NuxtLink> -->
      <profile/>
    </div>
    <div class="lobbyBox">
      <gameLobby/>
    </div>
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
<style lang="scss" scoped>
@import '~assets/lobby.scss'
</style>
