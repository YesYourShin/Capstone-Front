<template>
  <div class="loginbox">
      <a :href="googleLoginURL" class="btn1">구글 로그인</a>
      <a :href="naverLoginURL" class="btn3">네이버 로그인</a>
      <a :href="koakaoLoginURL"  class="btn2">카카오 로그인</a>
  </div>
</template>

<script>
export default {

  data() {
    return {
      data: [],
      googleLoginURL: process.env.NODE_ENV === 'production'
            ? 'https://gjgjajaj.xyz/api/auth/google/login'
            : 'http://localhost:3065/api/auth/google/login',
      naverLoginURL: process.env.NODE_ENV === 'production'
            ? 'https://gjgjajaj.xyz/api/auth/naver/login'
            : 'http://localhost:3065/api/auth/naver/login',
      koakaoLoginURL: process.env.NODE_ENV === 'production'
            ? 'https://gjgjajaj.xyz/api/auth/kakao/login'
            : 'http://localhost:3065/api/auth/kakao/login'
    };
  },
  async mounted() {
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/loginProfile.scss";
</style>
