<template>
  <div class="main" style="">
    <Nuxt />
  </div>
</template>

<script lang="ts">
export default {
  components: {},
  name: "Default",
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name !== "room-id" && to.name !== "game") {
          this.$store.commit("stream/onRoomOut");
        } else {
          this.$store.commit("stream/offRoomOut");
        }

        if (
          !(to.name === "lobby" || to.name === "game" || to.name === "room-id")
        ) {
          if (this.$root.userSocket) {
            this.$root.userSocket.disconnect();
            this.$root.userSocket.close();
            this.$root.userSocket = null;
          }
          this.$store.commit("destroyChats");
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style>
html {
  /* background-color: rgba(0, 0, 0, 0.76); */
  height: 100%;
  background-color: rgba(0, 0, 0, 0.911);
}
</style>
