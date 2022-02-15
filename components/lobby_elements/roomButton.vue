<template lang="">
  <div
    class="bg-gray-800 px-2 py-2 cursor-pointer hover:scale-95 border border-gray-600 transition duration-100"
    @click="goToRoom(room.roomNum)"
  >
    <div class="bg-red-600 h-9 flex justify-between items-center px-2 mb-2">
      <span>{{ room.roomName }}</span>
      <span>{{ room.currentPlayers }}/{{ room.maxPlayers }}</span>
    </div>
    <div class="h-9 w-3/4 bg-red-600"></div>
  </div>
</template>
<script>
export default {
  props: {
    room: Object,
  },
  methods: {
    goToRoom(id) {
      this.$router.push(`room/${id}`);
    },
  },
};
</script>
<style lang=""></style>
