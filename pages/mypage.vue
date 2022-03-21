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
              @change="myimage">
              </p>
            </div>
            <div class="mypageInput">
              <p class="p1">닉네임 : <input type="text" name="user_name" v-model="nickname"></p>
            </div>
            <div class="mypageInput">
              <p class="p2">상태 메시지 : <input type="text" name="user_text" v-model="selfIntroduction"></p>
            </div>
            <input type="submit" class="rebtn" value="회원 정보 저장">
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
import { getMyInformation } from '@/api/mafiaAPI'

export default {
  components: { Header, Footer },
  name: 'CapstoneMypage',

  data() {
    return {
        nickname : '',
        imgsrc: require('../assets/myimg/default.png'),
        selfIntroduction : '',
      data:{
        data:[

        ],
      }
    };
  },

  async mounted() {
     const response = await getMyInformation()
     this.data = response.data
  },

  methods: {
    submitForm(){
      console.log(this.nickname, this.selfIntroduction);
      var data = {
        image : this.image,
        nickname: this.nickname,
        selfIntroduction: this.selfIntroduction
      }
      getMyInformation(data)
        .then((res)=>{
        })
        .catch((err)=>{
          console.log(error)
        })
    },

    myimage(){

    }



  },

};
</script>

<style lang="scss" scoped>
@import '~assets/mypage.scss';
</style>
