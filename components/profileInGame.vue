<template>
  <div class="fullProfile h-screen flex flex-col">
    <div class="profileBox">
      <div class="profile1">
        <img
          v-if="this.myInfo.profile.image"
          v-bind:src="this.myInfo.profile.image.location"
          class="profileimg"
        />
        <img v-else src="@/assets/pageimg/test.png" class="profileimg" />
        <!-- <img src="@/assets/pageimg/test.png" class="profileimg" /> -->
      </div>

      <div class="profile2" v-if="this.myInfo">
        <button class="userlink">
          <NuxtLink to="/mypage" class="btnlink">MyPage</NuxtLink>
        </button>
        <button class="userlink" @click="logout">Logout</button>
        <p class="userlevel">
          Lv.250
          <span class="username" v-if="this.myInfo.profile">
            {{ this.myInfo.profile.nickname }}
          </span>
          <span class="username" v-else> ID : {{ this.myInfo.id }} </span>
        </p>
        <p class="usertext" v-if="this.myInfo.profile">
          {{ this.myInfo.profile.selfIntroduction }}
        </p>
        <p class="usertext" v-else>상태메세지를 입력해주세요.</p>
      </div>

      <div class="profile3">
        <button class="profileButton" v-on:click="friend">친구</button>
        <button class="profileButton" v-on:click="ball">알림</button>
        <button class="profileButton" v-on:click="record">전적</button>
      </div>
    </div>
    <div class="overflow-auto flex flex-col" v-if="show1">
      <div class="profile4 grow">
        <friend-bar></friend-bar>
      </div>
    </div>

    <div class="profileAlert grow" v-if="show2">
      <div class="alertBox">
        <p>???에게 친구 신청이 왔습니다.</p>
        <div class="cancel">
          <div class="cancel1"></div>
          <div class="cancel2"></div>
        </div>
      </div>
      <div class="alertBox">
        <p>???에게 메세지가 도착했습니다.</p>
        <div class="cancel">
          <div class="cancel1"></div>
          <div class="cancel2"></div>
        </div>
      </div>
      <div class="alertBox">
        <p>???에게 게임 초대가 왔습니다.</p>
        <div class="cancel">
          <div class="cancel1"></div>
          <div class="cancel2"></div>
        </div>
      </div>

      <div class="alertBox">
        <p>???에게 메세지가 도착했습니다.</p>
        <div class="cancel">
          <div class="cancel1"></div>
          <div class="cancel2"></div>
        </div>
      </div>
      <div class="alertBox">
        <p>???에게 메세지가 도착했습니다.</p>
        <div class="cancel">
          <div class="cancel1"></div>
          <div class="cancel2"></div>
        </div>
      </div>

      <div class="cancelButton" :click="cancel">
        <button>전체 삭제</button>
      </div>
    </div>

    <div class="profile6 grow" v-if="show3">
      <p>전적</p>
    </div>
  </div>
</template>

<script>
import FriendBar from "./profile_elements/friendBar.vue";
import { logout } from "@/api/mafiaAPI";
export default {
  name: "CapstoneProfile",

  components: {
    FriendBar,
  },

  data() {
    return {
      show1: true,
      show2: false,
      show3: false,
    };
  },

  methods: {
    cancel() {},
    friend() {
      if (this.show1) {
        return;
      } else {
        this.show1 = !this.show1;
        if (this.show2 == true) {
          this.show2 = !this.show2;
        } else if (this.show3 == true) {
          this.show3 = !this.show3;
        }
      }
    },
    ball() {
      if (this.show2) return;
      this.show2 = !this.show2;
      if (this.show1 == true) {
        this.show1 = !this.show1;
      } else if (this.show3 == true) {
        this.show3 = !this.show3;
      }
    },
    record() {
      if (this.show3) return;
      this.show3 = !this.show3;
      if (this.show2 == true) {
        this.show2 = !this.show2;
      } else if (this.show1 == true) {
        this.show1 = !this.show1;
      }
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
