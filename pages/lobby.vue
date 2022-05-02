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
import { GameRoomEvent } from "@/api/mafiaAPI";

export default {
  transition: "lobby",
  name: "lobby",
  components: {
    profile,
    gameLobby,
  },
  created() {
    this.$root.lobbySocket = this.$nuxtSocket({
      channel: "/room",
      withCredentials: true,
      transports: ["websocket"],
    });
    this.$store.commit("mainChatInit", "#lobby");
  },
  mounted() {
    this.$root.lobbySocket.emit(GameRoomEvent.JOIN, {
      roomId: 0,
    });
  },
  // asyncData({ store }) {
  //   // const response = getMyInformation();
  //   // store.commit("user/setMyInfo", response.data);
  //   if (store.getters["user/getMyInfo"]) {
  //     return;
  //   }
  //   store.dispatch("user/fetchMyInfo");
  // },
  beforeDestroy() {
    this.$root.lobbySocket.emit(GameRoomEvent.LEAVE);
  },
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
