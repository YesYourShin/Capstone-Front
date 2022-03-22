<template>
  <div class="mypagebox">
      <Header/>
      <div class="myProfileTop">
        <div class="myProfile">
          <p class="mypageText">MyPage</p>
          <form v-on:submit.prevent="submitForm" class="mypageForm">
            <div class="mypageInput">
              <p>이미지 : <input
              class="imgInput"
              type="file"
              name="user_img"
              accept="image/png, image/jpeg"
              ref="imagedata"
              @change="myimage">
              </p>
            </div>
            <div class="mypageInput">
              <p class="p1">닉네임 : <input type="text" name="user_name"
              v-model="nickname"></p>
            </div>
            <div class="mypageInput">
              <p class="p2">상태 메시지 : <input type="text" name="user_text" v-model="selfIntroduction"></p>
            </div>
          <input type="submit" class="rebtn" value="회원 정보 저장"
          onclick="document.location.href='/'">
          </form>
          <div class="mypagebtns">
            <button>내가 쓴 글보기</button>
            <button>내가 쓴 댓글보기</button>
            <button>회원탈퇴</button>
          </div>
        </div>
      </div>
      <Footer/>
  </div>
</template>

<script>
import Footer from '../components/footer.vue';
import Header from '../components/header.vue';
import { makeProfile } from '@/api/mafiaAPI';
import { editProfile } from '@/api/mafiaAPI';
import { getMyInformation } from '@/api/mafiaAPI'



export default {
  components: { Header, Footer },
  name: "CapstoneMypage",

  data() {
    return {
        nickname : '',
        image: '',
        selfIntroduction : '',
        data:{
          data:[],
            }
    };
  },

  async mounted() {
     const response = await getMyInformation()
     this.data = response.data

    this.nickname =  this.data.data.profile.nickname;
    this.selfIntroduction =  this.data.data.profile.selfIntroduction;

  },

  methods: {

    myimage(){
      this.image = this.$refs.imagedata.files
      // if(){
      // }else if(){
      // } 이미지 디폴트 값
    },

    submitForm(){
       console.log(this.nickname, this.selfIntroduction, this.image);

      var data = {
        // image : this.image, 500 serve error
        nickname: this.nickname,
        selfIntroduction: this.selfIntroduction
      }

      if(this.data.data.profile == null){
        makeProfile(data)
          .then((res)=>{
          })
          .catch((err)=>{
            console.log(error)
          })
      }else if(this.data.data.profile !== null){
        editProfile(data)
        .then((res)=>{
        })
        .catch((err)=>{
          console.log(error)
        })
      }
    },
  },

};
</script>

<style lang="scss" scoped>
@import "~assets/mypage.scss";
</style>
