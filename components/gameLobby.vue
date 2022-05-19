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
    </div>
    <RoomTable :rooms="computedRooms"></RoomTable>
    <!--방 목록-->
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
import { getRooms, UserEvent, GameRoomEvent } from "@/api/mafiaAPI";

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
    };
  },
  computed: {
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
    };

    if (this.$root.userSocket && !this.$root.userSocket._callbacks) {
      this.$root.userSocket.on(UserEvent.FRIEND_REQUEST, (data) => {
        console.log(data);
        this.$store.commit("user/addNotification", data);
        this.$toast.show(data.data, {
          action: [
            {
              text: "See",
              onClick: (e, toastObject) => {
                this.$emit("notification");
                toastObject.goAway(0);
              },
            },
            {
              text: "Close",
              onClick: (e, toastObject) => {
                toastObject.goAway(0);
              },
            },
          ],
        });
      });

      this.$root.userSocket.on(UserEvent.FRIEND_ACCEPT, (data) => {
        console.log(data);
        this.$store.commit("user/addFriend", data.user);
        this.$toast.show(data.user.nickname + " accepted your friend request!");
      });

      this.$root.userSocket.on(UserEvent.FRIEND_DELETE, (data) => {
        console.log(data);
        this.$store.commit("user/deleteFriend", data.userId);
        this.$store.commit("tabCloseByUserId", data.userId);
      });

      this.$root.userSocket.on(UserEvent.DM, (data) => {
        console.log(data);
        this.$store.commit("newMessage", data);
        if (
          this.$store.state.chats[this.$store.state.selectedIndex].userId !==
            data.sender.userId &&
          this.$store.state.chats[this.$store.state.selectedIndex].userId !==
            data.receiver.userId
        ) {
          const senderIndex = this.$store.state.chats.indexOf(
            this.$store.state.chats.find(
              (chat) => chat.userId === data.sender.userId
            )
          );
          console.log("senderIndex: " + senderIndex);
          this.$toast.show(data.sender.nickname + "님이 메시지를 보냈습니다.", {
            action: [
              {
                text: "See",
                onClick: (e, toastObject) => {
                  this.$store.commit("tabClicked", senderIndex);
                  toastObject.goAway(0);
                },
              },
              {
                text: "Close",
                onClick: (e, toastObject) => {
                  toastObject.goAway(0);
                },
              },
            ],
          });
        }
      });

      this.$root.userSocket.on(UserEvent.ONLINE, (data) => {
        console.log(data);
        this.$store.commit("user/setOnline", data);
      });

      this.$root.userSocket.on(UserEvent.OFFLINE, (data) => {
        console.log(data);
        this.$store.commit("user/setOnline", data);
      });

      this.$root.userSocket.on(UserEvent.INVITE, (data) => {
        console.log(data);
        this.$store.commit("user/addNotification", data);
        this.$toast.show(data.data.message, {
          action: [
            {
              text: "See",
              onClick: (e, toastObject) => {
                this.$emit("notification");
                toastObject.goAway(0);
              },
            },
            {
              text: "Close",
              onClick: (e, toastObject) => {
                toastObject.goAway(0);
              },
            },
          ],
        });
      });
    }

    this.$root.lobbySocket.emit(GameRoomEvent.JOIN, {
      roomId: 0,
    });
  },
  // watch: {
  //   subscribedStreams(newVal, oldVal) {
  //     if (this.subscribedStreams.length) {
  //       this.$store.commit("stream/removeAllSubscribers");
  //     }
  //   },
  // },
  created() {
    this.$store.dispatch("user/fetchMyInfo");
  },
  beforeDestroy() {
    this.evtSource.close();
    this.$root.lobbySocket.emit(GameRoomEvent.LEAVE);
  },
};
</script>
<style lang="scss" scoped></style>
