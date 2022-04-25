<template>
  <div class="mypagebox">
      <Header/>
      <div class="myProfileTop">
        <div class="myProfile">
          <p class="mypageText">MyPage</p>
          <form v-on:submit.prevent="submitForm" class="mypageForm">

            <div class="mypageInput">
              <img v-if="this.profile.image" v-bind:src="this.profile.image.location" class="proimge">
              <img v-else src="@/assets/pageimg/test.png" class="proimge" />
              <p>이미지 : <input
              class="imgInput"
              type="file"
              id="myFile"
              v-on:change="fileSlc">
              </p>
              <button @click="detimg">이미지 삭제</button>
            </div>
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
import { makeProfile,editProfile,withdrawUser,storeProfileImage,destroyProfileImage } from '@/api/mafiaAPI';
import { copyObj } from '@/common/CopyObj';
export default {
  components: { Header, Footer },
  name: "CapstoneMypage",
  data() {
    return {
        profile:{
          nickname : '',
          image: {
            originalname:'',
            encoding:'',
            mimetype:'',
            size:'',
            key: '',
            location: '',
          },
          selfIntroduction : '',
        },
      };
    },

  methods: {
    detimg(){
      this.profile.image = null;
      // destroyProfileImage()
      // this.$store.dispatch('fetchMyInfo')
    },
    submitForm(){
      if(!this.myInfo?.profile){
      makeProfile(this.profile)
        .then((res)=>{
          })
        .catch((err)=>{
          console.log(error)
          })
      }else{
        editProfile(this.profile)
        .then((res)=>{
          //  console.log(this.profile)
        })
        .catch((err)=>{
          console.log(error)
        })
      }
    },

  fileSlc(){
        let ete = document.getElementById('myFile').files[0];
        //  console.log(ete)

        storeProfileImage(ete)
        .then((res)=>{
          // console.log(res)
          this.profile.image = res.data.data
        })
        .catch((err)=>{
          console.log(error)
        })
    },

  endbtn(){
    withdrawUser()
  }
  },

  async mounted(){
    await this.$store.dispatch('user/fetchMyInfo')

    if(!this.myInfo.profile){
     await this.$swal("프로필을 설정해주십시요.");
    }

    if(this.myInfo.profile){
     this.profile = copyObj(this.myInfo.profile);
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
