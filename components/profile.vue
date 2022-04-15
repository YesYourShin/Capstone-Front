<template>
  <div class="fullfile h-screen flex flex-col">
    <div class="profilebox">
      <div class="profile1">
        <img src="@/assets/pageimg/test.jpg" class="profileimg" />
      </div>
      <div class="profile2" v-if="this.myInfo">
        <button class="userlink">
          <NuxtLink to="/mypage" class="btnlink">MyPage</NuxtLink>
        </button>
        <button class="userlink" @click="logout">Logout</button>
        <p class="userlevel">Lv.1
          <span class="username" v-if=" this.myInfo.profile">
          {{ this.myInfo.profile.nickname }}
          </span>
          <span class="username" v-else>
             {{ this.myInfo.id }}번회원
          </span>
          </p>
        <p class="usertext"  v-if=" this.myInfo.profile">
           {{ this.myInfo.profile.selfIntroduction }}
        </p>
        <p class="usertext" v-else>
          상태메세지를 입력해주세요.
        </p>
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

      <div class="cancebutton" >
        <button>전체 삭제</button>
      </div>
    </div>

    <div class="profile6 grow" v-if="show3">
      <p>전적</p>
    </div>
  </div>
</template>

<script>
import { logout } from '@/api/mafiaAPI'

export default {
  name: "CapstoneProfile",

  data() {
    return {
      show1: false,
      show2: false,
      show3: false,
    };
  },

  methods: {
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
      logout(){
        const link = 'http://localhost:7000';
        if(this.data = Object){
              logout()
              .then(response => {
                console.log('logout')
              }).catch(err => {
                console.log(err)
              })
            location.href=link;
        }
      },
  },

  computed:{
    myInfo(){
      return this.$store.getters['user/getMyInfo']
    }
  },
};
</script>
<style lang="scss" scoped>
@import "~assets/profile.scss";
</style>
