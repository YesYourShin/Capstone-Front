<template lang="">
  <div>
    <div
      v-for="item in notifications"
      :key="item.uuid"
      class="mx-2 my-2 bg-white flex items-center border-[3px] border-black justify-between px-2"
    >
      <p>
        {{ item.type === "REQUESTED_FRIEND" ? item.data : item.data.message }}
      </p>
      <!-- <div class="cancel">
        <div class="cancel1"></div>
        <div class="cancel2"></div>
      </div> -->
      <div class="">
        <div class="flex items-center">
          <div
            class="p-1 ml-1 rounded-full hover:bg-green-500/25 hover:cursor-pointer transition duration-300"
            @click="onClickApproveButton(item)"
          >
            <svg
              class="w-6 h-6"
              fill="rgb(34 197 94)"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z"
              />
            </svg>
          </div>
          <div
            class="p-1 ml-1 rounded-full hover:bg-red-500/25 hover:cursor-pointer transition duration-300"
            @click="onClickRejectButton(item)"
          >
            <svg
              class="w-6 h-6"
              fill="rgb(239 68 68)"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div v-if="notifications.length" class="cancelButton" @click="cancel">
      <button>전체 삭제</button>
    </div>
    <div v-else class="text-zinc-500 text-center mt-4">
      <p>There are no unread notifications.</p>
    </div>
  </div>
</template>
<script>
import {
  confirmFriendRequest,
  readNotification,
  roomAccept,
  getRoom,
} from "@/api/mafiaAPI";

export default {
  props: {
    notifications: {
      type: Array,
      required: true,
      default: [],
    },
  },
  computed: {
    myInfo() {
      return this.$store.getters["user/getMyInfo"];
    },
  },
  methods: {
    cancel() {
      console.log("전체 삭제 발동");
      const vm = this;
      this.notifications.forEach((item) => {
        vm.onClickRejectButton(item);
      });
    },
    async onClickApproveButton(item) {
      if (!this.myInfo) return;
      if (item.type === "REQUESTED_FRIEND") {
        try {
          const response = await confirmFriendRequest(
            this.myInfo.id,
            item.userId,
            {
              requestAction: "accept",
            }
          );
          this.$store.commit("user/addFriend", response.data.data);
          this.$swal({
            title: "✧*｡٩(ˊᗜˋ*)و✧*｡",
            text: `Now you are friend with ${response.data.data.nickname}!`,
            icon: "success",
          });
        } catch (error) {
          console.log(error);
        }
      } else if (item.type === "INVITED_GAME") {
        try {
          const response = await roomAccept(
            item.data.roomId,
            item.userId,
            item.targetId,
            item.uuid
          );
          if (response.data.data.joinable) {
            getRoom(response.data.data.roomId)
              .then((res) => {
                this.$store.commit(
                  "stream/setRoomMembers",
                  res.data.data.members
                );
                this.$router.push({
                  name: "room-id",
                  params: {
                    id: res.data.data.id,
                    room: res.data.data.room,
                    pin: response.data.data.pin,
                  },
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        } catch (error) {
          console.log(error);
          this.$swal({
            icon: "error",
            title: error.response.data.data.message,
          });
        }
      }

      try {
        const response = await readNotification(this.myInfo.id, {
          uuid: item.uuid,
        });
        this.$store.commit("user/readNotification", response);
      } catch (error) {
        console.log(error);
      }
    },
    async onClickRejectButton(item) {
      if (!this.myInfo) return;
      if (item.type === "REQUESTED_FRIEND") {
        try {
          const response = await confirmFriendRequest(
            this.myInfo.id,
            item.userId,
            {
              requestAction: "reject",
            }
          );
        } catch (error) {
          console.log(error);
        }
      }
      try {
        const response = await readNotification(this.myInfo.id, {
          uuid: item.uuid,
        });
        this.$store.commit("user/readNotification", response);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.cancelButton {
  text-align: center;
  color: white;
  padding-bottom: 10px;
}
</style>
