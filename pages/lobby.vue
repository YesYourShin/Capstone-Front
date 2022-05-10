<template>
  <div class="h-screen" id="lobbyBox">
    <div class="flex">
      <profile ref="profileComponent"></profile>
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
      this.$toast.show(data.data, {
        action: [
          {
            text: "See",
            onClick: (e, toastObject) => {
              this.$refs.profileComponent.notification();
              toastObject.goAway(0);
            },
          },
          {
            text: "Cancel",
            onClick: (e, toastObject) => {
              toastObject.goAway(0);
            },
          },
        ],
      });
    });

    this.$root.userSocket.on(UserEvent.FRIEND_ACCEPT, (data) => {
      console.log(data);
    });

    this.$root.userSocket.on(UserEvent.FRIEND_DELETE, (data) => {
      console.log(data);
    });

    this.$root.userSocket.on(UserEvent.DM, (data) => {
      console.log(data);
      this.$store.commit("newMessage", data);
      if (
        this.$store.state.chats[this.$store.state.selectedIndex].userId !==
          data.sender.userId &&
        this.$store.state.chats[this.$store.state.selectedIndex].userId !==
          data.receiver.userId
      ) {
        const senderIndex = this.$store.state.chats.indexOf(
          this.$store.state.chats.find(
            (chat) => chat.userId === data.sender.userId
          )
        );
        console.log("senderIndex: " + senderIndex);
        this.$toast.show(data.sender.nickname + "님이 메시지를 보냈습니다.", {
          action: [
            {
              text: "See",
              onClick: (e, toastObject) => {
                this.$store.commit("tabClicked", senderIndex);
                toastObject.goAway(0);
              },
            },
            {
              text: "Cancel",
              onClick: (e, toastObject) => {
                toastObject.goAway(0);
              },
            },
          ],
        });
      }
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
