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
import { GameRoomEvent, UserEvent } from "@/api/mafiaAPI";

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

    this.$root.userSocket = this.$nuxtSocket({
      channel: "/user",
      withCredentials: true,
      transports: ["websocket"],
    });

    this.$root.userSocket.on(UserEvent.FRIEND_REQUEST, (data) => {
      console.log(data);
      this.$toast.show(data.userName + " 님이 친구 요청을 보냈습니다.");
    });

    this.$root.userSocket.on(UserEvent.FRIEND_ACCEPT, (data) => {
      console.log(data);
      this.$toast.show(data.userName + " 님이 친구 요청을 수락했습니다.");
    });

    this.$root.userSocket.on(UserEvent.FRIEND_DELETE, (data) => {
      console.log(data);
      this.$toast.show(data.userName + " 님이 친구 요청을 삭제했습니다.");
    });

    this.$root.userSocket.on(UserEvent.DM, (data) => {
      console.log(data);
      this.$toast.show(data.userName + " 님이 메세지를 보냈습니다.");
    });
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
