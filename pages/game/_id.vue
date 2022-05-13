<template lang="">
  <div class="body">
    <Play></Play>
  </div>
</template>
<script>
import Play from "@/components/play.vue";
import { getRoom } from "@/api/mafiaAPI";

export default {
  components: {
    Play,
  },
  data() {
    return {};
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
  async asyncData({ params }) {
    const roomInfo = await getRoom(params.id);
    return {
      janus: params.janus,
      storePlugin: params.storePlugin,
      roomInfo: roomInfo.data.data
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
