<template lang="">
  <div class="p-2 w-40 justify-center items-center">
    <div
      class="flex items-center p-4 bg-yellow-200 rounded-lg shadow-xs cursor-pointer hover:bg-yellow-500 hover:text-gray-100 transition duration-300"
      @click="$router.push(pathToGo)"
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
};
</script>
<style lang=""></style>
