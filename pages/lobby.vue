<template>
  <div class="h-screen" id="lobbyBox">
    <div class="flex">
      <profile></profile>
      <gameLobby />
    </div>
  </div>
</template>
<script>
import profile from "@/components/profileInGame.vue";
import gameLobby from "@/components/gameLobby.vue";
import { getMyInformation } from "@/api/mafiaAPI";

export default {
  transition: "lobby",
  name: "lobby",
  components: {
    profile,
    gameLobby,
  },
  // asyncData({ store }) {
  //   // const response = getMyInformation();
  //   // store.commit("user/setMyInfo", response.data);
  //   if (store.getters["user/getMyInfo"]) {
  //     return;
  //   }
  //   store.dispatch("user/fetchMyInfo");
  // },
};
</script>
<style lang="scss">
.lobby-enter-active,
.lobby-leave-active {
  transition: opacity 0.5s;
}
.lobby-enter,
.lobby-leave-to {
  opacity: 0;
}

#lobbyBox {
  background-image: url("@/assets/game/bay.png");
  background-size: 100%;
  background-position: bottom;
}
</style>
