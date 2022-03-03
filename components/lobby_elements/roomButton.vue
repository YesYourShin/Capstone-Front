<template lang="">
  <div
    class="bg-gray-800 px-2 py-2 cursor-pointer hover:scale-95 border border-gray-600 transition duration-100"
    @click="goToRoom(room.gameNumber)"
  >
    <div class="bg-red-600 h-9 flex justify-between items-center px-2 mb-2">
      <span>{{ room.name }}</span>
      <span>{{ room.memberCount }}/{{ room.limit }}</span>
    </div>
    <div class="h-9 w-3/4 bg-red-600"></div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  props: {
    room: Object,
  },
  methods: {
    async goToRoom(id) {
      const res = await axios.post(
        `${this.$store.state.api}/games/${id}`,
        {},
        this.$store.state.payload
      );
      console.log(res);
      this.$router.push(`room/${id}`);
    },
  },
};
</script>
<style lang=""></style>
