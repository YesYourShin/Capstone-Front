<template>
  <div class="fullfile h-screen flex flex-col">
    <div class="profilebox">
      <div class="profile1">
        <img src="@/assets/pageimg/test.jpg" class="profileimg" />
      </div>

      <div class="profile2">
        <button class="userlink">
          <NuxtLink to="/mypage" class="btnlink">MyPage</NuxtLink>
        </button>
        <button class="userlink">Logout</button>
        <p class="userlevel">Lv.250 <span class="username">Mirai0625</span></p>
        <p class="usertext">Mirai1412/Capstone-Front</p>
      </div>

      <div class="profile3">
        <button class="profilebutton" v-on:click="friend">친구</button>
        <button class="profilebutton" v-on:click="ball">알림</button>
        <button class="profilebutton" v-on:click="record">전적</button>
      </div>
    </div>

    <div class="profile4 grow" v-if="show1">
      <p>친구</p>
    </div>

    <div class="profileball grow" v-if="show2">
      <div class="ballbox">
        <p>???에게 친구 신청이 왔습니다.</p>
        <div class="cance">
          <div class="cance1"></div>
          <div class="cance2"></div>
        </div>
      </div>
      <div class="ballbox">
        <p>???에게 메세지가 도착했습니다.</p>
        <div class="cance">
          <div class="cance1"></div>
          <div class="cance2"></div>
        </div>
      </div>
      <div class="ballbox">
        <p>???에게 게임 초대가 왔습니다.</p>
        <div class="cance">
          <div class="cance1"></div>
          <div class="cance2"></div>
        </div>
      </div>

      <div class="ballbox">
        <p>???에게 메세지가 도착했습니다.</p>
        <div class="cance">
          <div class="cance1"></div>
          <div class="cance2"></div>
        </div>
      </div>
      <div class="ballbox">
        <p>???에게 메세지가 도착했습니다.</p>
        <div class="cance">
          <div class="cance1"></div>
          <div class="cance2"></div>
        </div>
      </div>

      <div class="cancebutton" :click="cance">
        <button>전체 삭제</button>
      </div>
    </div>

    <div class="profile6 grow" v-if="show3">
      <p>전적</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CapstoneProfile",

  data() {
    // axios.get('http://localhost:3065/api/users') .then(res => {
    //    console.log(res.data)
    //    })

    return {
      show1: false,
      show2: false,
      show3: false,
    };

  },

  methods: {
    cance() {},
    friend() {
      this.show1 = !this.show1;
      if (this.show2 == true) {
        this.show2 = !this.show2;
      } else if (this.show3 == true) {
        this.show3 = !this.show3;
      }
    },
    ball() {
      this.show2 = !this.show2;
      if (this.show1 == true) {
        this.show1 = !this.show1;
      } else if (this.show3 == true) {
        this.show3 = !this.show3;
      }
    },
    record() {
      this.show3 = !this.show3;
      if (this.show2 == true) {
        this.show2 = !this.show2;
      } else if (this.show1 == true) {
        this.show1 = !this.show1;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/profile.scss";
</style>
