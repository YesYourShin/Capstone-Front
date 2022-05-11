<template>
  <div class="h-screen" id="lobbyBox">
    <div class="flex">
      <profile ref="profileComponent" @handleClick="handleClick"></profile>
      <gameLobby @notification="notification" />
    </div>

    <vue-simple-context-menu
      :elementId="'myUniqueId'"
      :options="options"
      :ref="'vueSimpleContextMenu'"
      @option-clicked="optionClicked"
    />
  </div>
</template>
<script>
import profile from "@/components/profileInGame.vue";
import gameLobby from "@/components/gameLobby.vue";

export default {
  transition: "lobby",
  name: "lobby",
  components: {
    profile,
    gameLobby,
  },
  data() {
    return {
      options: [
        {
          name: "Send Message",
        },
        {
          name: "",
          type: "divider",
        },
        {
          name: "See Details",
        },
        {
          name: "Delete Friend",
        },
      ],
    };
  },
  computed: {
    myInfo() {
      return this.$store.getters["user/getMyInfo"];
    },
  },
  methods: {
    handleClick(event, item) {
      this.$refs.vueSimpleContextMenu.showMenu(event, item);
    },
    optionClicked(event) {
      this.$refs.profileComponent.optionClicked(event);
    },
    notification() {
      this.$refs.profileComponent.notification();
    },
  },
  created() {
    this.$root.lobbySocket = this.$nuxtSocket({
      channel: "/room",
      withCredentials: true,
      transports: ["websocket"],
    });
    this.$store.commit("mainChatInit", "#lobby");

    if (!this.$root.userSocket) {
      this.$root.userSocket = this.$nuxtSocket({
        channel: "/user",
        withCredentials: true,
        transports: ["websocket"],
        teardown: false,
      });
    }
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
