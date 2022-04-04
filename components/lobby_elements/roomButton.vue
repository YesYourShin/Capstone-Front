<template lang="">
  <div class="cursor-pointer" @click="goToRoom(room.room)">
    <div class="bg-red-600 h-9 flex justify-between items-center px-2 mb-2">
      <span>{{ room.description }}</span>
      <span>{{ room.memberCount }}/{{ room.limit }}</span>
    </div>
    <div class="h-9 w-3/4 bg-red-600"></div>
  </div>
</template>
<script>
import { joinGame } from "@/api/mafiaAPI";

export default {
  props: {
    room: Object,
  },
  methods: {
    goToRoom(id) {
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
