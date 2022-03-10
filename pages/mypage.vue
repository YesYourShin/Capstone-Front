<template>
  <div class="mypagebox">
    <Header/>
    <div class="myProfile">
      <p class="mypageText">MyPage</p>
      <form action="" method="" class="mypageForm">
        <div class="mypageInput">
          <p>이미지 : <input type="text" name="user_img"></p>
        </div>
        <div class="mypageInput">
          <p>닉네임 : <input type="text" name="user_name"></p>
        </div>
        <div class="mypageInput">
          <p>상태 메시지 : <input type="text" name="user_text"></p>
        </div>
         <input type="submit" class="rebtn" value="수정">
      </form>
      <div class="mypagebtns">
        <button>내가 쓴 글보기</button>
        <button>내가 쓴 댓글보기</button>
        <button>회원탈퇴</button>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Footer from '../components/footer.vue';
import Header from '../components/header.vue';

export default {
  components: { Header, Footer },
  name: 'CapstoneMypage',

  data() {
    return {

    };
  },

  mounted() {

  },

  methods: {

  },
};
</script>

<style lang="scss" scoped>
@import '~assets/mypage.scss';
</style>
