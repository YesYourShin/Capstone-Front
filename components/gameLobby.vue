<template lang="">
  <div class="flex flex-col h-screen w-full relative">
    <div class="px-5">
      <div class="flex items-center py-2">
        <!--로비 위쪽 검색창 및 체크박스 등-->

        <roomSearch ref="search"></roomSearch>
        <!--검색 창-->

        <checkBoxes ref="checks"></checkBoxes>
        <!--체크박스-->

        <div class="grow"></div>
        <!-- 공란 -->

        <createRoomButton></createRoomButton>
        <!--방만들기 버튼-->

        <leaveButton :pathToGo="'/'"></leaveButton>
        <!-- 나가기 버튼 -->
      </div>
      <!-- <div class="grid grid-cols-2 gap-2"> -->
      <!--방 목록-->
      <!-- <template v-for="room in rooms">
          <roomButton :room="room"></roomButton>
        </template> -->
      <!-- </div> -->

      <!-- <pageNavigator></pageNavigator> -->
      <!-- 페이지네이션 (임시)-->
    </div>
    <RoomTable :rooms="computedRooms"></RoomTable>
    <input type="text" v-model="testInput" />
    <div class="h-12 w-20 bg-green-500" @click="friendReq">친구신청</div>
    <div class="h-12 w-20 bg-blue-500" @click="directMsg">DM</div>
    <chatBox></chatBox>
  </div>
</template>
<script>
import roomButton from "@/components/lobby_elements/roomButton.vue";
import roomSearch from "@/components/lobby_elements/roomSearch.vue";
import checkBoxes from "@/components/lobby_elements/checkBoxes.vue";
import createRoomButton from "@/components/lobby_elements/createRoomButton.vue";
import chatBox from "@/components/lobby_elements/chatBox.vue";
import leaveButton from "@/components/lobby_elements/leaveButton.vue";
import pageNavigator from "@/components/lobby_elements/pageNavigator.vue";
import RoomTable from "@/components/lobby_elements/RoomTable.vue";
// import videoComponent from '@/components/videoComponent.vue';
import { getRooms, UserEvent, requestFriend, sendDM } from "@/api/mafiaAPI";

export default {
  components: {
    roomButton,
    roomSearch,
    checkBoxes,
    createRoomButton,
    chatBox,
    leaveButton,
    pageNavigator,
    RoomTable,
  },
  data() {
    return {
      rooms: [],
      evtSource: null,
      isMounted: false,
      testInput: "",
    };
  },
  computed: {
    subscribedStreams() {
      return this.$store.state.stream.subscribedStreams;
    },
    computedRooms() {
      if (!this.isMounted) return [];
      let rooms = this.rooms;
      if (this.$refs.search.input) {
        rooms = rooms.filter((room) => {
          return room.description.includes(this.$refs.search.input);
        });
      }
      if (this.$refs.checks.getPublicRooms) {
        rooms = rooms.filter((room) => room.isPrivate === false);
      }
      return rooms;
    },
  },
  methods: {
    showAlert() {
      // this.$swal('Hello Vue world')
      this.$swal({
        title: "Error!",
        text: "Do you want to continue",
        icon: "error",
        confirmButtonText: "Cool",
      });
    },
    friendReq() {
      requestFriend(this.testInput, this.$store.getters["user/getMyInfo"].id)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    directMsg() {
      // this.$root.userSocket.emit(UserEvent.DM, { message: this.testInput });
      sendDM({ message: "테스트 중", friendId: this.testInput });
    },
  },
  mounted() {
    this.isMounted = true;
    getRooms()
      .then((res) => {
        this.rooms = res.data.data;
      })
      .catch((err) => {
        console.log(err);
      });

    this.evtSource = new EventSource(
      process.env.NODE_ENV === "production"
        ? "https://gjgjajaj.xyz/api/games/rooms/sse"
        : "http://localhost:3065/api/games/rooms/sse",
      {
        withCredentials: true,
      }
    );

    var vrc = this;
    this.evtSource.onmessage = function (e) {
      vrc.rooms = JSON.parse(e.data).data;
      console.log(vrc.rooms);
    };
  },
  watch: {
    subscribedStreams(newVal, oldVal) {
      if (this.subscribedStreams.length) {
        this.$store.commit("stream/removeAllSubscribers");
      }
    },
  },
  created() {
    this.$store.dispatch("user/fetchMyInfo");
  },
  beforeDestroy() {
    this.evtSource.close();
  },
};
</script>
<style lang="scss" scoped></style>
