<template lang="">
  <div class="flex" id="roomBox">
    <profile ref="profileComponent" @handleClick="handleClick"></profile>
    <gameRoom :roomInfo="roomInfo"></gameRoom>

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
import gameRoom from "@/components/gameRoom.vue";
import { getRoom } from "@/api/mafiaAPI";

export default {
  transition: "intro",
  name: "room",
  components: {
    profile,
    gameRoom,
  },
  computed: {
    entered() {
      return this.$store.state.stream.entered;
    },
    left() {
      return this.$store.state.stream.left;
    },
  },
  data() {
    return {
      options: [
        {
          name: "Send Message",
        },
        {
          name: "Invite to Room",
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
  methods: {
    handleClick(event, item) {
      const find = this.options.find(
        (option) => option.name === "Invite to Room"
      );
      if (!item.online) {
        if (find) {
          this.options.splice(this.options.indexOf(find), 1);
        }
      } else {
        if (!find) {
          this.options.splice(1, 0, {
            name: "Invite to Room",
          });
        }
      }
      this.$refs.vueSimpleContextMenu.showMenu(event, item);
    },
    optionClicked(event) {
      this.$refs.profileComponent.optionClicked(event);
    },
  },
  watch: {
    entered(newVal, oldVal) {
      if (newVal) {
        this.$toast.show(newVal + " 님이 참가하셨습니다.");
        this.$store.commit("stream/resetEntered");
      }
    },
    left(newVal, oldVal) {
      if (newVal) {
        this.$toast.show(newVal + " 님이 퇴장하셨습니다.");
        this.$store.commit("stream/resetLeft");
      }
    },
  },
  created() {
    this.$root.roomSocket = this.$nuxtSocket({
      channel: "/room",
      withCredentials: true,
      transports: ["websocket"],
    });
    this.$store.commit("mainChatInit", "#room");
  },
  async asyncData({ params }) {
    const roomInfo = await getRoom(params.id);
    console.log("roomId : room ", params);
    return { roomInfo: roomInfo.data.data };
  },

  async fetch({ store, params }) {
    const roomId = params.id;
    console.log("this is fetch", roomId);
    store.commit("roomId/setRoomId", roomId);
    console.log(store.state.roomId);
  },
};
</script>
<style lang="scss">
#roomBox {
  background-image: url("@/assets/game/bay.png");
  background-size: 100%;
  background-position: bottom;
}

$t-duration: 800ms;
$t-delay: 300ms;

.intro-enter-active,
.intro-leave-active,
.layout-enter-active,
.layout-leave-active {
  transition-duration: $t-duration * 2;

  &::before,
  &::after {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    display: block;
    width: 100%;
    height: 50%;
    transition-property: opacity, transform;
    transition-timing-function: ease-in-out;
  }

  &::before {
    background-color: #2e2e2e;
  }

  &::after {
    top: 50%;
    background-color: #2e2e2e;
  }
}

.intro-leave,
.layout-leave {
  &::before,
  &::after {
    transform: scaleX(0);
  }
}

.intro-leave-active,
.layout-leave-active {
  &::before {
    transition-duration: $t-duration;
  }

  &::after {
    transition-duration: $t-duration - $t-delay;
    transition-delay: $t-delay;
  }
}

.intro-leave-to,
.layout-leave-to {
  &::before,
  &::after {
    transform: scale(1);
    transform-origin: left;
  }
}

.intro-enter,
.layout-enter {
  &::before,
  &::after {
    transform: scaleX(1);
  }
}

.intro-enter-active,
.layout-enter-active {
  &::before {
    transition-duration: $t-duration;
  }

  &::after {
    transition-duration: $t-duration - $t-delay;
    transition-delay: $t-delay;
  }
}

.intro-enter-to,
.layout-enter-to {
  &::before,
  &::after {
    transform: scaleX(0);
    transform-origin: right;
  }
}
</style>
