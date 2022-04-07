<template lang="">
  <div
    class="bg-gray-800 rounded-2xl shadow-xl px-2 py-2 cursor-pointer hover:scale-95 border border-gray-600 transition duration-200"
    @click="goToRoom(room.room)"
  >
    <div
      class="bg-orange-500 h-9 flex justify-between items-center px-2 mb-2 rounded-md"
    >
      <span>{{ room.description }}</span>
      <span>{{ room.memberCount }}/{{ room.limit }}</span>
    </div>
    <div class="h-9 w-3/4 bg-red-500 rounded-md"></div>
  </div>
</template>
<script>
import { joinGame } from "@/api/mafiaAPI";

export default {
  props: {
    room: Object,
  },
  methods: {
    goToRoom() {
      // joinGame(id)
      //   .then((res) => {
      //     this.$router.push(`room/${id}`);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });

      this.$router.push(`/room/${this.room.room}`);
    },
  },
};
</script>
<style lang=""></style>
