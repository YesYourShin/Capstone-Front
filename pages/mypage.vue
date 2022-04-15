<template>
  <div class="mypagebox">
      <Header/>
      <div class="myProfileTop">
        <div class="myProfile">
          <p class="mypageText">MyPage</p>
          <form v-on:submit.prevent="submitForm" class="mypageForm">
            <!-- <div class="mypageInput">
              <p>이미지 : <input
              class="imgInput"
              type="file"
              name="user_img"
              accept="image/png, image/jpeg"
              ref="imagedata"
              @change="myimage">
              </p>
            </div> -->
            <div class="mypageInput">
              <p class="p1">닉네임 : <input type="text" name="user_name"
              v-model="profile.nickname"></p>
            </div>
            <div class="mypageInput">
              <p class="p2">상태 메시지 : <input type="text"
              name="user_text" v-model="profile.selfIntroduction"></p>
            </div>
          <input type="submit" class="rebtn" value="회원 정보 저장"
          onclick="document.location.href='/'">
          </form>
          <div class="mypagebtns">
            <button>내가 쓴 글보기</button>
            <button>내가 쓴 댓글보기</button>
            <button @click="endbtn"
            onclick="document.location.href='/'">회원탈퇴</button>
          </div>
        </div>
      </div>
      <Footer/>
  </div>
</template>

<script>
import Footer from '../components/footer.vue';
import Header from '../components/header.vue';
import { makeProfile,editProfile,withdrawUser } from '@/api/mafiaAPI';

export default {
  components: { Header, Footer },
  name: "CapstoneMypage",
  data() {
    return {
        profile:{
          nickname : '',
          image: '',
          selfIntroduction : '',
        },
      };
    },

  methods: {
     submitForm(){
       if(this.myInfo.profile == null){
        makeProfile(this.profile)
          .then((res)=>{
            })
          .catch((err)=>{
            console.log(error)
            })
       }else{
          editProfile(this.profile)
          .then((res)=>{
          })
          .catch((err)=>{
            console.log(error)
          })
       }
     },
    myimage(){
      //   this.image = this.$refs.imagedata.files
      //   // if(){
      //   // }else if(){
      //   // } 이미지 디폴트 값
     },
    endbtn(){
      withdrawUser()
    }
  },

  async mounted(){
     await this.$store.dispatch('user/fetchMyInfo')

    if(this.myInfo.profile){
     this.profile.nickname =  this.myInfo.profile.nickname;
     this.profile.selfIntroduction =  this.myInfo.profile.selfIntroduction;
    }

  },

  computed:{
    myInfo(){
      return this.$store.getters['user/getMyInfo']
    }
  },

};
</script>

<style lang="scss" scoped>
@import "~assets/mypage.scss";
</style>
