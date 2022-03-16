<template>
  <div class="loginbox">
    <button class="btn1">
      <a
        :href="
          process.env.NODE_ENV === 'production'
            ? 'https://gjgjajaj.xyz/api/auth/google/login'
            : 'http://localhost:3065/api/auth/google/login'
        "
        >구글 로그인</a
      >
    </button>
    <button class="btn3">
      <a
        :href="
          process.env.NODE_ENV === 'production'
            ? 'https://gjgjajaj.xyz/api/auth/naver/login'
            : 'http://localhost:3065/api/auth/naver/login'
        "
        >네이버 로그인</a
      >
    </button>
    <button class="btn2">
      <a
        :href="
          process.env.NODE_ENV === 'production'
            ? 'https://gjgjajaj.xyz/api/auth/kakao/login'
            : 'http://localhost:3065/api/auth/kakao/login'
        "
        >카카오 로그인</a
      >
    </button>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "~assets/loginProfile.scss";
</style>
