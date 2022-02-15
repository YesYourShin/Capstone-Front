<template lang="">
  <div class="flex flex-col min-h-screen w-full">
    <div class="flex-grow">
      <div class="flex">
        <div class="bg-gray-300 flex justify-center items-center">
          <p>방 제목입니다</p>
        </div>
        <sideBar></sideBar>
      </div>
      <div class="px-2 mt-10">
        <div class="flex flex-wrap justify-evenly">
          <template v-for="n in 10">
            <div class=" justify-self-center mx-2 mb-3">
              <div
                class="w-[192px] h-[108px] bg-fuchsia-400 border border-red-600"
              ></div>
              <p class="bg-white rounded-b-lg">이름</p>
            </div>
          </template>
        </div>
      </div>
      <div class="flex flex-row-reverse px-2">
        <div class="p-2 w-40 justify-center items-center" @click="exit()">
          <div class="flex items-center p-4 bg-yellow-200 rounded-lg shadow-xs cursor-pointer hover:bg-yellow-500 hover:text-gray-100 transition duration-300">
            <p class=" text-lg font-bold mx-auto">
              나가기
            </p>
          </div>
        </div>
        <div class="p-2 md:w-40 ">
          <div class="flex items-center p-4 bg-green-200 rounded-lg shadow-xs cursor-pointer hover:bg-green-500 hover:text-gray-100 transition duration-300">
            <p class=" text-lg font-bold mx-auto">
              준비하기
            </p>
          </div>
        </div>
      </div>
    </div>
    <chatBox></chatBox>
  </div>
</template>
<script>
import chatBox from "@/components/lobby_elements/chatBox.vue";
import sideBar from "@/components/lobby_elements/sideBar.vue";
export default {
  components: {
    chatBox,
    sideBar,
  },
  methods: {
    exit() {
      this.$router.push(`/lobby`)
    }
  },
};
</script>
<style lang=""></style>
