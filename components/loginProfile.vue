<template>
  <div class="loginbox">
    <button class="btn1"><a href="http://localhost:3065/api/auth/google/login">구글 로그인</a></button>
    <button class="btn3"><a href="http://localhost:3065/api/auth/naver/login">네이버 로그인</a></button>
    <button class="btn2"><a href="http://localhost:3065/api/auth/kakao/login">카카오 로그인</a></button>
  </div>
</template>

<script>
import axios from 'axios';

export default {


};
</script>

<style lang="scss" scoped>
@import "~assets/loginProfile.scss";
</style>
