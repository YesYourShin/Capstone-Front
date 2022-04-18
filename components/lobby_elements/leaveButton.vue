<template lang="">
  <div class="p-2 w-40 justify-center items-center">
    <div
      class="flex items-center p-4 bg-green-200 rounded-lg shadow-xs cursor-pointer hover:bg-green-500 hover:text-gray-100 transition duration-300"
      @click="onClickExitButton"
    >
      <p class="text-lg font-bold mx-auto">나가기</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    pathToGo: {
      type: String,
      default: "/",
    },
  },
  methods: {
    onClickExitButton() {
      document.exitFullscreen();
      this.$router.push(this.pathToGo);
    },
  },
};
</script>
<style lang=""></style>
