<template lang="">
  <div class="body">
    <Play :roomInfo="roomInfo"></Play>
  </div>
</template>
<script>
import Play from "@/components/play.vue";

export default {
  components: {
    Play,
  },
  data() {
    return {};
  },
  created() {
    this.$root.gameSocket = this.$nuxtSocket({
      channel: "/game",
      withCredentials: true,
      transports: ["websocket"],
    });
  },
  computed: {
    isRoomOut() {
      return this.$store.state.stream.isRoomOut;
    },
  },
  methods: {
    exit() {
      var unpublish = { request: "unpublish" };
      var leave = { request: "leave" };
      var vrc = this;
      this.storePlugin.send({
        message: unpublish,
        success: function () {
          vrc.$store.commit("stream/removeAllSubscribers");
          vrc.$store.commit("stream/destroyRoomMembers");
        },
        error: function (error) {
          console.log("unpublish failed:", error);
        },
      });
      this.storePlugin.send({
        message: leave,
        success: function () {
          vrc.janus.destroy();
        },
        error: function (error) {
          console.log("leave failed:", error);
        },
      });
    },
  },
  asyncData({ params }) {
    return {
      janus: params.janus,
      storePlugin: params.storePlugin,
      roomInfo: params.roomInfo,
    };
  },
  beforeDestroy() {
    if (this.isRoomOut) {
      this.exit();
    }
  },
};
</script>
<style lang="scss"></style>
