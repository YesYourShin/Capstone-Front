<template lang="">
  <div class="flex flex-col min-h-screen w-full">
    <sideBar></sideBar>
    <div class="px-5 flex-grow">
      <div class="flex items-center py-2">
        <!--로비 위쪽 검색창 및 체크박스 등-->

        <roomSearch></roomSearch>
        <!--검색 창-->

        <checkBoxes></checkBoxes>
        <!--체크박스-->

        <createRoomButton></createRoomButton>
        <!--방만들기 버튼-->
      </div>
      <div class="grid grid-cols-2 gap-2">
        <!--방 목록-->
        <template v-for="room in rooms">
          <roomButton :room="room"></roomButton>
        </template>
      </div>
      <div class="h-20 w-60 rounded-lg bg-slate-400 cursor-pointer" @click="$router.push('/')">메인으로</div>
      <div class="h-20 w-60 rounded-lg bg-slate-400 cursor-pointer" @click="showAlert">메인으로</div>
      <div class="">
        <ul class="flex list-none rounded my-2 justify-end">
          <li class="relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 ml-0 rounded-l hover:bg-gray-200"><a class="page-link" href="#">Previous</a></li>
          <li class="relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 hover:bg-gray-200"><a class="page-link" href="#">1</a></li>
          <li class="relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 hover:bg-gray-200"><a class="page-link" href="#">2</a></li>
          <li class="relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 hover:bg-gray-200"><a class="page-link" href="#">3</a></li>
          <li class="relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 rounded-r hover:bg-gray-200"><a class="page-link" href="#">Next</a></li>
        </ul>
      </div>
    </div>
    <chatBox></chatBox>

  </div>
</template>
<script>
import roomButton from "@/components/lobby_elements/roomButton.vue";
import roomSearch from "@/components/lobby_elements/roomSearch.vue";
import checkBoxes from "@/components/lobby_elements/checkBoxes.vue";
import sideBar from "@/components/lobby_elements/sideBar.vue";
import createRoomButton from "@/components/lobby_elements/createRoomButton.vue";
import chatBox from "@/components/lobby_elements/chatBox.vue";
import { getGames } from '@/api/mafiaAPI'
import axios from 'axios'

export default {
  components: {
    roomButton,
    roomSearch,
    checkBoxes,
    sideBar,
    createRoomButton,
    chatBox,
  },
  data() {
    return {
      evtSource: null,
      rooms: [
      ]
    };
  },
  methods: {
    showAlert() {
      // this.$swal('Hello Vue world')
      this.$swal({
        title: 'Error!',
        text: 'Do you want to continue',
        icon: 'error',
        confirmButtonText: 'Cool',
      })
    }
  },
  async mounted() {
    console.log('entered lobby');
    // axios.get(`${this.$store.state.api}/games`, this.$store.state.payload)
    //   .then((res) => {
    //     this.rooms = res.data.data
    //   })
    const res = await getGames()
    console.log(res);
    this.rooms = res.data.data

    this.evtSource = new EventSource(`${this.$store.state.api}/games/sse`, this.$store.state.payload)

    var abd = this
    this.evtSource.onmessage = function(e) {
      const data = JSON.parse(e.data).data
      console.log(data);
      abd.rooms = data
    }
  },
  beforeDestroy() {
    this.evtSource?.close()
  }
};
</script>
<style lang="" scoped>

</style>
