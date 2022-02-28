<template lang="">
  <div class="flex flex-col min-h-screen w-full">
    <div class="flex-grow">
      <div class="flex">
        <div class=" bg-gradient-to-r via-gray-300 from-transparent flex justify-center items-center">
          <p>방 제목입니다</p>
        </div>
        <sideBar></sideBar>
      </div>
      <div class="px-2 mt-10">
        <div class="grid grid-cols-5 justify-evenly">
          <template v-for="user in players">
            <div class="justify-self-center px-2 pb-3 w-full">
              <div
                class="aspect-video bg-fuchsia-400 border border-red-600"
              ></div>
              <p class="bg-white rounded-b-lg">{{user.profile ? user.profile.nickname : ''}}</p>
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
  data() {
    return {
      players: [
        {
          id: 1,
          social_id: 1111,
          provider: 'KAKAO',
          role: 1,
          profile: {
            id: 1,
            nickname: 'playerone',
            image: 'url',
            self_introduction: 'hi',
            manner: 0,
            level: 1,
            exp: 100,
          },
        },
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {}
      ]
    }
  },
  methods: {
    exit() {
      this.$router.push(`/lobby`)
    }
  },
};
</script>
<style lang=""></style>
