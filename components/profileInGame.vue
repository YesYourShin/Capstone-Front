<template>
  <div class="fullProfile h-screen flex flex-col">
    <div class="profileBox">
      <div class="profile1">
        <template v-if="myInfo">
          <img
            v-if="myInfo.profile.image"
            v-bind:src="myInfo.profile.image.location"
            class="profileImg"
          />
          <img v-else src="@/assets/pageimg/test.png" class="profileImg" />
        </template>
        <!-- <img src="@/assets/pageimg/test.png" class="profileimg" /> -->
      </div>

      <div class="profile2" v-if="myInfo">
        <button class="userlink">
          <NuxtLink to="/mypage" class="btnlink">MyPage</NuxtLink>
        </button>
        <button class="userlink" @click="logout">Logout</button>
        <p class="userlevel">
          Lv.{{ myInfo.profile.level }}
          <span class="username" v-if="myInfo.profile">
            {{ myInfo.profile.nickname }}
          </span>
          <span class="username" v-else> ID : {{ myInfo.id }} </span>
        </p>
        <p class="usertext" v-if="myInfo.profile">
          {{ myInfo.profile.selfIntroduction }}
        </p>
        <p class="usertext" v-else>상태메세지를 입력해주세요.</p>
      </div>

      <div class="profile3">
        <button class="profileButton" v-on:click="friend">친구</button>
        <button class="profileButton" v-on:click="notification">알림</button>
        <button class="profileButton" v-on:click="record">전적</button>
      </div>
    </div>
    <UserSearch v-if="show1"></UserSearch>
    <div class="flex flex-col overflow-auto" v-if="show1">
      <div class="profile4 grow">
        <friend-bar></friend-bar>
      </div>
    </div>

    <div class="profileAlert grow" v-if="show2">
      <Notifications></Notifications>
    </div>

    <div class="profile6 grow" v-if="show3">
      <p>전적</p>
    </div>
  </div>
</template>

<script>
import FriendBar from "./profile_elements/friendBar.vue";
import UserSearch from "./profile_elements/UserSearch.vue";
import Notifications from "./profile_elements/Notifications.vue";
import { logout, getNotifications } from "@/api/mafiaAPI";
export default {
  name: "CapstoneProfile",

  components: {
    FriendBar,
    UserSearch,
    Notifications,
  },

  data() {
    return {
      show1: true,
      show2: false,
      show3: false,
      myNotifications: [],
    };
  },

  methods: {
    friend() {
      this.show1 = true;
      this.show2 = false;
      this.show3 = false;
    },
    notification() {
      getNotifications({
        userId: this.myInfo.id,
        page: 1,
        perPage: 10,
      })
        .then((response) => {
          this.myNotifications = response.data.data;
        })
        .catch((err) => {
          console.error("Error occurred while getting notification data.", err);
        });
      this.show1 = false;
      this.show2 = true;
      this.show3 = false;
    },
    record() {
      this.show1 = false;
      this.show2 = false;
      this.show3 = true;
    },
    logout() {
      const link = "http://localhost:7000";
      if ((this.data = Object)) {
        logout()
          .then((response) => {
            console.log("logout");
          })
          .catch((err) => {
            console.log(err);
          });
        location.href = link;
      }
    },
  },
  computed: {
    myInfo() {
      return this.$store.getters["user/getMyInfo"];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/profileInGame.scss";
</style>
